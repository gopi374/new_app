# Dharohar — Product Requirements Document (Backend System)
**India's Digital Cultural Ecosystem — Backend v1**
Status: Draft for build | Data model: `DHAROHAR_DATA_SCHEMA.md` (frozen, MongoDB-friendly, 17 collections)
Pilot content source: `Indore_Cultural_Heritage_Dossier.pdf`

---

## 1. Product Overview & Vision

Dharohar is a location-aware, relationship-driven cultural discovery platform that models a city's heritage not as a flat list of monuments, but as an interconnected web of **places, hidden gems, markets, food, artisans, communities, festivals, stories, and trails**. This PRD covers the **backend system only** — the API and data layer that will power the mobile app, website, and admin portal described in the wider heritage-tourism concept.

The backend's job is to:
1. Serve rich, verified, geo-searchable cultural content to end users.
2. Let contributors and local experts submit new content through a moderated pipeline.
3. Give admins/moderators tools to verify, publish, and maintain data quality.
4. Capture lightweight usage signals (saves, views, reports) to support future personalization and government-facing tourism intelligence.

## 2. Goals

- Stand up a complete, schema-faithful REST API over all 17 Dharohar collections.
- Ship with **Indore fully seeded** as the reference/pilot city, using the real content in the dossier (Rajwada Palace, Sarafa Bazaar, Chappan Dukan, Maheshwari weavers, etc.) — not placeholder data.
- Enforce the schema's non-negotiables: server-set ownership fields, independent verification/publication state machines, GeoJSON `[lng, lat]` discipline, no embedded giant arrays, no circular embedding.
- Make the API geo-first: every location entity must support "near me" radius queries out of the box.
- Support the full contribution lifecycle: submit → review → approve/reject → merge into the live collection.

## 3. Non-Goals (v1)

- No payments, bookings, or commerce (guide booking, hotel/restaurant booking are explicitly future per the wider platform's feature table).
- No recommendation/ML personalization engine — `activity_logs` only *capture* the signal in v1; using it is a v2 concern.
- No multi-language content pipeline (schema supports it later via localized fields; v1 is English-only).
- No native mobile/web frontend work — this PRD is backend-only. Frontend consumes this API per the earlier IA (Home / Explore / Around Me / My Trip / Profile).

## 4. Users & Roles

Directly from `user_role` enum — access control must be built around these from day one, not bolted on later:

| Role | Can do |
|---|---|
| `VISITOR` | Read published content, save items, submit reports (as authenticated user) |
| `CONTRIBUTOR` | Everything a Visitor can, plus submit `contributions` (new place, hidden gem, story, food, artisan, event, edit suggestion, media) |
| `LOCAL_EXPERT` | Everything a Contributor can; contributions may be fast-tracked / weighted higher in review (flagged, not auto-approved, in v1) |
| `MODERATOR` | Review/approve/reject contributions and reports; cannot change publication status of already-verified core content |
| `ADMIN` | Full control: verification + publication state changes on any entity, user role management, direct CRUD on all collections |

## 5. Domain Model Summary

Full detail lives in `DHAROHAR_DATA_SCHEMA.md`. This is the map every endpoint is built against:

| Group | Collections |
|---|---|
| Geography (reference) | `countries`, `states`, `cities` |
| Cultural content (the "core 8") | `places` (incl. hidden gems), `markets`, `foods`, `food_places`, `artisans`, `communities`, `events`, `stories` |
| Composite | `trails` (polymorphic stops over the core 8) |
| Identity & engagement | `users`, `saved_items` |
| Moderation pipeline | `contributions`, `reports` |
| Audit | `activity_logs` |

Every content collection carries independent `verification` and `publication` sub-objects — a place can be `VERIFIED` but still `DRAFT` (verified, not yet live), and the API must never allow `publication_status = PUBLISHED` while `verification_status = REJECTED`.

## 6. Functional Requirements

### 6.1 Discovery & Read APIs (all roles, public where published)
- Get by ID for every content collection, resolving `related_*_ids` either via server-side batched fetch or an `?expand=` query param.
- List/filter by `city_id` for every content collection (backs the CITY tabs: Heritage / Hidden Gems / Markets / Food / Artisans / Communities / Events / Stories / Trails).
- Geo-radius ("Around Me") search across `places`, `markets`, `food_places`, `artisans`, and `events` with a venue — `$near`/`$geoNear` with a distance param, using each collection's `2dsphere` index.
- Bounded-viewport map search (`$geoWithin` on a bbox) for the same collections.
- Full-text search across `name`/`description` (and a unified cross-collection search endpoint, `entity_type`-tagged, for the EXPLORE search bar).
- Category/enum filters: `place_type`, `discovery.is_hidden_gem` + `discovery_level`, `market_type`, `food_category`, `event_type`, `story_type`, `tags`.
- Only `publication_status = PUBLISHED` documents are returned to `VISITOR`/`CONTRIBUTOR`/`LOCAL_EXPERT` callers by default; `MODERATOR`/`ADMIN` can request drafts/under-review content via an explicit query flag.

### 6.2 Profile & Personal Data
- `saved_items`: save/unsave any entity type in the `saved_item_entity_type` enum; list a user's saved items joined to their target collections by `entity_type`.
- `contributions`: list a user's own contributions grouped by `status`.
- `reports`: list a user's own filed reports.
- Derived profile stats (counts) are computed via aggregation at request time — **never** stored as arrays on the `users` document, per schema rule.

### 6.3 Contribution Pipeline
- `POST /contributions` — any authenticated Contributor+ role submits a `contribution_type` payload (new place, hidden gem, story, food, artisan, event, edit suggestion, or media upload) targeting an existing entity or proposing a new one.
- Moderator/Admin queue: list contributions by `status` (`SUBMITTED → IN_REVIEW → APPROVED/REJECTED/MERGED`).
- Approve flow: on `APPROVED`, the backend either creates a new document (new-entity contributions) or applies the suggested diff (edit-suggestion contributions) in the target collection, then marks the contribution `MERGED`. New documents from contributions start `verification_status = PENDING`, `publication_status = DRAFT` — they do not go live until separately verified and published by an Admin.
- `submitted_by` is always taken from the authenticated session, never the request body.

### 6.4 Reports & Trust
- `POST /reports` — any authenticated user flags an entity (`report_type`: incorrect info, outdated, offensive, duplicate, closed/nonexistent, copyright, other).
- Moderator/Admin queue: list by `status` (`OPEN → INVESTIGATING → RESOLVED/DISMISSED`), with `resolved_by`/`resolved_at`/`resolution_notes` set server-side on resolution.

### 6.5 Verification & Publication (Admin/Moderator only)
- Explicit endpoints to transition `verification` and `publication` sub-objects on any content document, independently, with the schema's guardrail enforced in application logic: reject `publication_status = PUBLISHED` while `verification_status = REJECTED`.
- `verified_by`/`verified_at`/`published_by`/`published_at` are always server-set.

### 6.6 Activity Logging
- Fire-and-forget `activity_logs` writes on key actions (`VIEW`, `SAVE`, `CONTRIBUTE`, `VERIFY`, etc.), `user_id` nullable for anonymous views. High-write, append-only — must not block the primary request path (write async / best-effort).

## 7. API Surface (v1, REST, `/api/v1`)

One resource family per collection, consistent shape:

```
GET    /cities                       list, filter by state, is_featured
GET    /cities/:id
GET    /cities/:id/places | /markets | /foods | /food-places | /artisans
       /communities | /events | /stories | /trails      -> tab endpoints

GET    /places?near=lng,lat&radius_km=&city_id=&place_type=&is_hidden_gem=&tags=&bbox=
GET    /places/:id
POST   /places                       (Admin/Moderator direct create)
PATCH  /places/:id
PATCH  /places/:id/verification      (Admin/Moderator)
PATCH  /places/:id/publication       (Admin/Moderator)

# same CRUD + geo/filter shape repeats for:
/markets  /foods  /food-places  /artisans  /communities  /events  /stories  /trails

GET    /search?q=&entity_type=       unified cross-collection search

POST   /auth/register  /auth/login   /auth/refresh
GET    /users/me
GET    /users/me/saved-items   POST /saved-items   DELETE /saved-items/:id
GET    /users/me/contributions POST /contributions
GET    /users/me/reports       POST /reports

# Moderator/Admin queues
GET    /admin/contributions?status=  PATCH /admin/contributions/:id
GET    /admin/reports?status=        PATCH /admin/reports/:id
GET    /admin/activity-logs?entity_type=&entity_id=
```

## 8. Non-Functional Requirements

- **Validation:** every collection enforces its required/optional field set and closed enums at the API boundary (schema-validation library, mirroring the schema's `$jsonSchema` intent) before it ever reaches MongoDB.
- **Geospatial:** `2dsphere` index on every `location` field per §8 of the schema doc; reject any payload where `coordinates` look latitude/longitude-swapped.
- **Normalization:** server computes `*_normalized` (lowercase/trimmed) fields on write for every case-insensitive-filterable field — never trust client-provided normalized values.
- **Security:** `created_by`/`submitted_by`/`verified_by`/`published_by`/`updated_by` are always derived from the authenticated session; role-based authorization middleware on every mutating route; no raw binaries — `media[].url` must be HTTPS.
- **Referential integrity:** `*_id` foreign keys validated against the target collection at write time (application layer).
- **Performance:** all index recommendations in §8 of the schema doc are applied at migration/init time, not ad hoc.
- **Auditability:** `activity_logs` is TTL-indexed (180-day default) or periodically archived — it must never be allowed to grow unbounded against a hard SLA.

## 9. Success Metrics (v1 launch)

- 100% of the 17 collections have working CRUD + list/filter endpoints matching the schema.
- Indore fully seeded: 12+ heritage/cultural places, 7 hidden gems, 4 markets, 10+ foods, food places, 2 artisan crafts, 3 communities, 5 festivals/events, 3 stories, 1 trail — sourced directly from the dossier.
- A geo-radius query near Rajwada Palace returns Sarafa Bazaar, Kanch Mandir, and other old-city entities correctly ordered by distance.
- A full contribution round-trip (submit → moderator approves → entity appears published) works end-to-end.
- No endpoint ever returns `created_by`/`verified_by`/etc. sourced from client input.

## 10. Open Questions for the Team

- Object storage/CDN provider for `media[].url` (S3, Cloudinary, Firebase Storage, etc.) — not specified in the schema, needs a decision before the Media flow is built.
- Auth provider: roll JWT auth in-house (assumed in the MVP plan) vs. Firebase/Supabase Auth as the earlier platform concept suggested — MVP plan defaults to in-house JWT for full schema control over `user_role`; revisit if the team wants faster auth setup.
- Whether `LOCAL_EXPERT` contributions get any auto-fast-track in v1, or strictly manual review like everyone else (MVP plan assumes strictly manual).
