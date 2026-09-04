# Dharohar — Project Description
*India's Digital Cultural Ecosystem*

---

## What We're Building

Dharohar is a **unified digital heritage-tourism ecosystem** for India — not a single app, but three connected surfaces (a mobile travel companion, a discovery-and-planning website, and a government intelligence portal) sitting on one shared platform of verified cultural data.

The one-line pitch: **help people discover the India beyond the obvious tourist circuit, while giving tourism authorities the real-time intelligence to manage and improve it.**

## The Problem

India's heritage is far bigger than its famous monuments — it's architecture, food, festivals, crafts, living communities, and local stories, city by city. But today a tourist needs a dozen different tools to piece that together (discovery, historical context, nearby experiences, food, planning, reporting problems), and even then tourism concentrates almost entirely on the same handful of famous sites. Everything else — the hidden temples, the night food markets, the artisan communities, the local legends — stays effectively invisible.

On the government side, there's no integrated picture of what visitors actually want, where they run into problems, or which under-visited sites have real tourism potential.

## The Solution

Three interfaces, one platform:

- **📱 Mobile App** — a real-time travel companion: "Around Me" discovery, an AI heritage guide that answers questions on-site, live trip support.
- **💻 Website** — deep discovery and planning: an interactive heritage map, trip planner, and a personal "Heritage Passport" (visits, collections, achievements, travel timeline).
- **🏛️ Admin/Government Portal** — heritage content management, tourism analytics, feedback and issue tracking, and destination-level intelligence.

All three read and write to a **shared platform**: cultural content (places, markets, food, artisans, communities, events, stories, trails), user data, and tourism data, with an AI/analytics layer underneath.

**Philosophy:** Discover → Understand → Experience → Preserve → Improve. A tourist finds a place they wouldn't otherwise have known about, gets AI-guided context grounded in verified sources, connects it to food/craft/culture around it, can flag issues they notice, and that feedback loop directly improves the site and surfaces it better to the next visitor.

**What makes it more than a discovery app:** every verified visit, piece of feedback, and geo-tagged issue report becomes consent-based tourism intelligence for authorities — closing the loop between discovery, experience, feedback, and heritage management, rather than leaving tourists and government working from completely separate information.

## The Data Model

The platform's cultural content is modeled as an interconnected web, not a flat list — 17 MongoDB collections (`places`, `markets`, `foods`, `food_places`, `artisans`, `communities`, `events`, `stories`, `trails`, plus `cities`/`states`/`countries`, `users`, `saved_items`, `contributions`, `reports`, and `activity_logs`), all ID-referenced rather than duplicated, all geo-indexed for "near me" search, and every content item carrying **independent verification and publication states** — so something can be fact-checked as accurate long before it's made publicly visible, and content quality is never a launch-blocking gate on content coverage.

Community-driven growth is built in from the start: any user can contribute a place, hidden gem, story, food, or artisan profile, or flag something outdated — all of it routed through a moderation queue before it goes live, with authorship always server-verified rather than trusted from the client.

## Pilot City: Indore

The platform launches with **Indore, Madhya Pradesh** as its fully-realized reference city — the Holkar-dynasty palaces and chhatris, the Khajrana Ganesh Temple, Sarafa Bazaar's midnight food market, Chappan Dukan's 56-shop breakfast strip, Maheshwari and Bagh block-print weaving traditions, the Sindhi and Marwari trading communities, the Rangpanchami Gair procession, and a full 5-stop heritage-and-night-food cultural trail — all sourced, structured, and ready to seed as real (not placeholder) launch content.

## How It's Being Built

- **Frontend:** Flutter for the mobile app (single codebase), Next.js/React for the website and admin portal.
- **Backend:** TypeScript + Express + MongoDB (Mongoose + zod validation), matching the schema's native Mongo design — geo-first with `2dsphere` indexes, JWT-based auth with role-based access (`Visitor → Contributor → Local Expert → Moderator → Admin`), and an AI layer built as a RAG pipeline (heritage knowledge base → grounded, cited LLM answers) for the in-app AI guide.
- **Build process:** a phased MVP plan — reference data & core content models, read/discovery API, Indore seed data, auth, the contribution and moderation pipeline, and admin verification controls — sized as discrete tasks for building with Google Antigravity's agent-driven workflow, each phase closed out with a verifiable artifact (a working query, a seed run, a round-trip test) rather than just a diff.

## Context

Dharohar started as a Smart India Hackathon (SIH) 2026 idea submission (working name "Bhraman") and has since grown into a frozen data schema and a concrete backend build plan, with Indore as the pilot city proving the model end-to-end before expanding city by city.
