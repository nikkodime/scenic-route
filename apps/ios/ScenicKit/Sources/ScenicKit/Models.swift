import Foundation

// Swift mirror of the API contract in packages/core/src/contracts.ts (docs/api/openapi.json).
// Keep field names identical to the JSON so Codable needs no key mapping.

public struct Coordinate: Codable, Hashable, Sendable {
    public var lat: Double
    public var lon: Double
    public init(lat: Double, lon: Double) { self.lat = lat; self.lon = lon }
}

public struct Place: Codable, Hashable, Sendable, Identifiable {
    public var lat: Double
    public var lon: Double
    public var label: String?
    public var kind: String?
    public var id: String { "\(lat),\(lon)" }
    public var coordinate: Coordinate { Coordinate(lat: lat, lon: lon) }
    public init(lat: Double, lon: Double, label: String? = nil, kind: String? = nil) {
        self.lat = lat; self.lon = lon; self.label = label; self.kind = kind
    }
}

public struct Preferences: Codable, Hashable, Sendable {
    public var rentalCar = false
    public var avoidUnpaved = true
    public var avoidTolls = false
    public var avoidMotorways = true
    public var vignettes: [String] = []
    public init() {}
}

/// How much the driver wants scenery over speed; the server turns it into a time budget.
public enum RouteStyle: String, Codable, CaseIterable, Sendable, Identifiable {
    case relaxed, scenic, mostBeautiful = "most_beautiful"
    public var id: String { rawValue }
    public var title: String {
        switch self { case .relaxed: "Relaxed"; case .scenic: "Scenic"; case .mostBeautiful: "Most beautiful" }
    }
    public var blurb: String {
        switch self {
        case .relaxed: "Nicer roads, barely any extra time."
        case .scenic: "The beautiful way, within reason."
        case .mostBeautiful: "Take your time; the drive is the day."
        }
    }
}

public enum Interest: String, Codable, CaseIterable, Sendable, Identifiable {
    case views, heritage, water, mountains, countryside, quiet
    public var id: String { rawValue }
    public var title: String {
        switch self {
        case .views: "Views"; case .heritage: "Hill towns"; case .water: "Lakes & coast"
        case .mountains: "Mountains & passes"; case .countryside: "Vineyards & cypresses"; case .quiet: "Quiet roads"
        }
    }
    public var symbol: String {
        switch self {
        case .views: "binoculars"; case .heritage: "building.columns"; case .water: "water.waves"
        case .mountains: "mountain.2"; case .countryside: "leaf"; case .quiet: "moon.zzz"
        }
    }
}

public enum Vehicle: String, Codable, CaseIterable, Sendable, Identifiable {
    case car, campervan, caravan
    public var id: String { rawValue }
    public var title: String {
        switch self { case .car: "Car"; case .campervan: "Campervan"; case .caravan: "Car + caravan" }
    }
}

public struct PlanRequest: Codable, Sendable {
    public var origin: Place
    public var destination: Place
    public var stops: [Place]
    public var style: RouteStyle
    public var interests: [Interest]
    public var vehicle: Vehicle
    /// Optional cap on extra minutes; nil lets the style decide.
    public var extraMinutes: Int?
    public var departAt: String?
    public var prefs: Preferences
    public var maxRoutes: Int
    public init(origin: Place, destination: Place, stops: [Place] = [], style: RouteStyle = .scenic, interests: [Interest] = [], vehicle: Vehicle = .car, extraMinutes: Int? = nil, departAt: Date? = nil, prefs: Preferences = .init(), maxRoutes: Int = 3) {
        self.origin = origin; self.destination = destination; self.stops = stops
        self.style = style; self.interests = interests; self.vehicle = vehicle
        self.extraMinutes = extraMinutes; self.prefs = prefs; self.maxRoutes = maxRoutes
        self.departAt = departAt.map { ISO8601DateFormatter().string(from: $0) }
    }
}

public struct ScoreParts: Codable, Hashable, Sendable {
    public var scenery: Double
    public var views: Double?
    public var relief: Double?
    public var bends: Double
    public var variety: Double
    public var motorwayPct: Double
    public var urbanPct: Double
}

public struct Highlight: Codable, Hashable, Sendable {
    public var name: String
    public var type: String
    public var atKm: Double
}

public struct ScenicStop: Codable, Hashable, Sendable {
    public var lat: Double
    public var lon: Double
    public var name: String
    public var types: [String]
}

public struct KmRange: Codable, Hashable, Sendable {
    public var fromKm: Double
    public var toKm: Double
}

public struct WeatherSample: Codable, Hashable, Sendable {
    public var atKm: Double
    public var eta: String
    public var cloud: Double
    public var lowCloud: Double
    public var precipProb: Double
    public var precipMm: Double
    public var visibilityKm: Double?
    public var fog: Bool
}

public struct Conditions: Codable, Hashable, Sendable {
    public var departure: String
    public var arrival: String
    public var sunrise: String?
    public var sunset: String?
    public var arrivesAfterDark: Bool
    public var goldenHour: KmRange?
    public var glare: [KmRange]
    public var weather: [WeatherSample]
    public var verdict: String
    public var notes: [String]
}

public struct Advisory: Codable, Hashable, Sendable {
    public var kind: String
    public var severity: String
    public var title: String
    public var detail: String
    public var atKm: Double?
}

public struct Handoff: Codable, Hashable, Sendable {
    public var googleMaps: String
    public var appleMaps: String
}

public struct RouteOption: Codable, Hashable, Sendable, Identifiable {
    public var id: String
    public var rank: Int
    public var label: String
    public var source: String
    public var score: Double
    public var parts: ScoreParts
    public var summary: String
    public var km: Double
    public var minutes: Double
    public var extraMinutes: Double
    public var polyline: String
    public var bbox: [Double]
    public var highlights: [Highlight]
    public var scenicStops: [ScenicStop]
    public var bestStretch: KmRange?
    public var conditions: Conditions?
    public var advisories: [Advisory]
    public var handoff: Handoff

    public var line: [Coordinate] { Polyline.decode(polyline) }
}

public struct PlanResponse: Codable, Sendable {
    public struct Fastest: Codable, Sendable { public var km: Double; public var minutes: Double }
    public var planId: String
    public var modelVersion: String
    public var fastest: Fastest
    public var budgetMinutes: Double?
    public var routes: [RouteOption]
    public var warnings: [String]
    public var attribution: [String]
}

public struct TripDay: Codable, Hashable, Sendable {
    public var date: String?
    public var origin: Place
    public var destination: Place
    public var stops: [Place]
    public var extraMinutes: Int
    public var route: RouteOption?
    public init(date: String? = nil, origin: Place, destination: Place, stops: [Place] = [], extraMinutes: Int = 45, route: RouteOption? = nil) {
        self.date = date; self.origin = origin; self.destination = destination; self.stops = stops; self.extraMinutes = extraMinutes; self.route = route
    }
}

public struct Trip: Codable, Hashable, Sendable, Identifiable {
    public var id: UUID
    public var name: String
    public var notes: String
    public var days: [TripDay]
    public var createdAt: String
    public var updatedAt: String
    public var deleted: Bool

    public init(id: UUID = UUID(), name: String, notes: String = "", days: [TripDay], now: Date = Date()) {
        let iso = ISO8601DateFormatter().string(from: now)
        self.id = id; self.name = name; self.notes = notes; self.days = days
        self.createdAt = iso; self.updatedAt = iso; self.deleted = false
    }

    public var updatedDate: Date { ISO8601.parse(updatedAt) ?? .distantPast }
}

public struct Rating: Codable, Hashable, Sendable, Identifiable {
    public var id: UUID
    public var tripId: UUID?
    public var planId: String?
    public var routeId: String?
    public var thumbs: String
    public var comment: String?
    public var modelVersion: String
    public var score: Double
    public var parts: ScoreParts
    public var polyline: String
    public var drivenAt: String?
    public var createdAt: String

    public init(route: RouteOption, planId: String, modelVersion: String, up: Bool, comment: String? = nil, tripId: UUID? = nil, now: Date = Date()) {
        id = UUID(); self.tripId = tripId; self.planId = planId; routeId = route.id
        thumbs = up ? "up" : "down"; self.comment = comment; self.modelVersion = modelVersion
        score = route.score; parts = route.parts; polyline = route.polyline
        drivenAt = nil; createdAt = ISO8601DateFormatter().string(from: now)
    }
}

public struct SyncChanges: Codable, Sendable {
    public var trips: [Trip]
    public var ratings: [Rating]
    public init(trips: [Trip] = [], ratings: [Rating] = []) { self.trips = trips; self.ratings = ratings }
}

public struct SyncRequest: Codable, Sendable {
    public var cursor: Int?
    public var changes: SyncChanges
}

public struct SyncResponse: Codable, Sendable {
    public var cursor: Int
    public var changes: SyncChanges
    public var rejected: [String]
}

public enum ISO8601 {
    public static func parse(_ s: String) -> Date? {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let d = f.date(from: s) { return d }
        f.formatOptions = [.withInternetDateTime]
        return f.date(from: s)
    }
}
