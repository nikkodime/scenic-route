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

    // Planning output
    var plan: PlanResponse?
    var isPlanning = false
    var errorMessage: String?
    var selectedRouteID: String?
    /// The Plan tab's navigation stack. One path, destinations declared at the root:
    /// value links inside a view pushed with isPresented did not reliably push on iOS 26.
    var planPath: [PlanScreen] = []

    // Trips
    var trips: [Trip] = []
    var syncStatus: String?

    let api: APIClient
    let store: TripStore
    let location = LocationProvider()

    init() {
        let base = UserDefaults.standard.string(forKey: "apiBaseURL")
            ?? Bundle.main.object(forInfoDictionaryKey: "ScenicAPIBaseURL") as? String
            ?? "http://localhost:8787"
        api = APIClient(baseURL: URL(string: base)!, tokens: KeychainTokenStore())
        store = TripStore(fileURL: TripStore.defaultURL())
        if ProcessInfo.processInfo.arguments.contains("-uiTestPlaces") {
            origin = Place(lat: 43.3188, lon: 11.3308, label: "Siena")
            destination = Place(lat: 43.0766, lon: 11.6787, label: "Pienza")
        }
    }

    func start() async {
        trips = await store.trips
        await sync()
    }

    var selectedRoute: RouteOption? {
        plan?.routes.first { $0.id == selectedRouteID } ?? plan?.routes.first
    }

    var canPlan: Bool { destination != nil && !isPlanning }

    func runPlan() async {
        guard let destination else { return }
        isPlanning = true
        errorMessage = nil
        defer { isPlanning = false }
        do {
            let start: Place
            if let origin { start = origin } else {
                let here = try await location.current()
                start = Place(lat: here.lat, lon: here.lon, label: "Current location")
            }
            let req = PlanRequest(origin: start, destination: destination, style: style, interests: Interest.allCases.filter(interests.contains), vehicle: vehicle, extraMinutes: timeLimit, departAt: departAt, prefs: prefs)
            let res = try await api.plan(req)
            plan = res
            selectedRouteID = res.routes.first?.id
            if res.routes.isEmpty { errorMessage = "No route fits that time limit. Try a longer limit or no limit." }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    func search(_ q: String) async -> [Place] {
        (try? await api.geocode(q, near: origin?.coordinate ?? location.last)) ?? []
    }

    func save(route: RouteOption) async {
        guard let destination else { return }
        let start = origin ?? Place(lat: route.line.first?.lat ?? 0, lon: route.line.first?.lon ?? 0, label: "Start")
        let name = "\(start.label ?? "Start") → \(destination.label ?? "Destination")"
        let trip = Trip(name: name, days: [TripDay(origin: start, destination: destination, extraMinutes: Int(route.extraMinutes.rounded()), route: route)])
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

enum PlanScreen: Hashable {
    case results
    case route(RouteOption)
}
