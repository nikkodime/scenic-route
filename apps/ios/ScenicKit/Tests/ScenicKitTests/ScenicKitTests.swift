import XCTest
@testable import ScenicKit

final class PolylineTests: XCTestCase {
    func testGoogleReferenceValue() {
        let line = [Coordinate(lat: 38.5, lon: -120.2), Coordinate(lat: 40.7, lon: -120.95), Coordinate(lat: 43.252, lon: -126.453)]
        XCTAssertEqual(Polyline.encode(line), "_p~iF~ps|U_ulLnnqC_mqNvxq`@")
        let back = Polyline.decode("_p~iF~ps|U_ulLnnqC_mqNvxq`@")
        XCTAssertEqual(back.count, 3)
        XCTAssertEqual(back[2].lat, 43.252, accuracy: 1e-6)
        XCTAssertEqual(back[2].lon, -126.453, accuracy: 1e-6)
    }

    func testGpxEscapes() {
        let gpx = GPX.make(name: "Val d'Orcia & \"friends\"", line: [Coordinate(lat: 43, lon: 11)], stops: [ScenicStop(lat: 43.05, lon: 11.6, name: "", types: [])])
        XCTAssertTrue(gpx.contains("&amp; &quot;friends&quot;"))
        XCTAssertTrue(gpx.contains("<name>Stop 1</name>"))
    }
}

final class ContractTests: XCTestCase {
    func fixture() throws -> Data {
        let url = try XCTUnwrap(Bundle.module.url(forResource: "plan-response", withExtension: "json", subdirectory: "Fixtures"))
        return try Data(contentsOf: url)
    }

    /// The fixture is real planner output (packages/core), so this proves Swift and TypeScript agree.
    func testDecodesPlannerOutput() throws {
        let res = try JSONDecoder().decode(PlanResponse.self, from: fixture())
        XCTAssertEqual(res.routes.first?.label, "Most scenic")
        let r = try XCTUnwrap(res.routes.first)
        XCTAssertGreaterThan(r.line.count, 10)
        XCTAssertEqual(r.line.first!.lat, 43.3188, accuracy: 0.001)
        XCTAssertNotNil(r.conditions?.sunset)
        XCTAssertFalse(r.highlights.isEmpty)
    }

    func testPlanRequestEncodesLikeTheAPIExpects() throws {
        let req = PlanRequest(origin: Place(lat: 43.3, lon: 11.3, label: "Siena"), destination: Place(lat: 43.07, lon: 11.67), extraMinutes: 60)
        let json = try JSONSerialization.jsonObject(with: JSONEncoder().encode(req)) as! [String: Any]
        XCTAssertEqual(json["extraMinutes"] as? Int, 60)
        XCTAssertEqual((json["prefs"] as? [String: Any])?["avoidUnpaved"] as? Bool, true)
    }
}

final class FormatTests: XCTestCase {
    func testDurations() {
        XCTAssertEqual(Format.duration(minutes: 40), "40 min")
        XCTAssertEqual(Format.duration(minutes: 95), "1 h 35 min")
        XCTAssertEqual(Format.duration(minutes: 120), "2 h")
        XCTAssertEqual(Format.extra(minutes: 0.4), "No extra time")
        XCTAssertEqual(Format.band(score: 80), .stunning)
        XCTAssertEqual(Format.distance(km: 7.25), "7.2 km")
    }
}

/// Fake server implementing /v1/auth/anonymous, /v1/sync and /v1/trips/:id with last-writer-wins.
final class FakeServer: HTTPTransport, @unchecked Sendable {
    var trips: [UUID: Trip] = [:]
    var seq: [UUID: Int] = [:]
    var counter = 0
    var syncCalls = 0
    let lock = NSLock()

    func send(_ request: URLRequest) async throws -> (Data, HTTPURLResponse) {
        try lock.withLock { try handle(request) }
    }

    private func handle(_ request: URLRequest) throws -> (Data, HTTPURLResponse) {
        let path = request.url!.path
        let ok = { (data: Data) in (data, HTTPURLResponse(url: request.url!, statusCode: 200, httpVersion: nil, headerFields: nil)!) }
        if path.hasSuffix("/v1/auth/anonymous") { return ok(#"{"token":"t","userId":"u"}"#.data(using: .utf8)!) }
        if path.hasSuffix("/v1/sync") {
            syncCalls += 1
            let body = try JSONDecoder().decode(SyncRequest.self, from: request.httpBody!)
            var rejected: [String] = []
            for t in body.changes.trips {
                if let cur = trips[t.id], cur.updatedDate >= t.updatedDate {
                    if cur.updatedDate > t.updatedDate { rejected.append(t.id.uuidString) }
                    continue
                }
                counter += 1; trips[t.id] = t; seq[t.id] = counter
            }
            let since = body.cursor ?? 0
            let out = trips.values.filter { (seq[$0.id] ?? 0) > since }
            return ok(try JSONEncoder().encode(SyncResponse(cursor: counter, changes: SyncChanges(trips: out, ratings: []), rejected: rejected)))
        }
        if let id = UUID(uuidString: request.url!.lastPathComponent), let t = trips[id] { return ok(try JSONEncoder().encode(t)) }
        return (Data(), HTTPURLResponse(url: request.url!, statusCode: 404, httpVersion: nil, headerFields: nil)!)
    }
}

final class SyncTests: XCTestCase {
    let place = Place(lat: 43.3, lon: 11.3, label: "Siena")

    func testTwoDevicesConvergeWithLastWriterWins() async throws {
        let server = FakeServer()
        let api = APIClient(baseURL: URL(string: "http://test")!, transport: server)
        let phone = TripStore(fileURL: nil)
        let web = TripStore(fileURL: nil)
        let t0 = Date(timeIntervalSince1970: 1_800_000_000)

        var trip = Trip(name: "Val d'Orcia", days: [TripDay(origin: place, destination: place)], now: t0)
        await phone.save(trip, now: t0)
        try await phone.sync(using: api)
        let pendingAfterPush = await phone.pendingCount
        XCTAssertEqual(pendingAfterPush, 0)

        try await web.sync(using: api)
        let webTrips = await web.trips
        XCTAssertEqual(webTrips.map(\.name), ["Val d'Orcia"])

        // Web renames later; phone renames earlier while offline. Web's newer edit wins everywhere.
        trip.name = "Phone name"
        await phone.save(trip, now: t0.addingTimeInterval(60))
        trip.name = "Web name"
        await web.save(trip, now: t0.addingTimeInterval(120))
        try await web.sync(using: api)
        try await phone.sync(using: api)
        let phoneTrips = await phone.trips
        XCTAssertEqual(phoneTrips.first?.name, "Web name")

        // Deletes travel as tombstones.
        await web.delete(trip.id, now: t0.addingTimeInterval(180))
        try await web.sync(using: api)
        try await phone.sync(using: api)
        let afterDelete = await phone.trips
        XCTAssertTrue(afterDelete.isEmpty)
    }

    func testPersistsAcrossLaunches() async throws {
        let url = FileManager.default.temporaryDirectory.appendingPathComponent("trips-\(UUID()).json")
        let a = TripStore(fileURL: url)
        await a.save(Trip(name: "Chianti", days: [TripDay(origin: place, destination: place)]))
        let b = TripStore(fileURL: url)
        let names = await b.trips.map(\.name)
        XCTAssertEqual(names, ["Chianti"])
        let pending = await b.pendingCount
        XCTAssertEqual(pending, 1)
    }
}
