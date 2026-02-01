# Decisions (UTM Studio)

This document captures key product + technical decisions and the reasoning behind them.  
Goal: keep decisions out of DMs/meetings and make trade-offs explicit.

---

## Decision 1: Next.js + Tailwind + shadcn/ui for the frontend
**Status:** Accepted

**Why:**  
- Next.js App Router supports clean page routing + server actions when needed
- Tailwind + shadcn/ui enables fast iteration while still looking polished
- Strong ecosystem for auth, forms, tables, CSV handling, and deployment

**Trade-offs:**  
- Requires basic React/Next comfort
- Some UI components still require wiring and discipline

---

## Decision 2: Supabase for Auth + Postgres + RLS
**Status:** Accepted

**Why:**  
- Email magic links are supported out of the box
- Postgres gives flexibility for templates, history, and audit trails
- RLS provides strong multi-tenant isolation for workspaces
- Rapid MVP velocity without managing servers

**Trade-offs:**  
- RLS can be tricky; must test policies early
- Some advanced workflows (queues, background jobs) may require additional infra later

---

## Decision 3: Magic link email (not passwords) for V1
**Status:** Accepted

**Why:**  
- Low friction onboarding for agencies
- Reduces password handling and support overhead
- Fits “quick utility tool” behavior patterns

**Trade-offs:**  
- Some users prefer Google OAuth; can be added later
- Email deliverability must be monitored

---

## Decision 4: Templates stored as `schema_json` (jsonb)
**Status:** Accepted

**Why:**  
- UTM rules vary significantly by agency/client
- JSON schema allows fast iteration without heavy migrations
- Works well with UI-driven “rules builder”
- Enables AI-generated templates to be stored directly

**Trade-offs:**  
- Requires validation logic in app code
- Harder to query in SQL for certain analytics (mitigate with derived columns later)

---

## Decision 5: Deterministic validation first; AI assists only when helpful
**Status:** Accepted

**Why:**  
- Validation must be consistent and explainable
- Deterministic rules handle most issues (missing fields, casing, allowed values)
- AI is best used for:
  - generating templates from examples
  - suggesting fixes when ambiguity exists
  - explaining choices in plain English

**Trade-offs:**  
- Some advanced naming conventions may still require AI assistance
- Need a careful “trust UX” to prevent hallucinated rules

---

## Decision 6: Store provenance for fixes (`fixed_from_link_id`)
**Status:** Accepted

**Why:**  
- Creates an audit trail for how and why a link changed
- Builds trust (“this is the corrected version of that messy link”)
- Supports later features like “common fix patterns” and governance reporting

**Trade-offs:**  
- Slightly more complexity in data model and UI

---

## Decision 7: Ship without external ad platform integrations in V1
**Status:** Accepted

**Why:**  
- Biggest value can be delivered without integrations
- Integrations drastically expand scope, testing, and auth complexity
- V1 goal is to prove workflow value and adoption

**Trade-offs:**  
- Some agencies will ask for push-to-Google/Meta later
- We should design exports to plug into those workflows easily

---

## Decision 8: Instrumentation included from day one
**Status:** Accepted

**Why:**  
- This is a portfolio product: we want to show “measure → learn → iterate”
- Funnels expose where onboarding breaks
- Helps prioritize what to build next

**Trade-offs:**  
- Requires discipline in event naming and payload structure
- Adds implementation time, but pays back quickly

---

## Open decisions (later)
- Add Google OAuth?
- Add “agency-wide global template library” vs client-specific templates only?
- Add “template versioning” (v1/v2 with diffs)?
- Add workspace billing (Stripe) if monetizing?
- Add integrations (Google Ads, Meta, HubSpot, etc.)?
