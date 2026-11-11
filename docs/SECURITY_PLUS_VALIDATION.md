# Security+ validation · 2026-11-11

Baseline: `cc41fef7446004ca6ca3126ff9eb6d3b2294c2e0` (remote main checked before editing).

## Local checks

In `frontend`: `npm test` (20 passed), `npm run lint`, `npm run typecheck`, `npm run build` all pass. Node 24.22.1 / npm 11.9.0 were used locally; Pages CI uses Node 22. Build reports advisory warnings for the existing large bundle and outdated Browserslist data. Lockfiles are unchanged.

The regression fixture records all 107 lesson IDs from the baseline. Tests preserve those IDs, verify ten topic-specific runnable Security+ examples, and check the final exam's 30 unique questions, four unique options, answer indices, domain counts 4/7/5/8/6, and the 24/30 passing boundary.

Headless Chromium functional validation: submit a 24/30 attempt (80%, six errors); review all explanations; retry with cleared selections; answers hidden before submit; incomplete attempt blocked. Saved progress includes old roadmap, Security+ and computer-technology IDs plus an unknown future ID, and survives navigation/reload. Existing completion state remains visible. No browser runtime errors. Landing, course, roadmap and lesson routes have no horizontal overflow at 320, 390, 768 and 1440 px. Cursor layer ignores pointer events, appears for a precise mouse, and is hidden on touch/mobile and with reduced motion.

The 80% threshold is an educational threshold, not CompTIA's scoring scale. Questions and explanations are original scenarios; no exam dumps are used. Python exercises are explicitly synthetic models, not evidence of deployed enforcement.

## Source URL checks

GET requests followed redirects with TLS verification enabled. 11 URLs returned HTTP 200. For 10 URLs the managed outbound proxy rejected CONNECT with 403 before connecting to the destination. Their HTTP availability is **unverified**, not a remote-site 403 or a confirmed broken link. The original official URLs are retained. These blocked sources require a check from a network allowing their hosts; the table makes no content-availability claim for them.

| Source | URL | Result |
| --- | --- | --- |
| CompTIA: Exam Objectives | https://www.comptia.org/training/resources/exam-objectives | Proxy CONNECT 403; destination not checked |
| Developer Roadmap: Cyber Security | https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps/cyber-security | HTTP 200 |
| MITRE ATT&CK knowledge base | https://github.com/mitre-attack/attack-stix-data | HTTP 200 |
| Professor Messer · SY0-701 | https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/ | Proxy CONNECT 403; destination not checked |
| Microsoft Learn · Zero Trust | https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview | Proxy CONNECT 403; destination not checked |
| OWASP Cheat Sheet Series | https://github.com/OWASP/CheatSheetSeries | HTTP 200 |
| OWASP Password Storage Cheat Sheet | https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Password_Storage_Cheat_Sheet.md | HTTP 200 |
| Nmap source and documentation | https://github.com/nmap/nmap | HTTP 200 |
| ComplianceAsCode content | https://github.com/ComplianceAsCode/content | HTTP 200 |
| CISA Known Exploited Vulnerabilities | https://www.cisa.gov/known-exploited-vulnerabilities-catalog | Proxy CONNECT 403; destination not checked |
| NIST Cybersecurity Framework 2.0 | https://www.nist.gov/cyberframework | Proxy CONNECT 403; destination not checked |
| Microsoft Learn · Reliability | https://learn.microsoft.com/en-us/azure/well-architected/reliability/ | Proxy CONNECT 403; destination not checked |
| OWASP Application Security Verification Standard | https://github.com/OWASP/ASVS | HTTP 200 |
| OWASP Web Security Testing Guide | https://owasp.org/www-project-web-security-testing-guide/ | Proxy CONNECT 403; destination not checked |
| OWASP Juice Shop | https://github.com/juice-shop/juice-shop | HTTP 200 |
| OWASP WebGoat | https://github.com/WebGoat/WebGoat | HTTP 200 |
| Microsoft Learn · Shared responsibility | https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility | Proxy CONNECT 403; destination not checked |
| Microsoft Learn · Identity fundamentals | https://learn.microsoft.com/en-us/entra/fundamentals/whatis | Proxy CONNECT 403; destination not checked |
| NIST SP 800-61 Rev. 3 | https://csrc.nist.gov/pubs/sp/800/61/r3/final | Proxy CONNECT 403; destination not checked |
| SigmaHQ · Sigma rules | https://github.com/SigmaHQ/sigma | HTTP 200 |
| NIST OSCAL | https://github.com/usnistgov/OSCAL | HTTP 200 |
