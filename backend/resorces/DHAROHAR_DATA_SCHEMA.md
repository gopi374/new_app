# Dharohar — Data Schema / JSON Data Model
### India's Digital Cultural Ecosystem

This document defines the complete data model for Dharohar: a location-aware, relationship-driven cultural discovery platform covering heritage places, hidden gems, markets, food culture, artisans, communities, festivals, events, stories, and cultural trails across Indian cities.

> **Note on provenance:** No existing Dharohar codebase/models were found in the workspace to reuse. This schema is built from scratch strictly following the conventions specified in the design brief (snake_case, ID-based references, GeoJSON `[lng, lat]`, separated verification/publication lifecycles, MongoDB-friendly collections).

---

## Table of Contents

1. [Global Conventions](#1-global-conventions)
2. [Enums](#2-enums)
3. [Reusable Subdocuments](#3-reusable-subdocuments)
4. [Collections](#4-collections)
   - 4.1 [`countries`](#41-countries) (reference only)
   - 4.2 [`states`](#42-states)
   - 4.3 [`cities`](#43-cities)
   - 4.4 [`places`](#44-places)
   - 4.5 [`markets`](#45-markets)
   - 4.6 [`foods`](#46-foods)
   - 4.7 [`food_places`](#47-food_places)
   - 4.8 [`artisans`](#48-artisans)
   - 4.9 [`communities`](#49-communities)
   - 4.10 [`events`](#410-events)
   - 4.11 [`stories`](#411-stories)
   - 4.12 [`trails`](#412-trails)
   - 4.13 [`users`](#413-users)
   - 4.14 [`saved_items`](#414-saved_items)
   - 4.15 [`contributions`](#415-contributions)
   - 4.16 [`reports`](#416-reports)
   - 4.17 [`activity_logs`](#417-activity_logs)
5. [Relationship Map](#5-relationship-map)
6. [GeoJSON Rules](#6-geojson-rules)
7. [Validation Rules](#7-validation-rules)
8. [MongoDB Index Recommendations](#8-mongodb-index-recommendations)
9. [Example Documents](#9-example-documents)
10. [App-Flow → Schema Mapping](#10-app-flow--schema-mapping)

---

## 1. Global Conventions

| Rule | Convention |
|---|---|
| Field naming | `snake_case` everywhere |
| IDs | Stable string IDs, e.g. `"city_indore_mp"` or ULID/UUID — never names |
| Foreign keys | Always `<entity>_id`, e.g. `city_id`, never the display name |
| Timestamps | ISO-8601 UTC strings, e.g. `"2026-09-04T10:30:00Z"` |
| Every entity | Has `_id`, `created_at`, `updated_at` |
| Named entities | Have `name` (or `title`) + `description` |
| Discoverable/user-facing entities | Have `status` and, where cultural accuracy matters, `verification` + `publication` sub-objects |
| Location entities | Always carry a GeoJSON `location`, plus `address`, `city_id`, `state_id`, `country_code` |
| Case-insensitive filtering | Every human-readable name used for filtering (`city`, `state`, tags) has a paired `*_normalized` (lowercase, trimmed) field |
| Media | Never inline binaries or bare URL strings — always the `Media` subdocument array |
| Ownership | `submitted_by` / `created_by` is **server-set**, never trusted from client input |
| Derived counts | Never hardcoded as source-of-truth; cached counts (if any) live in a separate `analytics_cache` field/collection, clearly marked as a cache |

---

## 2. Enums

All enums are **closed sets** enforced at the application/schema-validation layer (MongoDB `$jsonSchema` `enum` or equivalent).

```json
{
  "place_type": [
    "HERITAGE",
    "HIDDEN_GEM",
    "CULTURAL_SITE",
    "HISTORICAL_SITE",
    "ARCHAEOLOGICAL_SITE",
    "RELIGIOUS_SITE",
    "CULTURAL_LANDSCAPE",
    "VIEWPOINT",
    "OTHER"
  ],
  "discovery_level": [
    "MAINSTREAM",
    "LESSER_KNOWN",
    "LOCAL_SECRET"
  ],
  "market_type": [
    "TRADITIONAL_MARKET",
    "FOOD_MARKET",
    "NIGHT_MARKET",
    "CRAFT_MARKET",
    "TEXTILE_MARKET",
    "JEWELLERY_MARKET",
    "SPICE_MARKET",
    "OTHER"
  ],
  "food_category": [
    "STREET_FOOD",
    "SWEET",
    "SNACK",
    "MAIN_COURSE",
    "BEVERAGE",
    "FESTIVAL_FOOD",
    "THALI",
    "OTHER"
  ],
  "food_place_type": [
    "STREET_VENDOR",
    "STALL",
    "RESTAURANT",
    "SWEET_SHOP",
    "DHABA",
    "HOME_KITCHEN",
    "MARKET_STALL",
    "OTHER"
  ],
  "artisan_specialization_type": [
    "TEXTILE",
    "POTTERY",
    "METALWORK",
    "WOODWORK",
    "PAINTING",
    "JEWELLERY",
    "LEATHERWORK",
    "PAPER_CRAFT",
    "MUSIC_INSTRUMENT",
    "PERFORMING_ART",
    "OTHER"
  ],
  "event_type": [
    "FESTIVAL",
    "PERFORMANCE",
    "WORKSHOP",
    "EXHIBITION",
    "CULTURAL_PROGRAM",
    "CEREMONY",
    "OTHER"
  ],
  "story_type": [
    "FOLKLORE",
    "LOCAL_HISTORY",
    "ORAL_HISTORY",
    "TRADITION",
    "PERSONAL_MEMORY",
    "CRAFT_STORY",
    "FOOD_STORY",
    "OTHER"
  ],
  "trail_stop_entity_type": [
    "PLACE",
    "MARKET",
    "FOOD",
    "FOOD_PLACE",
    "ARTISAN",
    "EVENT",
    "STORY",
    "COMMUNITY"
  ],
  "saved_item_entity_type": [
    "PLACE",
    "MARKET",
    "FOOD",
    "FOOD_PLACE",
    "ARTISAN",
    "COMMUNITY",
    "EVENT",
    "STORY",
    "TRAIL"
  ],
  "media_type": [
    "IMAGE",
    "VIDEO",
    "AUDIO",
    "DOCUMENT"
  ],
  "verification_status": [
    "PENDING",
    "UNDER_REVIEW",
    "VERIFIED",
    "REJECTED"
  ],
  "publication_status": [
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED"
  ],
  "user_role": [
    "VISITOR",
    "CONTRIBUTOR",
    "LOCAL_EXPERT",
    "MODERATOR",
    "ADMIN"
  ],
  "contribution_type": [
    "PLACE_SUBMISSION",
    "HIDDEN_GEM_SUBMISSION",
    "STORY_SUBMISSION",
    "FOOD_SUBMISSION",
    "ARTISAN_SUBMISSION",
    "EVENT_SUBMISSION",
    "EDIT_SUGGESTION",
    "MEDIA_UPLOAD",
    "OTHER"
  ],
  "contribution_status": [
    "SUBMITTED",
    "IN_REVIEW",
    "APPROVED",
    "REJECTED",
    "MERGED"
  ],
  "report_type": [
    "INCORRECT_INFORMATION",
    "OUTDATED_INFORMATION",
    "OFFENSIVE_CONTENT",
    "DUPLICATE_ENTITY",
    "CLOSED_OR_NONEXISTENT",
    "COPYRIGHT_ISSUE",
    "OTHER"
  ],
  "report_status": [
    "OPEN",
    "INVESTIGATING",
    "RESOLVED",
    "DISMISSED"
  ]
}
```

---

## 3. Reusable Subdocuments

These are **not** top-level collections; they are embedded inside other documents.

### 3.1 `GeoLocation` (GeoJSON Point)

```json
{
  "type": "Point",
  "coordinates": [75.8577, 22.7196]
}
```
Rules: always `[longitude, latitude]`, longitude ∈ [-180, 180], latitude ∈ [-90, 90]. See [§6](#6-geojson-rules).

### 3.2 `Address`

```json
{
  "line1": "string",
  "line2": "string | null",
  "locality": "string | null",
  "landmark": "string | null",
  "pincode": "string | null",
  "city_id": "city_xxx",
  "state_id": "state_xxx",
  "country_code": "IN"
}
```

### 3.3 `Media`

```json
{
  "media_id": "media_xxx",
  "type": "IMAGE",
  "url": "https://cdn.dharohar.app/...",
  "thumbnail_url": "https://cdn.dharohar.app/.../thumb.jpg",
  "caption": "string | null",
  "alt_text": "string | null",
  "credit": "string | null",
  "source": "string | null",
  "uploaded_by": "user_xxx | null",
  "created_at": "2026-09-04T10:30:00Z"
}
```
- `type` ∈ `media_type` enum.
- No raw binary is ever stored inline — `url` always points to object storage/CDN.

### 3.4 `Verification`

```json
{
  "verification_status": "VERIFIED",
  "verified_by": "user_xxx | null",
  "verified_at": "2026-08-01T00:00:00Z | null",
  "verification_notes": "string | null",
  "sources": ["string", "..."]
}
```
`verification_status` ∈ `verification_status` enum. This is **independent** of `publication_status`.

### 3.5 `Publication`

```json
{
  "publication_status": "PUBLISHED",
  "published_at": "2026-08-02T00:00:00Z | null",
  "published_by": "user_xxx | null"
}
```
`publication_status` ∈ `publication_status` enum.

### 3.6 `Discovery` (place-only, for hidden-gem metadata)

```json
{
  "is_hidden_gem": true,
  "discovery_level": "LOCAL_SECRET",
  "why_visit": "string | null",
  "local_secret": true
}
```

### 3.7 `EntityRef` (generic polymorphic reference — used in trails, related entities)

```json
{
  "entity_type": "PLACE",
  "entity_id": "place_xxx"
}
```

### 3.8 `AuditMeta` (embedded in every doc, not a separate field group but conceptually standard)

```json
{
  "created_at": "2026-09-04T10:30:00Z",
  "updated_at": "2026-09-04T10:30:00Z",
  "created_by": "user_xxx | system",
  "updated_by": "user_xxx | system"
}
```

---

## 4. Collections

For each collection: **Required**, **Optional/Nullable**, and notes.

### 4.1 `countries` (reference only)

Small, mostly static reference table — not emphasized since Dharohar is India-first, but kept generic for future expansion.

```json
{
  "_id": "country_in",
  "code": "IN",
  "name": "India",
  "created_at": "...",
  "updated_at": "..."
}
```

### 4.2 `states`

**Required:** `_id`, `name`, `normalized_name`, `country_code`, `created_at`, `updated_at`
**Optional:** `description`, `location` (centroid Point)

```json
{
  "_id": "state_mp",
  "name": "Madhya Pradesh",
  "normalized_name": "madhya pradesh",
  "country_code": "IN",
  "description": "string | null",
  "location": { "type": "Point", "coordinates": [78.6569, 22.9734] },
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z"
}
```

### 4.3 `cities`

City is a **major discovery entity**, not just a location tag.

**Required:**
`_id`, `name`, `normalized_name`, `state_id`, `country_code`, `location`, `description`, `status`, `created_at`, `updated_at`

**Optional/Nullable:**
`short_description`, `cover_media` (Media[]), `highlights` (string[]), `cultural_summary`, `is_featured` (bool), `tags` (string[]), `analytics_cache` (object, explicitly cache-only)

```json
{
  "_id": "city_indore_mp",
  "name": "Indore",
  "normalized_name": "indore",
  "state_id": "state_mp",
  "country_code": "IN",
  "location": { "type": "Point", "coordinates": [75.8577, 22.7196] },
  "short_description": "The food capital of Madhya Pradesh.",
  "description": "A long-form editorial description of Indore's cultural identity.",
  "cultural_summary": "Known for Sarafa Bazaar's night food market, Rajwada Palace, and a blend of Malwa cushine and Maratha heritage.",
  "cover_media": [ /* Media[] */ ],
  "highlights": ["Sarafa Bazaar", "Rajwada Palace", "56 Dukan"],
  "is_featured": true,
  "tags": ["food_city", "malwa_region"],
  "status": "ACTIVE",
  "analytics_cache": {
    "note": "cache only — not source of truth, recomputed periodically",
    "heritage_place_count": 42,
    "computed_at": "2026-09-01T00:00:00Z"
  },
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-08-01T00:00:00Z"
}
```
`status` here is a simple lifecycle: `ACTIVE | INACTIVE`.

### 4.4 `places`

Generalized model for **all** physical cultural sites — heritage, hidden gems, cultural sites, historical sites, etc. Distinguished by `place_type`, **not** by separate schemas.

**Required:**
`_id`, `name`, `place_type`, `short_description`, `description`, `location`, `address`, `city_id`, `state_id`, `country_code`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:**
`categories` (string[]), `cultural_significance`, `historical_context`, `media` (Media[]), `story_ids` (string[] → `stories`), `opening_hours`, `best_time_to_visit`, `tags` (string[]), `discovery` (Discovery subdoc — only meaningful when relevant), `related_community_ids`, `related_event_ids`, `related_market_ids`

```json
{
  "_id": "place_rajwada_palace",
  "name": "Rajwada Palace",
  "place_type": "HERITAGE",
  "categories": ["palace", "maratha_architecture"],
  "short_description": "A 7-storey historic palace overlooking the old city.",
  "description": "Full editorial description...",
  "cultural_significance": "Seat of the Holkar dynasty...",
  "historical_context": "Built in 1747...",
  "location": { "type": "Point", "coordinates": [75.8553, 22.7177] },
  "address": {
    "line1": "Rajwada Rd, near Kotwali",
    "locality": "Old Indore",
    "pincode": "452002",
    "city_id": "city_indore_mp",
    "state_id": "state_mp",
    "country_code": "IN"
  },
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "country_code": "IN",
  "media": [ /* Media[] */ ],
  "story_ids": ["story_holkar_legacy"],
  "opening_hours": "10:00–18:00, closed Mondays",
  "best_time_to_visit": "Evening for light-and-sound show",
  "tags": ["palace", "must_visit"],
  "discovery": { "is_hidden_gem": false, "discovery_level": "MAINSTREAM", "why_visit": null, "local_secret": false },
  "related_community_ids": ["community_holkar_heritage"],
  "related_event_ids": [],
  "related_market_ids": ["market_sarafa_bazaar"],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "2026-06-01T00:00:00Z", "verification_notes": null, "sources": ["ASI records"] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "2026-06-02T00:00:00Z", "published_by": "user_admin1" },
  "created_at": "2026-01-05T00:00:00Z",
  "updated_at": "2026-06-02T00:00:00Z"
}
```

A **hidden gem** is simply a `places` document where `discovery.is_hidden_gem = true`:

```json
{
  "_id": "place_kishanpura_chhatri",
  "name": "Kishanpura Chhatris",
  "place_type": "HIDDEN_GEM",
  "discovery": {
    "is_hidden_gem": true,
    "discovery_level": "LOCAL_SECRET",
    "why_visit": "Untouched riverside cenotaphs with intricate carvings, rarely visited by tourists.",
    "local_secret": true
  }
  /* ...other Place fields... */
}
```

### 4.5 `markets`

**Required:** `_id`, `name`, `market_type`, `short_description`, `description`, `location`, `address`, `city_id`, `state_id`, `country_code`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `famous_for` (string[]), `opening_hours`, `best_time_to_visit`, `history`, `cultural_significance`, `media`, `related_food_ids`, `related_artisan_ids`, `tags`

```json
{
  "_id": "market_sarafa_bazaar",
  "name": "Sarafa Bazaar",
  "market_type": "NIGHT_MARKET",
  "short_description": "A jewellery market by day, legendary night food market after 9 PM.",
  "description": "Full description...",
  "famous_for": ["Bhutte ka kees", "Garadu", "Joshi Dahi Wada"],
  "opening_hours": "21:00–02:00 (food); 11:00–20:00 (jewellery)",
  "best_time_to_visit": "Late night, 10 PM onwards",
  "history": "Historically a jewellers' market that transforms at night...",
  "cultural_significance": "A symbol of Indore's food culture.",
  "location": { "type": "Point", "coordinates": [75.8564, 22.7185] },
  "address": { "line1": "Sarafa Bazaar", "city_id": "city_indore_mp", "state_id": "state_mp", "country_code": "IN" },
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "country_code": "IN",
  "media": [ /* Media[] */ ],
  "related_food_ids": ["food_bhutte_ka_kees"],
  "related_artisan_ids": [],
  "tags": ["night_market", "street_food"],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "2026-05-01T00:00:00Z", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "2026-05-01T00:00:00Z", "published_by": "user_admin1" },
  "created_at": "2026-01-10T00:00:00Z",
  "updated_at": "2026-05-01T00:00:00Z"
}
```

### 4.6 `foods`

The **culinary item itself** (culture/knowledge), separate from where to eat it.

**Required:** `_id`, `name`, `food_category`, `description`, `origin_city_id` or `region`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `local_names` (string[]), `ingredients` (string[]), `cultural_significance`, `history`, `media`, `related_food_place_ids`, `tags`

```json
{
  "_id": "food_indori_poha",
  "name": "Indori Poha",
  "local_names": ["Poha Jalebi"],
  "food_category": "STREET_FOOD",
  "description": "Flattened rice tempered with mustard seeds, topped with sev, pomegranate, and a side of jalebi.",
  "origin_city_id": "city_indore_mp",
  "region": "Malwa",
  "ingredients": ["flattened rice", "mustard seeds", "sev", "pomegranate"],
  "cultural_significance": "The default Indori breakfast, sold at nearly every street corner.",
  "history": "string | null",
  "media": [ /* Media[] */ ],
  "related_food_place_ids": ["food_place_johny_hot_dog_669"],
  "tags": ["breakfast", "vegetarian"],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-01-12T00:00:00Z",
  "updated_at": "2026-05-01T00:00:00Z"
}
```

### 4.7 `food_places`

Where a food/cuisine can be experienced — vendor, stall, restaurant.

**Required:** `_id`, `name`, `food_place_type`, `location`, `address`, `city_id`, `state_id`, `country_code`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `description`, `famous_dish_food_ids` (→ `foods`), `market_id` (if inside a market), `price_range`, `opening_hours`, `media`, `tags`, `public_contact` (phone/social — public only, never private data)

```json
{
  "_id": "food_place_johny_hot_dog_669",
  "name": "Johny Hot Dog",
  "food_place_type": "STALL",
  "description": "A legendary Sarafa Bazaar stall famous for its late-night snacks.",
  "famous_dish_food_ids": ["food_indori_poha"],
  "market_id": "market_sarafa_bazaar",
  "price_range": "₹50–150",
  "opening_hours": "21:00–01:00",
  "location": { "type": "Point", "coordinates": [75.8564, 22.7186] },
  "address": { "line1": "Sarafa Bazaar", "city_id": "city_indore_mp", "state_id": "state_mp", "country_code": "IN" },
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "country_code": "IN",
  "media": [ /* Media[] */ ],
  "public_contact": { "phone": "string | null", "instagram": "string | null" },
  "tags": ["street_food", "night_food"],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-01-15T00:00:00Z",
  "updated_at": "2026-04-01T00:00:00Z"
}
```

### 4.8 `artisans`

**Required:** `_id`, `name`, `specializations` (string[] ∈ `artisan_specialization_type`), `bio`, `city_id`, `state_id`, `country_code`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `profile_media`, `community_id`, `location`, `workshop_address`, `story_id`, `experience_availability` (bool + description), `media`, `public_contact` (never private data by default)

```json
{
  "_id": "artisan_ramesh_bagh_print",
  "name": "Ramesh Chippa",
  "profile_media": { /* Media */ },
  "bio": "Third-generation Bagh block-print artisan from Dhar district near Indore.",
  "specializations": ["TEXTILE"],
  "community_id": "community_chippa_printers",
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "country_code": "IN",
  "location": { "type": "Point", "coordinates": [75.0, 22.5] },
  "workshop_address": { "line1": "Bagh village workshop", "city_id": "city_indore_mp", "state_id": "state_mp", "country_code": "IN" },
  "story_id": "story_bagh_print_legacy",
  "experience_availability": { "available": true, "description": "Offers hands-on block-printing workshops on request." },
  "media": [ /* Media[] */ ],
  "public_contact": { "phone": null, "instagram": "string | null" },
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-02-01T00:00:00Z",
  "updated_at": "2026-05-10T00:00:00Z"
}
```
> Private contact info (personal phone, home address) is **never** stored unless the artisan explicitly opts in for public listing, and even then only `public_contact` fields are exposed via API.

### 4.9 `communities`

**Required:** `_id`, `name`, `description`, `city_id` or `state_id`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `languages` (string[]), `traditions` (string[]), `craft_ids` (→ artisans' specializations or a craft taxonomy), `food_ids`, `festival_event_ids`, `cultural_practices`, `history`, `story_ids`, `media`

```json
{
  "_id": "community_chippa_printers",
  "name": "Chippa Block-Printing Community",
  "description": "Traditional block-printing artisan community centered around the Bagh region.",
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "languages": ["Hindi", "Malvi"],
  "traditions": ["Bagh block printing", "natural dye-making"],
  "food_ids": [],
  "festival_event_ids": [],
  "cultural_practices": "string | null",
  "history": "string | null",
  "story_ids": ["story_bagh_print_legacy"],
  "media": [ /* Media[] */ ],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-02-01T00:00:00Z",
  "updated_at": "2026-05-01T00:00:00Z"
}
```
> Deliberately excludes sensitive personal/demographic attributes — focuses only on public-interest cultural knowledge.

### 4.10 `events`

Covers festivals and other cultural events via `event_type`.

**Required:** `_id`, `title`, `event_type`, `description`, `start_at`, `city_id`, `state_id`, `country_code`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `end_at`, `venue` (string), `location`, `organizer` (string or `community_id`), `community_ids`, `related_place_ids`, `cultural_significance`, `media`, `is_recurring` (bool), `recurrence_rule` (string, e.g. RRULE)

```json
{
  "_id": "event_ahilya_utsav_2026",
  "title": "Ahilya Utsav",
  "event_type": "FESTIVAL",
  "description": "Annual cultural festival celebrating Maharani Ahilyabai Holkar's legacy.",
  "start_at": "2026-11-20T10:00:00Z",
  "end_at": "2026-11-22T22:00:00Z",
  "venue": "Rajwada Palace grounds",
  "location": { "type": "Point", "coordinates": [75.8553, 22.7177] },
  "organizer": "Indore Municipal Corporation",
  "community_ids": ["community_holkar_heritage"],
  "related_place_ids": ["place_rajwada_palace"],
  "cultural_significance": "Commemorates Ahilyabai's administrative and cultural contributions.",
  "media": [ /* Media[] */ ],
  "is_recurring": true,
  "recurrence_rule": "FREQ=YEARLY",
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "country_code": "IN",
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-03-01T00:00:00Z",
  "updated_at": "2026-08-01T00:00:00Z"
}
```

### 4.11 `stories`

**Required:** `_id`, `title`, `story_type`, `short_description`, `content`, `language`, `author_id`, `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `city_id`, `state_id`, `place_id`, `community_id`, `media`, `sources` (string[])

```json
{
  "_id": "story_holkar_legacy",
  "title": "The Palace That Survived Two Fires",
  "story_type": "LOCAL_HISTORY",
  "short_description": "How Rajwada Palace was rebuilt twice after devastating fires.",
  "content": "Full narrative content...",
  "language": "en",
  "city_id": "city_indore_mp",
  "state_id": "state_mp",
  "place_id": "place_rajwada_palace",
  "community_id": null,
  "author_id": "user_contributor_42",
  "media": [ /* Media[] */ ],
  "sources": ["Local Indore Gazetteer, 1908"],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-02-10T00:00:00Z",
  "updated_at": "2026-04-01T00:00:00Z"
}
```

### 4.12 `trails`

A trail **references** entities across types — it never embeds full entity documents.

**Required:** `_id`, `title`, `description`, `city_id`, `stops` (array of `TrailStop`), `verification`, `publication`, `created_at`, `updated_at`

**Optional/Nullable:** `estimated_duration`, `difficulty`, `tags`, `cover_media`

`TrailStop` subdocument:
```json
{
  "order": 1,
  "entity_type": "PLACE",
  "entity_id": "place_rajwada_palace",
  "note": "Start here at 6 PM for the light show."
}
```

```json
{
  "_id": "trail_indore_heritage_food",
  "title": "Indore Heritage & Food Trail",
  "description": "A half-day walk connecting old-city heritage with legendary night food.",
  "city_id": "city_indore_mp",
  "estimated_duration": "5 hours",
  "difficulty": "EASY",
  "stops": [
    { "order": 1, "entity_type": "PLACE", "entity_id": "place_rajwada_palace", "note": "Start at sunset." },
    { "order": 2, "entity_type": "MARKET", "entity_id": "market_sarafa_bazaar", "note": "Arrive by 9 PM for the food transformation." },
    { "order": 3, "entity_type": "FOOD", "entity_id": "food_indori_poha", "note": "Try it fresh in the morning instead if visiting at breakfast time." }
  ],
  "cover_media": [ /* Media[] */ ],
  "tags": ["heritage", "food", "evening"],
  "verification": { "verification_status": "VERIFIED", "verified_by": "user_admin1", "verified_at": "...", "verification_notes": null, "sources": [] },
  "publication": { "publication_status": "PUBLISHED", "published_at": "...", "published_by": "user_admin1" },
  "created_at": "2026-03-15T00:00:00Z",
  "updated_at": "2026-06-01T00:00:00Z"
}
```

### 4.13 `users`

**Required:** `_id`, `name`, `email`, `role`, `preferred_language`, `created_at`, `updated_at`

**Optional/Nullable:** `profile_image` (Media), `bio`, `home_city_id`, `interests` (string[]), `is_active` (bool)

> Saved items and contributions are **never** embedded here — they are queried from `saved_items` / `contributions` by `user_id`.

```json
{
  "_id": "user_contributor_42",
  "name": "Aditi Sharma",
  "email": "aditi@example.com",
  "profile_image": { /* Media */ },
  "bio": "Heritage walk enthusiast documenting Indore's old city.",
  "preferred_language": "en",
  "home_city_id": "city_indore_mp",
  "interests": ["heritage", "street_food", "photography"],
  "role": "CONTRIBUTOR",
  "is_active": true,
  "created_at": "2025-11-01T00:00:00Z",
  "updated_at": "2026-08-01T00:00:00Z"
}
```

### 4.14 `saved_items`

Separate favorites collection, never a giant array on `users`.

**Required:** `_id`, `user_id`, `entity_type`, `entity_id`, `created_at`

```json
{
  "_id": "saved_9f3a",
  "user_id": "user_contributor_42",
  "entity_type": "PLACE",
  "entity_id": "place_kishanpura_chhatri",
  "created_at": "2026-07-01T00:00:00Z"
}
```
Unique compound constraint: `(user_id, entity_type, entity_id)`.

### 4.15 `contributions`

Tracks user submissions/edits without duplicating them inside `users`.

**Required:** `_id`, `user_id`, `contribution_type`, `status`, `target_entity_type`, `payload` or `target_entity_id`, `created_at`, `updated_at`

**Optional/Nullable:** `reviewed_by`, `reviewed_at`, `review_notes`, `resulting_entity_id`

```json
{
  "_id": "contrib_5521",
  "user_id": "user_contributor_42",
  "contribution_type": "HIDDEN_GEM_SUBMISSION",
  "status": "IN_REVIEW",
  "target_entity_type": "PLACE",
  "payload": { "name": "Old Stepwell near Rajwada", "description": "..." , "location": {"type":"Point","coordinates":[75.85,22.72]} },
  "reviewed_by": null,
  "reviewed_at": null,
  "review_notes": null,
  "resulting_entity_id": null,
  "created_at": "2026-08-20T00:00:00Z",
  "updated_at": "2026-08-20T00:00:00Z"
}
```
Profile-level counts (discoveries, stories, reports, approved/pending) are **derived** via aggregation on `user_id`, never stored as arrays on the user document.

### 4.16 `reports`

Issue/error reporting on any entity.

**Required:** `_id`, `reported_by`, `entity_type`, `entity_id`, `report_type`, `description`, `status`, `created_at`, `updated_at`

**Optional/Nullable:** `resolved_by`, `resolved_at`, `resolution_notes`

```json
{
  "_id": "report_8812",
  "reported_by": "user_contributor_42",
  "entity_type": "FOOD_PLACE",
  "entity_id": "food_place_johny_hot_dog_669",
  "report_type": "OUTDATED_INFORMATION",
  "description": "This stall has permanently closed as of Aug 2026.",
  "status": "OPEN",
  "resolved_by": null,
  "resolved_at": null,
  "resolution_notes": null,
  "created_at": "2026-08-25T00:00:00Z",
  "updated_at": "2026-08-25T00:00:00Z"
}
```

### 4.17 `activity_logs`

Lightweight audit trail (views, saves, contributions, verification actions) — supports future personalization/recommendations without bloating core entities.

**Required:** `_id`, `user_id` (nullable for anonymous), `action_type`, `entity_type`, `entity_id`, `created_at`

```json
{
  "_id": "log_00921",
  "user_id": "user_contributor_42",
  "action_type": "VIEW",
  "entity_type": "PLACE",
  "entity_id": "place_rajwada_palace",
  "created_at": "2026-09-04T09:00:00Z"
}
```
This collection is high-write, append-only, and should use a TTL index or periodic archival for scale.

---

## 5. Relationship Map

All relationships are **ID references**, never embedded full objects.

```
City ─┬─< Place
      ├─< Market
      ├─< Food (origin_city_id)
      ├─< FoodPlace
      ├─< Artisan
      ├─< Community
      ├─< Event
      ├─< Story
      └─< Trail

Place  ──> Community        (related_community_ids)
Place  ──> Story            (story_ids)
Place  ──> Event            (related_event_ids)
Place  ──> Market           (related_market_ids)

Market ──> Food             (related_food_ids)
Market ──> Artisan          (related_artisan_ids)
Market ──> FoodPlace        (food_place.market_id, inverse ref)

Food   ──> FoodPlace        (related_food_place_ids)
FoodPlace ──> Food          (famous_dish_food_ids)
FoodPlace ──> Market        (market_id)

Artisan ──> Community       (community_id)
Artisan ──> Story           (story_id)

Community ──> Story         (story_ids)
Community ──> Event         (festival_event_ids)

Event  ──> Community        (community_ids)
Event  ──> Place            (related_place_ids)

Trail  ──> Place | Market | Food | FoodPlace | Artisan | Event | Story
           (via TrailStop.entity_type + entity_id — polymorphic, never duplicated)

User   ──> SavedItem        (1:N, user_id)
User   ──> Contribution     (1:N, user_id)
User   ──> Report           (1:N, reported_by)
```

Cross-collection references use the generic `EntityRef { entity_type, entity_id }` pattern wherever a field must point to **one of several** collection types (trails, saved items, reports, activity logs). Single-type references (e.g. `city_id`, `market_id`) use direct scalar foreign keys.

---

## 6. GeoJSON Rules

1. All location fields are GeoJSON `Point` objects: `{ "type": "Point", "coordinates": [lng, lat] }`.
2. **Order is always `[longitude, latitude]`** — never `[latitude, longitude]`.
3. Longitude must be a number in `[-180, 180]`; latitude in `[-90, 90]`.
4. For India specifically (sanity-check range, not a hard constraint): longitude roughly `[68, 98]`, latitude roughly `[6, 38]`.
5. Every geographic entity (`cities`, `states`, `places`, `markets`, `food_places`, `artisans`, `events` with a venue) must carry `location`, `city_id`, `state_id`, and `country_code` alongside the structured `address`.
6. `location` fields must have a MongoDB `2dsphere` index to support `$near`, `$geoWithin`, and radius search.
7. Reverse validation: application layer should reject any payload where `coordinates[0]` (longitude) falls in typical latitude range (e.g. `> 90` combined with small second value) as a likely swapped-order bug.

---

## 7. Validation Rules

- **Required vs optional** is enforced via `$jsonSchema` per collection (see field tables above); optional fields are nullable, not simply absent, where the app needs to distinguish "unknown" from "empty."
- **Enums**: any field representing a controlled category (`place_type`, `market_type`, `event_type`, `story_type`, `*_status`, etc.) must validate against the exact enum list in [§2](#2-enums) — no arbitrary strings.
- **Normalization**: any field used for case-insensitive filtering (`name` → `normalized_name`, `city` name copies, `tags`) must maintain a lowercase/trimmed counterpart, computed server-side on write — case must never be a business rule (`Indore` = `indore` = `INDORE`).
- **Foreign keys**: `*_id` fields must reference an existing document in the target collection; referential integrity checked at write time (application layer, since MongoDB doesn't enforce FKs natively).
- **Verification vs publication**: these are independent state machines. Valid combination example: `verification_status = VERIFIED` + `publication_status = DRAFT` (verified but not yet live). Application logic should still forbid `publication_status = PUBLISHED` while `verification_status = REJECTED`.
- **Media**: `media[].url` must be a valid HTTPS URL to CDN/object storage; no base64 or binary blobs accepted in these documents.
- **Ownership fields**: `created_by`, `submitted_by`, `verified_by`, `published_by` are set server-side from the authenticated session — never accepted from client payload directly (prevents spoofing authorship/verification).
- **No embedded giant arrays**: collections like `saved_items`, `contributions`, `reports`, `activity_logs` are always separate documents referencing `user_id` — never arrays inside the `users` document.
- **No circular embedding**: trails reference stops by `EntityRef`, never by embedding full place/market/food objects.

---

## 8. MongoDB Index Recommendations

```json
{
  "cities": [
    { "keys": { "normalized_name": 1 }, "unique": true },
    { "keys": { "state_id": 1 } },
    { "keys": { "location": "2dsphere" } },
    { "keys": { "is_featured": 1 } }
  ],
  "places": [
    { "keys": { "location": "2dsphere" } },
    { "keys": { "city_id": 1, "place_type": 1 } },
    { "keys": { "city_id": 1, "discovery.is_hidden_gem": 1 } },
    { "keys": { "publication.publication_status": 1, "verification.verification_status": 1 } },
    { "keys": { "tags": 1 } },
    { "keys": { "name": "text", "short_description": "text", "description": "text" } }
  ],
  "markets": [
    { "keys": { "location": "2dsphere" } },
    { "keys": { "city_id": 1, "market_type": 1 } },
    { "keys": { "tags": 1 } }
  ],
  "foods": [
    { "keys": { "origin_city_id": 1 } },
    { "keys": { "food_category": 1 } },
    { "keys": { "name": "text", "description": "text" } }
  ],
  "food_places": [
    { "keys": { "location": "2dsphere" } },
    { "keys": { "city_id": 1, "food_place_type": 1 } },
    { "keys": { "market_id": 1 } }
  ],
  "artisans": [
    { "keys": { "location": "2dsphere" } },
    { "keys": { "city_id": 1, "specializations": 1 } },
    { "keys": { "community_id": 1 } }
  ],
  "communities": [
    { "keys": { "city_id": 1 } },
    { "keys": { "state_id": 1 } }
  ],
  "events": [
    { "keys": { "city_id": 1, "start_at": 1 } },
    { "keys": { "event_type": 1, "start_at": 1 } },
    { "keys": { "location": "2dsphere" } }
  ],
  "stories": [
    { "keys": { "place_id": 1 } },
    { "keys": { "community_id": 1 } },
    { "keys": { "city_id": 1, "story_type": 1 } }
  ],
  "trails": [
    { "keys": { "city_id": 1 } },
    { "keys": { "stops.entity_id": 1 } }
  ],
  "users": [
    { "keys": { "email": 1 }, "unique": true },
    { "keys": { "home_city_id": 1 } }
  ],
  "saved_items": [
    { "keys": { "user_id": 1, "entity_type": 1, "entity_id": 1 }, "unique": true },
    { "keys": { "user_id": 1, "created_at": -1 } }
  ],
  "contributions": [
    { "keys": { "user_id": 1, "status": 1 } },
    { "keys": { "target_entity_type": 1, "status": 1 } }
  ],
  "reports": [
    { "keys": { "entity_type": 1, "entity_id": 1 } },
    { "keys": { "status": 1, "created_at": -1 } }
  ],
  "activity_logs": [
    { "keys": { "user_id": 1, "created_at": -1 } },
    { "keys": { "entity_type": 1, "entity_id": 1 } },
    { "keys": { "created_at": 1 }, "expireAfterSeconds": 15552000, "note": "TTL example: 180-day retention" }
  ]
}
```

---

## 9. Example Documents

Full worked examples are embedded inline within each collection's section in [§4](#4-collections) above (city, place, hidden gem, market, food, food place, artisan, community, event, story, trail, user, saved item, contribution, report, activity log). Each example is internally consistent — IDs cross-reference each other (e.g. `place_rajwada_palace` ↔ `story_holkar_legacy` ↔ `trail_indore_heritage_food`) to demonstrate the relationship-driven model in practice.

---

## 10. App-Flow → Schema Mapping

| App Flow | Backing Query |
|---|---|
| **HOME** → nearby discovery | `$geoNear` / `$near` across `places`, `markets`, `food_places`, `artisans` using device coordinates |
| **CITY** → tabs (Heritage / Hidden Gems / Markets / Food / Artisans / Communities / Events / Stories / Trails) | Filter each respective collection by `city_id`, plus `place_type` or `discovery.is_hidden_gem` for the two Place-derived tabs |
| **EXPLORE** → search | Text indexes on `name`/`description` fields per collection, or a unified search index (e.g. Atlas Search) across collections tagged by `entity_type` |
| **EXPLORE** → categories/filters | Enum-field filters (`place_type`, `market_type`, `event_type`, `tags`) |
| **EXPLORE** → map | `2dsphere` queries bounded by viewport bbox (`$geoWithin`) |
| **DETAIL PAGE** | Single document fetch by `_id`, then resolve `related_*_ids` / `story_ids` / etc. via `$lookup` or app-layer batched fetch |
| **PROFILE** → saved items | `saved_items` filtered by `user_id`, joined to target collections by `entity_type` |
| **PROFILE** → contributions | `contributions` filtered by `user_id`, grouped by `status` |
| **PROFILE** → reports | `reports` filtered by `reported_by` |
| **PROFILE** → derived stats | Aggregation pipelines (`$group`/`$count`) over `contributions`, `saved_items`, `reports` — never stored arrays |

---

*End of schema document.*
