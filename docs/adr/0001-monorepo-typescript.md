# 0001: One repository, TypeScript core shared by API and web

**Decision.** npm workspaces in this repository. All route logic (scoring,
candidates, conditions, advisories, contracts) lives once in `@scenic/core`
(TypeScript, no I/O). The API and the web planner import it. The iOS app does
not re-implement scoring: it calls the API and shares the contract through
OpenAPI.

**Why.** One scoring implementation means a route has the same score on the
phone, the web and in ratings analysis. TypeScript runs natively in Node 22
(type stripping) and Vite, so there is no separate build for development.

**Rejected.** Kotlin Multiplatform / Rust core shared with Swift: more
moving parts than a two-person team needs while the score is still changing
weekly. Revisit if offline on-device scoring becomes a requirement.
