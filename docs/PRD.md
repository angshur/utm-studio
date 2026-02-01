Product name
UTM Studio (working name)
Problem
Agencies lose attribution quality because UTMs are inconsistent across account managers, channels, and clients. That breaks reporting, wastes time, and causes client mistrust (“your numbers don’t match”).
Target user (ICP)
Primary: Agency Account Managers / Performance Marketers who launch campaigns weekly
Secondary: Analytics / Ops lead who enforces naming standards and audits tracking
Jobs-to-be-done
“Generate correct UTMs quickly so I can ship campaigns without worrying about tracking.”
“Standardize UTMs across the agency so reporting stays clean across clients and time.”
“Fix messy UTMs from partners/tools so our data doesn’t get polluted.”
MVP scope (V1)
Workspace + members (simple roles)
UTM template system (rules + allowed values + casing)
Single-link builder + bulk builder (CSV paste/upload)
Validator + “fix suggestions”
History + export (CSV + copy)
AI Assist: auto-creates templates from examples + explains/fixes UTMs
Non-goals (V1)
Direct integrations (Google Ads, Meta) auto-push
Full taxonomy governance platform
Multi-touch attribution / MMM
Differentiators (why this isn’t a toy)
Opinionated templates + validation rules
Team workflow (shared templates + history)
Trust layer (explain why a UTM is “bad” and what changed)
Metrics + instrumentation
Success metrics
Activation: user generates ≥ 5 valid UTMs in first session OR imports a bulk list and exports successfully
Week-1 retention proxy: returns and generates UTMs on 2+ distinct days
Quality metric: % of UTMs passing validation (and improvement over time)

Version 2:
Quick spec for each (so you can implement fast)
1) Preview table (minimal)
Show a small 1-row summary under Step 2 or above Output:
Source: utmSource
Medium: utmMedium
Campaign: utmCampaign
If empty, show —.
2) Naming rules drawer
Collapsed by default with a “Learn naming rules” link/button.
Inside:
lowercase only
use _ or - consistently
avoid spaces
short + stable taxonomy
example patterns
3) Copy options (more correct than “GA4 vs raw”)
Copy link (what you already do)
Copy link (URL-encoded) (encode utm values)
Copy query only (utm_source=...&utm_medium=...)
This is genuinely useful, professional, and not misleading.

Time saved: avg seconds/link (optional self-reported)
