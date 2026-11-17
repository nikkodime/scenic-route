# 0005: Offline-first clients, delta sync, last writer wins

**Decision.** Clients keep their own store (SwiftData on iOS, IndexedDB on web)
and sync through `POST /v1/sync`. Records carry a client UUID, `updated_at`
and a `deleted` tombstone. The server applies a change only if it is newer
than what it has (server receive time breaks ties) and returns all changes
since the client's cursor (a monotonic server sequence number).
Ratings are append-only and never conflict.

**Why.** Drivers in the hills have no signal; a saved trip must open and
navigate offline. Trips are edited by one person on at most two devices, so
per-record last-writer-wins is enough; CRDTs would be over-engineering.
