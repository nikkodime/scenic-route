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
    /// Light along the drive (sunset, golden hour, cloud), 0–100; nil without a forecast.
    public var light: Double?
    public var motorwayPct: Double
    public var urbanPct: Double
}

/// One manoeuvre. `sign` follows GraphHopper: -3 sharp left … 0 straight … 3 sharp right, 4 arrive, 5 via, 6 roundabout, ±7 keep.
public struct RouteStep: Codable, Hashable, Sendable {
    public var atKm: Double
    public var text: String
    public var sign: Int
    public var street: String
    public var lat: Double
    public var lon: Double
}

/// A drive the driver finished and kept: one stamp in the logbook.
public struct LoggedDrive: Codable, Hashable, Sendable, Identifiable {
    public var id: UUID
    public var name: String
    /// Short place name for the stamp ("Val d'Orcia", "Montalcino").
    public var place: String
    public var date: Date
    public var km: Double
    public var minutes: Double
    public var extraMinutes: Double
    public var viewpoints: Int
    public var score: Int
    /// 1 (flat) … 5 (breathtaking).
    public var rating: Int
    public var country: String?
    public var lat: Double
    public var lon: Double
    public var polyline: String

    public init(id: UUID = UUID(), name: String, place: String, date: Date = Date(), km: Double, minutes: Double, extraMinutes: Double, viewpoints: Int, score: Int, rating: Int, country: String?, lat: Double, lon: Double, polyline: String) {
        self.id = id; self.name = name; self.place = place; self.date = date; self.km = km; self.minutes = minutes
        self.extraMinutes = extraMinutes; self.viewpoints = viewpoints; self.score = score; self.rating = rating
        self.country = country; self.lat = lat; self.lon = lon; self.polyline = polyline
    }
}

public struct Highlight: Codable, Hashable, Sendable {
    public var name: String
    public var type: String
    public var atKm: Double
    public var lat: Double?
    public var lon: Double?
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
    /// When to leave to drive the best stretch in golden light (nil when not reachable today or tomorrow).
    public var goldenDeparture: GoldenDeparture?
}

/// "Leave at 15:40 to reach Pienza in golden light."
public struct GoldenDeparture: Codable, Hashable, Sendable {
    public var leaveAt: String
    public var reachAt: String
    public var sunset: String
    public var fromKm: Double
    public var toKm: Double
    public var place: String?
    /// The planned departure already catches it.
    public var onTime: Bool
}

/// A place worth pulling over for along a route: a viewpoint, coffee, lunch, a winery.
public struct SuggestedStop: Codable, Hashable, Sendable, Identifiable {
    public var id: String
    public var lat: Double
    public var lon: Double
    /// viewpoint, cafe, agriturismo, winery
    public var kind: String
    public var name: String
    public var hours: String?
    public var website: String?
    public var food: Bool?
    public var atKm: Double
    public var eta: String
    public var offKm: Double
    /// view, coffee, lunch, wine
    public var reason: String
    public var coordinate: Coordinate { Coordinate(lat: lat, lon: lon) }
    public var place: Place { Place(lat: lat, lon: lon, label: name.isEmpty ? "Viewpoint" : name) }
}

public struct Advisory: Codable, Hashable, Sendable {
    public var kind: String
    public var severity: String
    public var title: String
    public var detail: String
    public var atKm: Double?
    /// Where on the map, when the advisory is about one place (a ZTL gate, a pass, where gravel starts).
    public var lat: Double?
    public var lon: Double?
}

public struct Handoff: Codable, Hashable, Sendable {
    public var googleMaps: String
    public var appleMaps: String
}

/// Where a route leaves the fastest road and comes back, and what that costs.
public struct Detour: Codable, Hashable, Sendable {
    public var fromKm: Double
    public var toKm: Double
    public var leave: Coordinate
    public var rejoin: Coordinate
    public var km: Double
    public var extraKm: Double
    public var extraMinutes: Double
    public var name: String?
}

/// A route against the fastest road.
public struct VsFastest: Codable, Hashable, Sendable {
    public var extraKm: Double
    public var extraMinutes: Double
    /// Share of the route on the fastest road, 0–100.
    public var sharedPct: Double
    public var detours: [Detour]
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
    /// About 48 elevation samples in metres along the drive.
    public var elevation: [Double]?
    /// Turn-by-turn steps for Drive mode.
    public var steps: [RouteStep]?
    public var vsFastest: VsFastest?
    /// Viewpoints, coffee, lunch and wine stops along the route.
    public var suggestedStops: [SuggestedStop]?

    public var line: [Coordinate] { Polyline.decode(polyline) }
}

public struct PlanResponse: Codable, Sendable {
    /// The fastest road: the baseline, drawn as a ghost line.
    public struct Fastest: Codable, Hashable, Sendable {
        public var km: Double
        public var minutes: Double
        public var polyline: String?
        public var line: [Coordinate] { polyline.map { Polyline.decode($0) } ?? [] }
    }
    public var planId: String
    public var modelVersion: String
    public var fastest: Fastest
    public var budgetMinutes: Double?
    public var routes: [RouteOption]
    public var warnings: [String]
    public var attribution: [String]
}

/// "Where can I go from here?"
public enum ExploreMode: String, Codable, CaseIterable, Sendable, Identifiable {
    case oneWay = "one_way", roundTrip = "round_trip"
    public var id: String { rawValue }
}

public struct ExploreRequest: Codable, Sendable {
    public var origin: Place
    public var maxMinutes: Int
    public var mode: ExploreMode
    public var interests: [Interest]
    public var vehicle: Vehicle
    public var departAt: String?
    public var prefs: Preferences
    public init(origin: Place, maxMinutes: Int, mode: ExploreMode, interests: [Interest] = [], vehicle: Vehicle = .car, departAt: Date? = nil, prefs: Preferences = .init()) {
        self.origin = origin; self.maxMinutes = maxMinutes; self.mode = mode; self.interests = interests
        self.vehicle = vehicle; self.prefs = prefs
        self.departAt = departAt.map { ISO8601DateFormatter().string(from: $0) }
    }
}

public struct ExploreDestination: Codable, Hashable, Sendable, Identifiable {
    public var name: String
    public var lat: Double
    public var lon: Double
    public var types: [String]
    public var families: [String]
    public var places: Int
    public var score: Double
    public var summary: String
    public var km: Double
    public var minutes: Double
    public var fastestMinutes: Double
    public var straightKm: Double
    public var highlights: [Highlight]
    public var polyline: String
    public var sunset: String?
    public var id: String { "\(lat),\(lon)" }
    public var place: Place { Place(lat: lat, lon: lon, label: name) }
    public var line: [Coordinate] { Polyline.decode(polyline) }
}

public struct ExploreResponse: Codable, Sendable {
    public var origin: Place
    public var mode: ExploreMode
    public var maxMinutes: Double
    public var destinations: [ExploreDestination]
    public var warnings: [String]
    public var attribution: [String]
}

/// An openly licensed photo of a place (Wikimedia Commons). Always show the credit.
public struct Photo: Codable, Hashable, Sendable, Identifiable {
    public var url: String
    public var width: Double
    public var height: Double
    public var title: String
    public var author: String
    public var license: String
    public var source: String
    public var id: String { url }
    public var credit: String { "\(author) · \(license)" }
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
