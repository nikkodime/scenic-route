import Foundation

/// Offline-first store for trips and ratings (ADR 0005). Everything is saved locally first,
/// then pushed by `sync`. A JSON file is plenty for a few hundred trips.
public actor TripStore {
    struct State: Codable {
        var trips: [UUID: Trip] = [:]
        var dirtyTrips: Set<UUID> = []
        var pendingRatings: [Rating] = []
        var cursor: Int?
    }

    private var state = State()
    private let fileURL: URL?

    public init(fileURL: URL?) {
        self.fileURL = fileURL
        if let fileURL, let data = try? Data(contentsOf: fileURL), let s = try? JSONDecoder().decode(State.self, from: data) {
            state = s
        }
    }

    public static func defaultURL() -> URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("trips.json")
    }

    private func persist() {
        guard let fileURL, let data = try? JSONEncoder().encode(state) else { return }
        try? data.write(to: fileURL, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
    }

    public var trips: [Trip] {
        state.trips.values.filter { !$0.deleted }.sorted { $0.updatedAt > $1.updatedAt }
    }

    public var pendingCount: Int { state.dirtyTrips.count + state.pendingRatings.count }

    public func save(_ trip: Trip, now: Date = Date()) {
        var t = trip
        t.updatedAt = ISO8601DateFormatter().string(from: now)
        state.trips[t.id] = t
        state.dirtyTrips.insert(t.id)
        persist()
    }

    public func delete(_ id: UUID, now: Date = Date()) {
        guard var t = state.trips[id] else { return }
        t.deleted = true
        save(t, now: now)
    }

    public func addRating(_ r: Rating) {
        state.pendingRatings.append(r)
        persist()
    }

    /// Push local changes, pull remote ones. Remote wins only when newer (last writer wins).
    @discardableResult
    public func sync(using api: APIClient) async throws -> Int {
        let pushTrips = state.dirtyTrips.compactMap { state.trips[$0] }
        let pushRatings = state.pendingRatings
        let res = try await api.sync(cursor: state.cursor, changes: SyncChanges(trips: pushTrips, ratings: pushRatings))
        // Everything we sent was either applied or superseded by a newer server version.
        for t in pushTrips where state.trips[t.id]?.updatedAt == t.updatedAt { state.dirtyTrips.remove(t.id) }
        let sentIds = Set(pushRatings.map(\.id))
        state.pendingRatings.removeAll { sentIds.contains($0.id) }
        var changed = merge(res.changes.trips)
        for idString in res.rejected {
            guard let id = UUID(uuidString: idString) else { continue }
            if let server = try? await api.trip(id: id) { changed += merge([server]) }
        }
        state.cursor = res.cursor
        persist()
        return changed
    }

    /// Apply remote trips; returns how many local records changed.
    @discardableResult
    func merge(_ remote: [Trip]) -> Int {
        var n = 0
        for r in remote {
            if let local = state.trips[r.id], local.updatedDate >= r.updatedDate { continue }
            state.trips[r.id] = r
            state.dirtyTrips.remove(r.id)
            n += 1
        }
        return n
    }
}
