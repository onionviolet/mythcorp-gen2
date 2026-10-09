# W&L reading notes (read in Chrome via OpenAthens, 2026-10-07). Paraphrase only.

## 1. van de Weijer, Leukfeldt, Bernasco (2019), Eur J Criminology 16(4) 486-508. doi:10.1177/1477370818773610
- Data: Dutch Veiligheidsmonitor 2012-2015, 97,186 victims, 127,413 offenses. Logistic regression.
- Police reporting rates (Table 3): hacking 7.1%, consumer fraud 24.0%, identity theft 26.3%; vs car theft 79.9%, burglary 70.2%; all crimes 37.5%.
- Reported to other organizations (banks etc.): identity theft 82.3%, consumer fraud 22.4%, hacking 16.6%.
- Repeat victims report less to police, more to other organizations. Higher income/education -> less police reporting of cybercrime.
- Models explain little (pseudo R2 low); effect sizes small.
- Use: official counts (FBI IC3, FTC) are a small, type-skewed fraction of cybercrime; "about 4% AI-tagged" is a floor at best, and depends on victims recognizing AI. Caveat: Dutch, pre-AI, police (IC3 is a federal complaint portal, FTC is consumer reports, not police).

## 2. Hutchings and Clayton (2016), Deviant Behavior 37(10) 1163-1178. doi:10.1080/01639625.2016.1169829
- Survey of DDoS-for-hire ("booter") operators, Jul-Sep 2014. 63 sites found, perhaps 40-50 people; 13 responses (25% of 51 invited). Small, self-selected.
- Price: subscriptions ranged from under a dollar to $14.99/month; median $4.00 (n=62). Entry-level 10-minute attacks typically under $5/month.
- Customers: mostly gamers; one operator: money comes from people paying to keep targets offline and "kids who want to feel like they are hackers" (paraphrase, short).
- Operators: young (9 of 10 aged 16-24), mostly students, learned in forums (Hackforums), escalated from users to providers; several reused leaked booter code; one paid $40 for a site.
- Estimated income per site $3,700-5,400/month (conservative).
- Main disruption: PayPal closing accounts (payment chokepoint); shift to Bitcoin/cards.
- Use: A2 (second deskilling): by 2014 a buyer with zero skill could rent an attack for about $4/month; even providers needed little skill. Policy: payment-provider pressure disrupted supply (pairs with Collier 2019 takedown result).

## 3. Hutchings and Holt (2015), Brit J Criminology 55(3) 596-614. doi:10.1093/bjc/azu106
- Crime-script content analysis of 13 stolen-data forums (10 Russian, 3 English), 1,889 buyer-seller exchanges, roughly 2007-2011.
- The market was already modular before AI: data-theft tools for sale (skimmers, banking trojans, fake POS, keyloggers), the data itself, then drops, cashiers, cash-out services, money mules, launderers (25-45% cuts), escrow/guarantors.
- Skill path for novices: free tutorials (15 anonymity tutorials on 5 forums), paid tutoring (10 ads), apprenticeship offers; but regulars openly gatekept novices (ignore-list norms, "no time for noobs").
- "Calling services": hired male or female voices to pass bank and payment voice verification, about 10-12 WebMoney dollars per call, several languages.
- Trust problems throughout: rippers, fake reviews, verification by moderators.
- Use: A2 strongly (deskilling via specialization and services predates AI). Rubric check: the "Voice or video impersonation" row scores 0 before AI; generic human voice impersonation was sold as a service pre-AI (Q3 "ready-to-use tools sold" arguably yes), though not impersonation of a specific known person. Possible rubric revision; flag for owner. Also: AI may remove the social gatekeeping cost novices faced (inference, not in paper).

## 4. Leukfeldt, Kleemans, Stol (2017; online 2016), Brit J Criminology 57(3) 704-722. doi:10.1093/bjc/azw009
- 18 Dutch police investigations (2004-2014) into phishing (10), malware (5) and service-provider (3) networks attacking online banking; police files incl. wiretaps and IP taps, plus interviews.
- Growth: 13 of 18 grew only through offline social ties; 2 social ties plus forums for specialists (malware, bulk email); 1 forum-born with local social recruitment; 2 entirely through forums (one forum: 1,855 members, vouching by 2-3 members, admin-tested services).
- Core members often lacked technical skill: bought phishing sites through a friend of a friend, used trojans they had to look up, depended on others for updates. Technical capability was purchasable pre-AI.
- The human bottleneck was the cash-out: money mules (recruited at schools, clubs, on the street, or by mass "job" email), cashers, recruited insiders (bank staff, telecom store staff for SIM swaps at EUR 500, postal workers).
- Bank-impersonation by phone ("callers") was a standard step in low-tech phishing, supplied by people.
- Use: A2 again, and a likely new narrowing amendment for fraud: AI cheapens lures, scripts and impersonation, but these networks were limited by trusted people for cash-out and insider access, which AI does not supply. Caveats: Dutch, online-banking fraud only, 2004-2014, police files see what police chose to investigate.

## 5. Holt (2013), Global Crime 14(2-3). doi:10.1080/17440572.2013.787925
- NOT AVAILABLE through W&L (T&F shows "Get Access"; abstract only). Do not cite beyond the abstract. Low priority; Hutchings and Holt 2015 covers the same market.

## 6. Dupont (2017; online 2016-10-05), Crime, Law and Social Change 67, 97-116. doi:10.1007/s10611-016-9649-z
- Review of three anti-botnet strategies: criminal enforcement, private takedowns (Microsoft civil actions), polycentric harm reduction (ISP-led notification and cleanup in Australia, South Korea, Japan, Germany, Netherlands).
- Enforcement short-lived: Bredolab sending spam again two days after server seizure; Kelihos back 20 minutes after a 2012 takedown; ZeroAccess operation disrupted only 38% of infrastructure (citing Nadji and Antonakakis). Those prosecuted tend to be novice or intermediate.
- Exception: Coreflood 2011 sinkhole plus uninstall, FBI claims 95% of infected machines cleaned.
- Harm reduction correlates with lower infection: South Korea 26% to 0.5% (2005-2011), Japan 2.5% to 0.6%; Germany botnet spam down 75% (Sep 2010 to May 2011). Author: evidence fragmentary, data held by private actors.
- Pre-AI deskilling prices: Zeus kit $3,000-19,000 (2010); DDoS botnet rental $30-70/hour (2012).
- Use: policy section. Supports focusing on repair and on "fulcrum" chokepoints (ISPs then; by analogy model providers, package registries, payment rails now: inference, label it). Cautions that arrests and takedowns alone are weak, which tempers the booter-takedown result. Caveat: anecdotal and correlational, 2005-2015 botnets.

## 7. Holt, Brewer, Goldsmith (2019), Deviant Behavior 40(9) 1144-1156. doi:10.1080/01639625.2018.1472927
- THEORETICAL, no new data. Extends "digital drift" (Goldsmith and Brewer 2015) with Matza's "sense of injustice".
- Argument: rare, inconsistent or exemplary prosecutions of young hackers, and heavy-handed private enforcement (RIAA sued an estimated 35,000 people through 2008; torrent poisoning), can weaken the law's legitimacy for young offenders and encourage neutralizations and workarounds rather than deterrence.
- Use: labelled caution in the policy section: if AI widens the pool of low-skill, often young offenders, a policy of prosecuting individuals may backfire; pairs with Dupont (chokepoints over arrests). Must be labelled as theory, not evidence.

## 8. Jacobs, Romanosky, Edwards, Adjerid, Roytman (2021), Digital Threats: Research and Practice 2(3) Art. 20. doi:10.1145/3436242
- OPEN ACCESS (the reading list wrongly said paywalled). Cite the journal version directly.
- Data: 25,159 CVEs published 2016-06-01 to 2018-06-01; 921 exploited in the wild within 12 months of publication = 3.7%. Earlier work cited: as few as 1.4% of published vulnerabilities exploited.
- Exploitation observed only via commercial IDS signature hits (Proofpoint, Fortinet, AlienVault): a floor, misses unmonitored and consumer devices.
- Remediation (citing a ~300-company study): median 100 days to remediate; 75% within 392 days.
- Patching every CVSS 7+ flaw: 6.2% efficiency (most effort goes to flaws never exploited), 62.7% coverage. EPSS matches coverage with 29% to 86% less effort depending on threshold.
- Strong predictors: weaponized exploit (37.1% of those exploited), proof-of-concept published (16.5%), vendor.
- Use: (a) correct the paper's "about 5% exploited" (2023 preprint) to the journal's 3.7% (2016-2018, within 12 months, IDS-visible), or show both with dates; (b) repair is partly a prioritization problem, not only capacity: Figure 6's backlog treats all flaws alike; note that only a small, partly predictable share gets exploited; (c) AI-found flaws raise volume, which raises the value of prioritization.

## 9. Bilge and Dumitraș (2012), ACM CCS 2012, 833-844. doi:10.1145/2382196.2382284 (read 2026-10-08)
- OPEN author copy at Dumitraș's UMD page; the library was not needed. Read in full.
- Data: Symantec WINE, 11 million Windows hosts running Symantec products, binary-reputation and antivirus telemetry, February 2008 to 2011, about 300 million files.
- Found 18 flaws exploited before disclosure, 11 not previously known as zero-days. Duration before disclosure: 19 days to 30 months, median 8 months, mean about 10 months (312 days). Authors call durations lower bounds (data start in Feb 2008).
- After disclosure: malware variants up 183 to 85,000 times, attacks up 2 to 100,000 times ("up to 5 orders of magnitude"). Exploits for 42% of flaws used in host-based threats seen in field data within 30 days of disclosure.
- Limits stated by the authors: selection bias (Symantec customers only), misses web-based, polymorphic, non-executable (pdf, doc) and highly targeted exploits; their method missed 24 of 31 zero-days Symantec analysts reported for the period.
- Discussion: frames full disclosure as a trade of more attacks for faster patching; cites Arora et al. and Cavusoglu et al. reaching opposite game-theory conclusions.
- Use: 1.3 (pre-disclosure exploitation is old; volume follows disclosure), 3.1 (cost of disclosure pressure), A9.

## 10. Arora, Krishnan, Telang and Yang (2010), Information Systems Research 21(1), 115-132. doi:10.1287/isre.1080.0226 (2026-10-08)
- NOT AVAILABLE in full through W&L: the OpenAthens proxy signs in, but INFORMS returns 403 "purchase" for the PDF and reader. Telang's old self-hosted copies return 404; the ICIS 2006 version on AIS eLibrary sits behind a bot check. Abstract only. Cite only abstract claims.
- Abstract: CERT/CC and SecurityFocus data; disclosure raises the instantaneous probability of a patch release by nearly 2.5 times; open-source vendors patch faster; vendors respond faster to more severe flaws and slower to flaws not disclosed by CERT; results replicated on a second public data set.
- The ICIS 2006 abstract (AIS eLibrary page) gives 137% more likely and about 29 days faster; not cited, earlier version.
- Use: 3.1, pressure has sped vendor patching. Caveat added in text: paid vendors, not volunteer maintainers.

## 11. Arora, Telang and Xu (2008), Management Science 54(4), 642-656. doi:10.1287/mnsc.1070.0771 (2026-10-08)
- NOT AVAILABLE in full through W&L (same INFORMS 403). Abstract only.
- Abstract: model with a social planner setting the protected period and a vendor choosing patch timing; vendors typically patch less quickly than socially optimal, so the planner shrinks the protected period; sometimes patch release coincides with disclosure. A longer protected period does not always give better patch quality; workarounds can give the planner more leverage and sometimes raise social cost.
- The reading list asked whether CISA's 3-day deadline fits this model. It does not map: Arora models the vendor's protected period before disclosure, while CISA's deadline is for agencies installing patches. Not used for the CISA claim.

## Correction found while reading (2026-10-08)
- Mandiant's time-to-exploit is measured relative to patch release ("before or after a patch is released"), not disclosure; M-Trends 2026 reads minus 7 days as exploitation before a patch is released. The paper had said "from disclosure" in five places. Fixed in v2.6.
- Mandiant does not say the fall in its average comes from the rising zero-day share; it says the share shift (n-day:zero-day 38:62 in 2021-22 to 30:70 in 2023) reflects more zero-day use and detection. Figure caption fixed. Arithmetic point kept: only zero-days can make the average negative.
