# Reads BACKLOG.md, parses each "## #N, <title>" section, and posts it
# to GitHub Issues on the current repo via gh CLI.
#
# Usage (one time):
#   gh auth login
#   ./tools/post-backlog-to-issues.ps1
#
# Re-running is safe: it skips any issue whose title already exists.

$ErrorActionPreference = 'Stop'

# Refresh PATH so gh is reachable even if installed in this session.
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "gh CLI not found. Install with 'winget install GitHub.cli', then 'gh auth login'."
    exit 1
}

gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Not logged into gh. Run 'gh auth login' first."
    exit 1
}

$backlogPath = Join-Path $PSScriptRoot '..\BACKLOG.md'
if (-not (Test-Path $backlogPath)) {
    Write-Error "BACKLOG.md not found at $backlogPath"
    exit 1
}

# Get existing issue titles so we don't double-post.
Write-Host 'Fetching existing issues...' -ForegroundColor Cyan
$existing = (gh issue list --state all --limit 200 --json title | ConvertFrom-Json) | ForEach-Object { $_.title.Trim() }
$existingSet = @{}
foreach ($t in $existing) { $existingSet[$t] = $true }

# Parse BACKLOG.md
$content = Get-Content -Path $backlogPath -Raw -Encoding UTF8
$entries = $content -split "(?ms)^---\s*$"

$created = 0
$skipped = 0
$failed = 0
$tempDir = Join-Path $env:TEMP "backlog-bodies"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

foreach ($entry in $entries) {
    $entry = $entry.Trim()
    if (-not $entry.StartsWith('## #')) { continue }

    $headingMatch = [regex]::Match($entry, '(?m)^## #\d+,\s*(.+?)\s*$')
    if (-not $headingMatch.Success) { continue }
    $title = $headingMatch.Groups[1].Value.Trim()

    $labels = @()
    $labelsMatch = [regex]::Match($entry, '(?m)^\*\*Labels:\*\*\s*(.+?)\s*$')
    if ($labelsMatch.Success) {
        $labelLine = $labelsMatch.Groups[1].Value
        $labels = [regex]::Matches($labelLine, '`([^`]+)`') | ForEach-Object { $_.Groups[1].Value }
    }

    $bodyMatch = [regex]::Match($entry, '(?ms)^\*\*Body:\*\*\s*$\r?\n(.+)$')
    $body = if ($bodyMatch.Success) { $bodyMatch.Groups[1].Value.Trim() } else { '(see BACKLOG.md for full content)' }

    if ($existingSet.ContainsKey($title)) {
        Write-Host "SKIP (already exists): $title" -ForegroundColor Yellow
        $skipped++
        continue
    }

    # Write body to a temp file so gh reads it via --body-file. This avoids
    # every PowerShell argument-quoting issue with markdown bodies.
    $bodyFile = Join-Path $tempDir ([Guid]::NewGuid().ToString() + '.md')
    Set-Content -Path $bodyFile -Value $body -Encoding UTF8

    $argList = @('issue', 'create', '--title', $title, '--body-file', $bodyFile)
    foreach ($label in $labels) {
        $argList += @('--label', $label)
    }

    Write-Host "CREATE: $title" -ForegroundColor Green
    $url = & gh @argList 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  -> $url"
        $created++
    } else {
        Write-Host "  ! gh exited $LASTEXITCODE" -ForegroundColor Red
        Write-Host "    $url" -ForegroundColor DarkGray
        $failed++
    }
    Remove-Item -Force $bodyFile -ErrorAction SilentlyContinue
}

Write-Host ''
Write-Host "Done. Created: $created. Skipped (already exist): $skipped. Failed: $failed." -ForegroundColor Cyan
