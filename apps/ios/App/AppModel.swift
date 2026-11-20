import Foundation
import Observation
import ScenicKit

@MainActor
@Observable
final class AppModel {
    // Planning input
    var origin: Place?            // nil = current location
    var destination: Place?
    var style: RouteStyle = .scenic
    var interests: Set<Interest> = []
    var vehicle: Vehicle = .car
    /// Optional cap on extra minutes; nil lets the style decide.
    var timeLimit: Int?
    var departAt = Date()
    var prefs = Preferences()
    /// Go somewhere specific, or explore what's around.
    var mode: PlanMode = .go
    /// Explore: how long a drive (one way, or the whole loop).
    var exploreMinutes = 120
    var roundTrip = false
    /// A round trip goes out to this place and back to the start.
    var loopVia: Place?
    /// Stops the driver added from "Worth a stop", with where they sit along the route (0–1), for this trip only.
    var addedStops: [(place: Place, at: Double)] = []
    private var addedStopsTrip: String?

    // Explore output
    var explore: ExploreResponse?
    var isExploring = false

    // Planning output
    var plan: PlanResponse?
    var isPlanning = false
    var errorMessage: String?
    var selectedRouteID: String?
    /// The Plan tab's navigation stack. One path, destinations declared at the root:
    /// value links inside a view pushed with isPresented did not reliably push on iOS 26.
    var planPath: [PlanScreen] = []

    // Photos of places, by "lat,lon"
    var photoCache: [String: [Photo]] = [:]

    // Tabs, drive mode and the logbook
    var tab: AppTab = .plan
    /// The route being driven (Drive mode is on screen while this is set).
    var driving: RouteOption?
    /// A finished drive waiting for its rating (the Drive logged screen).
    var justLogged: LoggedDrive?
    var logbook: [LoggedDrive] = []
    let logbookStore = LogbookStore()

    // Trips
    var trips: [Trip] = []
    var syncStatus: String?

    let api: APIClient
    let store: TripStore
    let location = LocationProvider()

    init() {
        // Settings → Panoramica → Server overrides the built-in address (testing: the tunnel link can change).
        let override = UserDefaults.standard.string(forKey: "apiBaseURL")?.trimmingCharacters(in: .whitespacesAndNewlines)
        let builtIn = Bundle.main.object(forInfoDictionaryKey: "ScenicAPIBaseURL") as? String ?? "http://localhost:8787"
        let base = override.flatMap { URL(string: $0)?.scheme?.hasPrefix("http") == true ? $0 : nil } ?? builtIn
        api = APIClient(baseURL: URL(string: base) ?? URL(string: builtIn)!, tokens: KeychainTokenStore())
        store = TripStore(fileURL: TripStore.defaultURL())
        if ProcessInfo.processInfo.arguments.contains("-uiTestPlaces") {
            origin = Place(lat: 43.3188, lon: 11.3308, label: "Siena")
            destination = Place(lat: 43.0766, lon: 11.6787, label: "Pienza")
        }
    }

    func start() async {
        logbook = await logbookStore.all
        // Screenshots only: sample stamps in memory, never written to the phone's logbook.
        if ProcessInfo.processInfo.arguments.contains("-demoLogbook") { logbook = LoggedDrive.demo }
        trips = await store.trips
        await sync()
    }

    var selectedRoute: RouteOption? {
        plan?.routes.first { $0.id == selectedRouteID } ?? plan?.routes.first
    }

    var canPlan: Bool { destination != nil && !isPlanning }
    var canExplore: Bool { !isExploring && !isPlanning }

    /// What the results screen is about: "Pienza", or "Loop via Pienza".
    var tripTitle: String {
        if let loopVia { return "Loop via \(loopVia.label?.components(separatedBy: ",").first ?? "")" }
        return destination?.label?.components(separatedBy: ",").first ?? "Routes"
    }

    private func startPlace() async throws -> Place {
        if let origin { return origin }
        let here = try await location.current()
        return Place(lat: here.lat, lon: here.lon, label: "Current location")
    }

    func runExplore() async {
        isExploring = true
        errorMessage = nil
        defer { isExploring = false }
        do {
            let start = try await startPlace()
            let req = ExploreRequest(origin: start, maxMinutes: exploreMinutes, mode: roundTrip ? .roundTrip : .oneWay, interests: Interest.allCases.filter(interests.contains), vehicle: vehicle, departAt: departAt, prefs: prefs)
            explore = try await api.explore(req)
            if explore?.destinations.isEmpty != false { errorMessage = "No scenic places found within that time. Try a longer drive." }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// Plan the scenic routes to a place picked in Explore (or a loop through it).
    func plan(to place: ExploreDestination) async {
        let start = explore?.origin ?? origin
        if roundTrip, let start {
            destination = start
            loopVia = place.place
        } else {
            destination = place.place
            loopVia = nil
        }
        await runPlan()
    }

    func runPlan() async {
        guard let destination else { return }
        isPlanning = true
        errorMessage = nil
        defer { isPlanning = false }
        do {
            let start = try await startPlace()
            // Added stops belong to one trip: a new start, destination or loop clears them.
            resetAddedStopsIfTripChanged()
            let added = addedStops.sorted { $0.at < $1.at }
            // In a loop, stops in the first half come before the turnaround place, the rest after it.
            let stops = loopVia.map { via in added.filter { $0.at < 0.5 }.map(\.place) + [via] + added.filter { $0.at >= 0.5 }.map(\.place) } ?? added.map(\.place)
            let req = PlanRequest(origin: start, destination: loopVia == nil ? destination : start, stops: stops, style: style, interests: Interest.allCases.filter(interests.contains), vehicle: vehicle, extraMinutes: timeLimit, departAt: departAt, prefs: prefs)
            let res = try await api.plan(req)
            plan = res
            selectedRouteID = res.routes.first?.id
            if res.routes.isEmpty { errorMessage = "No route fits that time limit. Try a longer limit or no limit." }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// "Leave at 15:40": plan again with that departure and show the new routes.
    func leave(at date: Date) async {
        departAt = date
        await runPlan()
        if plan?.routes.isEmpty == false { planPath = [.results] }
    }

    private func resetAddedStopsIfTripChanged() {
        let trip = [origin?.id ?? "here", destination?.id ?? "", loopVia?.id ?? ""].joined(separator: "|")
        if trip != addedStopsTrip { addedStops = []; addedStopsTrip = trip }
    }

    /// Put a suggested stop on the route and plan again through it.
    func addStop(_ stop: SuggestedStop, on route: RouteOption) async {
        resetAddedStopsIfTripChanged()
        guard !addedStops.contains(where: { $0.place.id == stop.place.id }) else { return }
        addedStops.append((stop.place, route.km > 0 ? stop.atKm / route.km : 0.5))
        await runPlan()
        if plan?.routes.isEmpty == false { planPath = [.results] }
    }

    func photos(lat: Double, lon: Double, name: String?) async -> [Photo] {
        let key = String(format: "%.3f,%.3f", lat, lon)
        if let hit = photoCache[key] { return hit }
        let got = (try? await api.photos(lat: lat, lon: lon, name: name)) ?? []
        photoCache[key] = got
        return got
    }

    func search(_ q: String) async -> [Place] {
        (try? await api.geocode(q, near: origin?.coordinate ?? location.last)) ?? []
    }

    func save(route: RouteOption) async {
        guard let destination else { return }
        let start = origin ?? Place(lat: route.line.first?.lat ?? 0, lon: route.line.first?.lon ?? 0, label: "Start")
        let name = loopVia.map { "\(start.label ?? "Start") loop via \($0.label ?? "")" } ?? "\(start.label ?? "Start") → \(destination.label ?? "Destination")"
        let trip = Trip(name: name, days: [TripDay(origin: start, destination: destination, stops: loopVia.map { [$0] } ?? [], extraMinutes: Int(route.extraMinutes.rounded()), route: route)])
        await store.save(trip)
        trips = await store.trips
        await sync()
    }

    func delete(_ trip: Trip) async {
        await store.delete(trip.id)
        trips = await store.trips
        await sync()
    }

    func rate(route: RouteOption, up: Bool) async {
        guard let plan else { return }
        await store.addRating(Rating(route: route, planId: plan.planId, modelVersion: plan.modelVersion, up: up))
        await sync()
    }

    func sync() async {
        do {
            let changed = try await store.sync(using: api)
            trips = await store.trips
            syncStatus = changed > 0 ? "Updated \(changed) trip\(changed == 1 ? "" : "s")" : nil
        } catch APIError.offline {
            syncStatus = "Offline. Changes will sync later."
        } catch {
            syncStatus = nil
        }
    }
}

enum AppTab: Hashable { case plan, explore, logbook, you }

enum PlanMode: String, CaseIterable, Identifiable {
    case go, explore
    var id: String { rawValue }
    var title: String { self == .go ? "Go somewhere" : "Explore nearby" }
}

enum PlanScreen: Hashable {
    case explore
    case results
    case route(RouteOption)
}
