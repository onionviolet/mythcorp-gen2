# Literature sweep for the cybercrime paper, 2026-10-07

Research only. Nothing here is accepted into `/wc/papers/ai-cybercrime` yet.
Every work below was opened on 2026-10-07 at the link given (publisher page,
arXiv, DOI resolver, Crossref record, or the institution's own page). Where I
could only confirm a number through secondary coverage, I say so. Quotes are
under 15 words; the rest is paraphrase.

Thesis being tested: AI moves the hard part of cybercrime from skill to access
for the second time (A2); AI arrives into a repair window that was already
closing (A1); the 2027 to 2030 question is whether repair speeds up as fast as
discovery; harm data so far show no measurable AI-driven wave (A5).

## 1. Ranked: the works that would most improve the paper

**1. Lohn, A., and Jackson, K. (August 2022). *Will AI Make Cyber Swords or Shields?* CSET, Georgetown.**
[Page](https://cset.georgetown.edu/publication/will-ai-make-cyber-swords-or-shields/), [PDF](https://cset.georgetown.edu/wp-content/uploads/CSET-Will-AI-Make-Cyber-Swords-or-Shields.pdf). Open.
Models phishing and the vulnerability lifecycle and finds that patches are usually ready fast (about 80% on disclosure day) while adoption is the slow step; a fivefold speedup in patch adoption cut peak exposed vulnerabilities by about 25%. It also finds that faster discovery helps defenders, but discovery that keeps going over long periods (human-like creativity) can hurt them.
*Use:* Section 2 (repair side) and the backlog figure. It is the closest existing model of the paper's central question, and it says the lever is deployment, not fixing. That sharpens the "What follows" section: put the policy weight on patch adoption.

**2. Bengio, Y. (chair) et al. (3 February 2026). *International AI Safety Report 2026.*** [Report page](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026). Open. (First edition: arXiv:2501.17805, 29 January 2025, [link](https://arxiv.org/abs/2501.17805).)
The most authoritative consensus document, backed by 30+ governments. It says criminal and state groups actively use general-purpose AI, cites an AI agent finding 77% of vulnerabilities in a competition (likely AIxCC, which the paper already cites), and says it remains uncertain whether attackers or defenders benefit more.
*Use:* Section 1 and A5. Citing it shows the paper's framing (real use, unmeasured harm, open offense-defense question) matches the international consensus, which is a stronger position than resting on vendor reports.

**3. UK AI Security Institute (18 December 2025). *Frontier AI Trends Report.*** [Link](https://www.aisi.gov.uk/frontier-ai-trends-report). Open.
Two years of evaluations of 30+ frontier systems. Apprentice-level cyber task success rose from under about 10% to about 50%, the first model to complete expert-level (10+ years) tasks appeared in 2025, the length of cyber tasks models finish alone doubles roughly every eight months, and the open-to-closed model gap is put at four to eight months.
*Use:* Section 5 (trend to forecast), A3, and the EndingsBranch "open-weight lag" watch item. It is a second government measurement next to CAISI's "about four months" and a cyber-specific doubling time next to METR's general one. The paper currently cites UK NCSC but not AISI.

**4. Garfinkel, B., and Dafoe, A. (2019). How does the offense-defense balance scale? *Journal of Strategic Studies*, 42(6), 736-763.** [doi:10.1080/01402390.2019.1631810](https://doi.org/10.1080/01402390.2019.1631810). Open (CC BY-NC-ND per Crossref; [Oxford ORA copy](https://ora.ox.ac.uk/objects/uuid:b537fa1a-f1df-4659-9405-979bc46dc67b)).
Argues that growing investment favors offense at low levels and defense at high levels ("OD-scaling"), using software-vulnerability attacks as one worked case.
*Use:* Section 7 (two endings). It gives the endings a theory: well-resourced, heavily invested defenders may come out ahead while the thinly defended tail does worse. That predicts a split outcome, which the paper's two endings do not yet consider.

**5. Murphy, B., and Stone, T. (14 August 2025). Uplifted Attackers, Human Defenders: The Cyber Offense-Defense Balance for Trailing-Edge Organizations. arXiv:2508.15808.** [Link](https://arxiv.org/abs/2508.15808). Open (preprint).
Argues that organizations on legacy systems with minimal defenses were mostly spared because attacking them did not pay, and that AI lowers attack cost enough to expose them; defense should shift to faster remediation and resilience.
*Use:* A2 and Section 9. This is the "access" thesis restated for victims rather than offenders: AI changes who is worth attacking. Pairs with Garfinkel and Dafoe on the split outcome. Preprint, not peer reviewed.

**6. Wan, S., Nikolaidis, C., Song, D., et al. (Meta) (2 August 2024, rev. September 2024). CyberSecEval 3. arXiv:2408.01605.** [Link](https://arxiv.org/abs/2408.01605). Open.
A controlled uplift study: novices with Llama 3 405B completed 22% more capture-the-flag phases, not statistically significant (p = 0.34), and none finished all phases; experts did slightly worse. Spear-phishing output rated moderate.
*Use:* Section 4 (barrier rubric) and A4. The paper's only controlled study is Heiding on phishing; this is the controlled study on intrusion, and it supports keeping intrusion scores low. Caveats: 2024 model, vendor evaluating its own open model, small sample.

**7. Anderson, R., Barton, C., Böhme, R., Clayton, R., Gañán, C., Grasso, T., Levi, M., Moore, T., and Vasek, M. (June 2019). Measuring the Changing Cost of Cybercrime. WEIS 2019, Boston.** [Cardiff ORCA accepted version](https://orca.cardiff.ac.uk/id/eprint/122684/) (403 to my fetcher; record confirmed via search). Open.
Updates the 2012 study (book chapter [doi:10.1007/978-3-642-39498-0_12](https://doi.org/10.1007/978-3-642-39498-0_12)). About half of property crime is now online; traditional frauds cost citizens hundreds per year, payment fraud tens, and new computer crimes tens of cents; defense costs tens; spending should shift from anticipation toward response.
*Use:* Section 3 and A5 for base rates, and Section 9 for "spend on response." The cost split also supports A6: the money is in fraud, not novel hacking.

**8. Nappa, A., Johnson, R., Bilge, L., Caballero, J., and Dumitraș, T. (May 2015). The Attack of the Clones: A Study of the Impact of Shared Code on Vulnerability Patching. IEEE S&P 2015, 692-708.** [doi:10.1109/SP.2015.48](https://doi.org/10.1109/SP.2015.48); [author copy](https://software.imdea.org/~juanca/papers/wine_oakland15.pdf). Open copy.
Five years of data on 8.4 million hosts and 1,593 client-side vulnerabilities: the median fraction of vulnerable hosts patched when exploits were released was at most 14%; automatic updating lowered time to patch.
*Use:* A1. Hard pre-AI evidence that the repair window was already lost on the user side, and that auto-update is the lever.

**9. Durumeric, Z., Li, F., Kasten, J., Amann, J., Beekman, J., Payer, M., Weaver, N., Adrian, D., Paxson, V., Bailey, M., and Halderman, J. A. (November 2014). The Matter of Heartbleed. IMC 2014, 475-488.** [doi:10.1145/2663716.2663755](https://doi.org/10.1145/2663716.2663755); [author copy](https://jhalderm.com/pub/papers/heartbleed-imc14.pdf). Open copy.
Heartbleed exposed an estimated 24-55% of popular HTTPS sites; a notification experiment on 150,000 hosts raised patching by nearly 50%.
*Use:* Section 2 and Section 9. A measured, cheap repair lever (notification). If AI floods the system with found flaws, notification at scale is one of the few interventions with an effect size.

**10. Kokotajlo, D., Alexander, S., Larsen, T., Lifland, E., and Dean, R. (3 April 2025). *AI 2027.*** [ai-2027.com](https://ai-2027.com/). Open. With: titotal (19 June 2025), [A deep critique of AI 2027's bad timeline models](https://titotal.substack.com/p/a-deep-critique-of-ai-2027s-bad-timeline); Kokotajlo, Lifland and Halstead (2 April 2026), [Q1 2026 timelines update](https://www.lesswrong.com/posts/XLLjqMxETva3ABtsK/q1-2026-timelines-update).
AI 2027 dates a Superhuman Coder to March 2027 and has superhuman hacking by late 2027. The critique argues the superexponential curve is built to blow up and the model is weakly fit to METR data; the authors' own medians moved out to late 2029 to early 2032 (December 2025 model) and back to mid 2028 to mid 2030 for an "Automated Coder" (April 2026).
*Use:* A3 and Section 6. A3 says Stage 3 was "then called Superhuman Coder," which is AI 2027's term, but no source in `paperSources.ts` cites it. Cite it, and show its own revisions as a measure of how uncertain dated stages are.

**11. Narayanan, A., and Kapoor, S. (15 April 2025). AI as Normal Technology. Knight First Amendment Institute.** [Link](https://knightcolumbia.org/content/ai-as-normal-technology). Open.
Argues AI diffuses slowly like past general technologies and that in cybersecurity, giving defenders strong AI tools often tips the balance their way (citing AI-assisted fuzzing).
*Use:* Section 3 and Section 7. The most widely read skeptical essay; the paper should answer it by name. See section 2 below.

**12. Brundage, M., Avin, S., Clark, J., Toner, H., Eckersley, P., et al. (26 authors) (20 February 2018). The Malicious Use of Artificial Intelligence: Forecasting, Prevention, and Mitigation. arXiv:1802.07228.** [Link](https://arxiv.org/abs/1802.07228). Open.
The founding forecast that AI would expand existing threats, introduce new ones and change their character, including cheaper, more targeted digital attacks.
*Use:* Introduction and Section 8. The paper is a forecast in the same line; checking which 2018 predictions came true by 2026 is a cheap, honest calibration test, and a reader will expect it to be cited.

**13. Verizon (2026). *2026 Data Breach Investigations Report* (data 1 November 2024 to 31 October 2025).** [Link](https://www.verizon.com/business/resources/reports/dbir/). Open (registration for PDF).
Verified on Verizon's page: exploitation of vulnerabilities is now the top initial access route at 31% of breaches; ransomware in about 48%; generative AI tied to 15 attack techniques. Via secondary coverage only ([SecurityWeek](https://www.securityweek.com/verizon-dbir-2026-vulnerability-exploitation-overtakes-credential-theft-as-top-breach-vector/amp/)): median time to fully patch KEV flaws rose from 32 to 43 days and only 26% were fully remediated, down from 38%. Confirm those two in the PDF before citing.
*Use:* Section 2 and A1. Repair getting slower while time-to-exploit is negative is the paper's argument in one pair of numbers. Conflict: Verizon sells managed security; contributor data is not a random sample.

**14. Rescorla, E. (2005). Is finding security holes a good idea? *IEEE Security & Privacy*, 3(1), 14-19.** [doi:10.1109/MSP.2005.17](https://doi.org/10.1109/MSP.2005.17); [open copy](https://sos-vo.org/system/files/sos_files/Is_Finding_Security_Holes_a_Good_Idea.pdf). Paywalled at IEEE, open copy exists.
Found the data could not rule out a constant rate of vulnerability discovery over long periods, so finding and disclosing bugs may not deplete the pool or lower intrusion costs.
*Use:* Section 7, the good ending. If AI defenders find flaws at scale but the pool does not shrink, the defensive ending needs repair, not discovery. Tests Glasswing-style optimism.

**15. Herley, C., and Florêncio, D. (2010). Nobody Sells Gold for the Price of Silver: Dishonesty, Uncertainty and the Underground Economy. In *Economics of Information Security and Privacy*, Springer, 33-53.** [doi:10.1007/978-1-4419-6967-5_3](https://doi.org/10.1007/978-1-4419-6967-5_3); [MSR-TR-2009-34, open](https://www.microsoft.com/en-us/research/publication/nobody-sells-gold-for-the-price-of-silver-dishonesty-uncertainty-and-the-underground-economy/).
Argues underground markets are lemons markets: rippers impose a tax on every trade, open markets are full of amateurs selling goods that are hard to cash out, and popular size estimates are inflated.
*Use:* A2 and A6. It narrows A2 further: cheaper skill does not fix the trust and cash-out problems, which matches what Leukfeldt found. Also a warning about headline cost figures (Europol's $10.5 trillion repeats one).

Also verified, lower priority: Levchenko et al. (2011), Click Trajectories, IEEE S&P, [doi:10.1109/SP.2011.24](https://doi.org/10.1109/SP.2011.24), open copy: a handful of banks settled about 95% of spam-advertised sales, a payment chokepoint that pairs with Dupont and the booter PayPal result in Section 9. Thomas et al. (2015), Framing Dependencies Introduced by Underground Commoditization, WEIS 2015, [Google Research](https://research.google/pubs/framing-dependencies-introduced-by-underground-commoditization/), open: the standard taxonomy of crime-as-a-service profit and support centers, a cleaner citation for A2's "second deskilling" than Collier alone. Lohn, A. J. (17 April 2025), The Impact of AI on the Cyber Offense-Defense Balance and the Character of Cyber Conflict, [arXiv:2504.13371](https://arxiv.org/abs/2504.13371): reviews 18 arguments and concludes there is no single answer. Schneier, B. (March/April 2018), Artificial Intelligence and the Attack/Defense Balance, *IEEE Security & Privacy*, [essay copy](https://www.schneier.com/essays/archives/2018/03/artificial_intellige.html).

## 2. Works that cut against the thesis

- **CyberSecEval 3 (#6).** The one controlled uplift study on intrusion found no significant novice uplift. If the paper's barrier-fell argument leans on intrusion at all, this is the evidence against it. It is from 2024, so it tests the past, not the 2026 frontier.
- **Narayanan and Kapoor (#11) and Schneier (2018).** Both argue defense gains more, because defenders hold access, scale and the ability to test first. The paper's "repair is the bottleneck" answer is a real rebuttal, but it has to be made explicitly.
- **Kapoor, Bommasani, Klyman et al. (27 February 2024), On the Societal Impact of Open Foundation Models, [arXiv:2403.07918](https://arxiv.org/abs/2403.07918).** Its marginal-risk framework says evidence on cyber misuse is insufficient to show added risk over existing tools. That directly challenges reading the CAISI open-weight lag as a risk signal without a marginal-risk argument.
- **Anderson et al. 2019 (#7) and Herley and Florêncio (#15).** Novel computer crime is a tiny share of cost, and underground markets are leakier than headlines suggest. Both push toward "the AI effect on harm will be smaller than capability suggests," which strengthens A5 but weakens any implied large future harm.
- **Garfinkel and Dafoe (#4).** If defense wins at high investment, the "repair loses" ending may hold only for the under-invested tail. Not a refutation, but it predicts a split the paper does not model.
- **AI 2027 critique and revisions (#10).** The forecasting tradition the paper borrows its stage names from has moved its own dates by years in both directions within 12 months.
- **The other direction: vendor and agency claims of an AI surge.** CrowdStrike's 2026 Global Threat Report (24 February 2026, [press release](https://www.crowdstrike.com/en-us/press-releases/2026-crowdstrike-global-threat-report/)) says AI-enabled adversary operations rose 89% and eCrime breakout time fell to 29 minutes. ENISA Threat Landscape 2025 (1 October 2025, [news page](https://www.enisa.europa.eu/news/etl-2025-eu-consistently-targeted-by-diverse-yet-convergent-threat-groups), 4,875 incidents, July 2024 to June 2025) says AI-supported phishing "reportedly" exceeded 80% of social engineering worldwide, a secondhand figure. These contradict A5's "no measurable wave" only if taken at face value; neither measures harm, and CrowdStrike sells the detection it reports on. The paper should cite them and say why it discounts them, or a reviewer will raise them.

## 3. Already well covered, skip

- **Europol IOCTA 2025 and 2026** (2026 edition published 28 April 2026). Per [eucrim's summary](https://eucrim.eu/news/iocta-2026/), it gives no AI-specific numbers and its AI claims are forward-looking. Adds nothing NCSC 2025 does not already say. (Europol's own site did not resolve for me.)
- **IBM / Ponemon Cost of a Data Breach 2025** ([page](https://www.ibm.com/reports/data-breach)). Survey of 600 breached organizations, sponsored by a vendor that sells the AI security it finds saves $1.9 million. Per-breach cost, not crime volume. Skip, or one line in the conflicts note.
- **Microsoft Digital Defense Report 2026** (covers July 2025 to June 2026, [page](https://www.microsoft.com/en-us/corporate-responsibility/cybersecurity/microsoft-digital-defense-report-2025)). Mostly qualitative on AI. Press coverage of the 2025 edition repeats a 54% AI-phishing click rate, the same figure as Heiding et al., which the paper already cites; I did not confirm whether Microsoft took it from Heiding. Skip.
- **Mirsky et al. (2023), The Threat of Offensive AI to Organizations, *Computers & Security* 124, 103006** ([doi:10.1016/j.cose.2022.103006](https://doi.org/10.1016/j.cose.2022.103006), arXiv:2106.15764 open). Highly cited but pre-LLM taxonomy (33 capabilities, expert survey). Superseded by GTIG and Anthropic incident reports already cited.
- **Buchanan et al. (November 2020), Automating Cyber Attacks, CSET** ([PDF](https://cset.georgetown.edu/wp-content/uploads/CSET-Automating-Cyber-Attacks.pdf)). Pre-LLM; Lohn and Jackson (#1) supersedes it for this paper.
- **Rodriguez et al. (Google DeepMind) (March 2025), A Framework for Evaluating Emerging Cyberattack Capabilities of AI, [arXiv:2503.11917](https://arxiv.org/abs/2503.11917).** Useful bottleneck analysis of 12,000+ AI-involved incidents, but overlaps GTIG reports already cited. Optional.
- **Epoch AI.** METR's time-horizon series, already cited twice, covers the trend role better for cyber.
- Mandiant M-Trends and Chainalysis: already cited.

## 4. Paywalled shortlist for W&L

Only items with no open copy I could find. Metadata from Crossref; content not read.

| Work | DOI | Why |
|---|---|---|
| Arora, A., Telang, R., and Xu, H. (2008). Optimal Policy for Software Vulnerability Disclosure. *Management Science* 54(4), 642-656. | [10.1287/mnsc.1070.0771](https://doi.org/10.1287/mnsc.1070.0771) | Canonical model of disclosure timing; tests whether CISA's 3-day deadline and AI-speed disclosure fit a welfare-optimal window. |
| Arora, A., Krishnan, R., Telang, R., and Yang, Y. (2010). An Empirical Analysis of Software Vendors' Patch Release Behavior: Impact of Vulnerability Disclosure. *Information Systems Research* 21(1), 115-132. | [10.1287/isre.1080.0226](https://doi.org/10.1287/isre.1080.0226) | Whether disclosure pressure speeds vendor patches; directly relevant to "can repair speed up." |
| Bilge, L., and Dumitraș, T. (2012). Before We Knew It: An Empirical Study of Zero-Day Attacks in the Real World. ACM CCS 2012, 833-844. | [10.1145/2382196.2382284](https://doi.org/10.1145/2382196.2382284) | Pre-AI baseline for how long zero-days are used before disclosure; context for Mandiant's minus 7 days. An author copy may exist; check before using the library. |
| Rescorla (2005), #14 above | [10.1109/MSP.2005.17](https://doi.org/10.1109/MSP.2005.17) | Open workshop copy exists; get the IEEE version only if citing the journal text. |
| Maillart, T., Zhao, M., Grossklags, J., and Chuang, J. (2017). Given enough eyeballs, all bugs are shallow? Revisiting Eric Raymond with bug bounty programs. *Journal of Cybersecurity* 3(2), 81-90. | [10.1093/cybsec/tyx008](https://doi.org/10.1093/cybsec/tyx008) | Bug bounty economics; journal is normally open access, so try the DOI first. |

## 5. New figures or sections the sweep suggests

1. **Where the lever is (offense-defense figure).** A small bar chart of Lohn and Jackson's model: change in exposed vulnerabilities from speeding up discovery, patch development, and patch adoption. Data: CSET 2022 report (#1). It turns Section 9's policy claim into a picture.
2. **Two clocks.** Time to exploit (Mandiant: 63 days, 5 days, minus 7 days) against time to patch (Verizon DBIR KEV median 32 then 43 days; Nappa's at-most-14% patched at exploit release; Jacobs' 100-day median). Data: M-Trends editions, DBIR 2025 and 2026, #8, EPSS 2021. Confirm DBIR numbers in the PDF first.
3. **Three measurers, one trend.** METR time horizon, AISI cyber task length (doubling about every 8 months), and the open-weight lag from both CAISI (about 4 months) and AISI (4 to 8 months). Data: METR, #3, CAISI. Shows whether independent government numbers agree with the developer-adjacent ones.
4. **Forecasts move.** A dot plot of superhuman or automated coder medians: AI 2027 (March 2027), AI Futures December 2025 model, Q1 2026 update (mid 2028 / mid 2030), next to the paper's own Stage 3 and Stage 4 dates. Data: #10. Honest calibration for Section 6.
5. **Who says AI is driving crime, and what they sell.** A table: claim, source, measured or forecast, conflict of interest. Rows: CrowdStrike +89%, ENISA 80% "reportedly", DBIR 15 techniques, IBM $1.9M saving, against IC3's 4%, Chainalysis's decline, M-Trends' "not yet." Extends Section 3.
