# Dharohar Backend — MVP Build Plan
**For execution in Google Antigravity (Editor view for scaffolding, Manager view for parallel phases)**
Companion to `DHAROHAR_PRD.md` and `DHAROHAR_DATA_SCHEMA.md`.

---

## 1. Tech Stack Decision

The schema is explicitly written as **MongoDB-friendly** (`$jsonSchema` validation, `2dsphere` geo indexes, ID-based references, no joins). Build against that grain rather than translating it to a relational DB.

| Layer | Choice | Why |
|---|---|---|
| Language/runtime | **TypeScript + Node.js** | One language across a future Next.js frontend and this backend — good fit for a single agentic-IDE session working across the whole repo |
| Framework | **Express** (or Fastify if the agent prefers) | Minimal, well-documented, easy for an agent to scaffold and test via terminal + curl |
| Database | **MongoDB** (Atlas for hosted, or local via Docker for dev) | Schema is written for it natively |
| ODM/validation | **Mongoose**, with schema-level `enum`/`required` mirroring §2 and §4 of the data schema, **plus** `zod` for request-body validation at the route layer | Two validation layers: reject bad input before it touches the DB |
| Auth | **JWT (access + refresh), bcrypt for password hashing** | Full control over the `user_role` enum and server-set ownership fields; no external dependency for MVP |
| Geo | Native MongoDB `2dsphere` indexes + `$geoNear`/`$geoWithin` | Matches schema §6 and §8 exactly |

If the team later swaps to FastAPI/Python or Postgres+PostGIS (as an earlier concept doc suggested), the PRD's functional requirements and route list stay valid — only this stack table changes.

## 2. Repository Structure

```
dharohar-backend/
  src/
    config/            # env loading, db connection, index setup
    models/             # one Mongoose schema per collection (17 files)
    validators/          # zod schemas per route, mirroring models/
    routes/              # one router per collection + auth/search/admin
    controllers/
    middleware/          # auth, role-guard, error handler, activity-log hook
    services/            # geo queries, search, contribution-merge logic
    utils/               # normalization helpers, EntityRef resolver
  scripts/
    seed/                # seed scripts, one per collection, Indore pilot data
    create-indexes.ts
  tests/
  .env.example
  package.json
```

## 3. Environment Variables (`.env.example`)

```
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
PORT=4000
NODE_ENV=development
```

---

## 4. Phased Plan

Each phase below is sized to be handed to Antigravity as **one task** in the Agent Manager. Phases marked "parallel-safe" have no shared-file overlap and can run as separate agents once Phase 0 is merged; phases marked "sequential" depend on the previous phase's models/middleware existing.

For every phase, ask the agent to produce a verification **Artifact** before marking it done — e.g. a terminal recording of the seed script running, or a screenshot/log of curl responses — since that's how Antigravity's trust/verification model expects work to be reviewed.

### Phase 0 — Project Scaffold (sequential, do first)
- Init TS + Express project, `tsconfig`, lint/format config.
- MongoDB connection module, `.env` loading, graceful shutdown.
- Global error handler, request logger, health check route (`GET /health`).
- **Definition of done:** server boots, `/health` returns 200, connects to a local/dev MongoDB.

### Phase 1 — Reference Data + Core Content Models (sequential, after Phase 0)
- Implement Mongoose models for all reusable subdocuments (`GeoLocation`, `Address`, `Media`, `Verification`, `Publication`, `Discovery`, `EntityRef`) as embedded schemas — not separate collections.
- Implement models: `countries`, `states`, `cities`, `places`, `markets`, `foods`, `food_places`, `artisans`, `communities`, `events`, `stories`, `trails` — fields exactly as in schema §4.1–4.12.
- Apply every index from schema §8 at startup/migration (`create-indexes.ts`).
- **Definition of done:** `npm run create-indexes` succeeds against a dev DB; `mongosh` shows correct index list per collection.

### Phase 2 — Read/Discovery API (parallel-safe once Phase 1 models exist)
- List + get-by-id routes for all 12 content collections from Phase 1.
- City tab endpoints (`/cities/:id/places`, `/markets`, etc.).
- Geo-radius search (`$geoNear`) and bbox search (`$geoWithin`) on `places`, `markets`, `food_places`, `artisans`, `events`.
- Enum/tag filters per collection.
- Unified `/search` endpoint (text index across `name`/`description`, `entity_type`-tagged results).
- Publication gating: default to `publication_status = PUBLISHED` only.
- **Definition of done:** curl walkthrough (artifact) showing a `near=` query around Rajwada Palace's coordinates returning Sarafa Bazaar and Kanch Mandir ordered by distance.

### Phase 3 — Indore Seed Data (parallel-safe, can run alongside Phase 2)
- Write `scripts/seed/indore.ts` using the entities in §6 below, sourced from the dossier.
- Seed order respects foreign keys: `country_in` → `state_mp` → `city_indore_mp` → everything else.
- All seeded content ships `verification_status = VERIFIED`, `publication_status = PUBLISHED`, `verified_by`/`published_by` = a seed system user.
- **Definition of done:** re-running the seed script is idempotent (upsert by a stable slug-based `_id`, not duplicate inserts); Phase 2's endpoints return the seeded Indore data correctly.

### Phase 4 — Auth & Users (parallel-safe once Phase 0 exists; needed before Phase 5)
- `users` model per schema §4.13, password hashing, JWT issue/refresh.
- `POST /auth/register`, `/auth/login`, `/auth/refresh`, `GET /users/me`.
- Role-guard middleware for the `user_role` enum.
- **Definition of done:** artifact showing register → login → authenticated `GET /users/me` round-trip.

### Phase 5 — Personal Data & Contribution Pipeline (sequential, after Phase 4)
- `saved_items` model + save/unsave/list endpoints, unique per `(user_id, entity_type, entity_id)`.
- `contributions` model + submit endpoint (Contributor+ only) + Admin/Moderator review queue + approve→merge logic (creates or patches the target collection document, sets it `PENDING`/`DRAFT` until separately verified/published).
- `reports` model + submit + Admin/Moderator resolve queue.
- **Definition of done:** artifact of a full round-trip — submit a hidden-gem contribution (e.g. propose "Tincha Falls" if not yet seeded), approve it, confirm it now appears via `GET /places/:id` with `verification_status: PENDING`, `publication_status: DRAFT`; then a separate admin verification+publish call makes it visible on `GET /places?city_id=city_indore_mp`.

### Phase 6 — Verification/Publication Admin Controls + Activity Logs (parallel-safe alongside Phase 5)
- `PATCH /:collection/:id/verification` and `/publication` routes (Admin/Moderator), enforcing the "never PUBLISHED while REJECTED" guardrail.
- `activity_logs` model + async best-effort write hook on view/save/contribute/verify actions; TTL index (180-day default per schema).
- **Definition of done:** artifact showing an attempt to publish a REJECTED entity is correctly rejected (4xx), and a normal verify→publish flow succeeds.

### Phase 7 — Hardening Pass (sequential, last)
- Zod validation coverage audit across all mutating routes.
- Confirm no route trusts client-supplied `created_by`/`submitted_by`/`verified_by`/`published_by`/`*_normalized`.
- Confirm every geo entity has a working `2dsphere` index (query `explain()` on a couple of geo routes).
- Basic rate-limiting / request-size limits.
- **Definition of done:** a short written QA note (artifact) covering each check above with pass/fail.

---

## 5. MVP Scope Cut

| Feature | v1 (MVP) | v2 |
|---|---|---|
| Read APIs for all 12 content collections | ✅ | |
| Geo "Around Me" search | ✅ | |
| Unified search | ✅ | |
| Indore fully seeded from dossier | ✅ | |
| Auth (JWT) + roles | ✅ | |
| Saved items | ✅ | |
| Contributions pipeline (submit → review → merge) | ✅ | |
| Reports pipeline | ✅ | |
| Verification/publication admin controls | ✅ | |
| Activity logs (capture only) | ✅ | |
| Personalization/recommendations using activity_logs | | 🔵 |
| Multi-language content | | 🔵 |
| Media upload/CDN pipeline (vs. pre-hosted URLs) | Manual URL entry only | 🔵 full upload flow |
| Local-expert fast-track review | | 🔵 |
| Bookings (guide/hotel/restaurant), marketplace | | 🔵 |

---

## 6. Indore Seed Data — Source Mapping

Every row below maps directly to a `places`/`markets`/`foods`/`food_places`/`artisans`/`communities`/`events`/`stories`/`trails` document, sourced from `Indore_Cultural_Heritage_Dossier.pdf`. Use stable slug IDs, e.g. `place_rajwada_palace`, `market_sarafa_bazaar`.

**`places` (place_type: HERITAGE, RELIGIOUS_SITE, HIDDEN_GEM, CULTURAL_LANDSCAPE)**
Rajwada Palace · Lal Bagh Palace · Krishnapura Chhatris · Central Museum (Indore Museum) · Khajrana Ganesh Temple · Kanch Mandir · Annapurna Temple · Bada Ganpati · Gomatgiri · Patalpani Waterfall (hidden gem) · Ralamandal Wildlife Sanctuary (hidden gem, `CULTURAL_LANDSCAPE`) · Choral Dam (hidden gem) · Tincha Falls (hidden gem) · Janapav Kuti (hidden gem) · Lotus Lake Gulawat (hidden gem) · Sarwate Bus Stand handicraft stalls (hidden gem)

**`markets`**
Sarafa Bazaar (`NIGHT_MARKET`) · Chappan Dukan (`FOOD_MARKET`) · Sitlamata Bazaar (`TEXTILE_MARKET`) · Rajwada Market Precinct (`TRADITIONAL_MARKET`)

**`foods`**
Poha-Jalebi · Bhutte ka Kees · Garadu · Dal Bafla · Sabudana Khichdi · Indori Namkeen & Sev · Shikanji · Malpua

**`food_places`**
Johny Hot Dog (Chappan Dukan) · A-One Garadu (Sarafa Bazaar) · Chappan Dukan poha-jalebi stalls (est. 1974) — flag this one for `contributions`-style community-editable entries per the dossier's note on informal vendors

**`artisans`**
Maheshwari Saree Weavers (`TEXTILE`, Maheshwar) · Bagh Block-Print Artisans (`TEXTILE`, Bagh, Dhar district)

**`communities`**
Chippa/Khatri Block-Printing Community · Sindhi Community of Indore · Marwari Trading Community

**`events`**
Rangpanchami & the Gair Procession · Ahilya Utsav · Malwa Utsav · Ganesh Chaturthi · Navratri

**`stories`**
The Buried Ganesha of Khajrana (linked to Khajrana Ganesh Temple) · Ahilyabai's First Saree (linked to Maheshwari Saree Weavers) · The Palace of Two Fires (linked to Rajwada Palace)

**`trails`**
"Indore Heritage & Night Food Trail" — 5 stops: Rajwada Palace → Kanch Mandir → Sarafa Bazaar → Chappan Dukan → Sarwate Bus Stand handicraft stalls, using `EntityRef` stops exactly as the dossier's trail note specifies (no duplicated entity data inside the trail document).

**Reference data:** `country_in` (India), `state_mp` (Madhya Pradesh), `city_indore_mp` (Indore) — city document should carry `highlights: ["Sarafa Bazaar", "Rajwada Palace", "Chappan Dukan"]` and `tags: ["food_city", "malwa_region"]` per the schema's own worked example.

---

## 7. How to Run This in Antigravity

1. **Editor view:** scaffold Phase 0 yourself (or one quick agent task) so there's a real repo to hand off.
2. **Manager view:** create separate tasks for Phase 2 + Phase 3 (parallel), then Phase 4 + Phase 6 (parallel once Phase 0 exists), then Phase 5 (sequential after Phase 4), then Phase 7 last.
3. For each task, paste in the relevant section of this file plus the matching section of `DHAROHAR_DATA_SCHEMA.md` as context — don't hand the agent the whole schema for a narrow task; scope it to keep the agent focused.
4. Require an Artifact (terminal output, curl/Postman log, or short QA note) per phase before merging, per each phase's "Definition of done" above.
