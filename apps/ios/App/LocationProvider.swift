import CoreLocation
import ScenicKit

/// One-shot current location for "start from here".
@MainActor
final class LocationProvider: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    private var waiting: [CheckedContinuation<Coordinate, Error>] = []
    private(set) var last: Coordinate?

    enum LocationError: LocalizedError {
        case denied
        var errorDescription: String? { "Location is off. Choose a start place instead." }
    }

    override init() {
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    }

    func current() async throws -> Coordinate {
        switch manager.authorizationStatus {
        case .denied, .restricted: throw LocationError.denied
        case .notDetermined: manager.requestWhenInUseAuthorization()
        default: break
        }
        return try await withCheckedThrowingContinuation { c in
            waiting.append(c)
            manager.requestLocation()
        }
    }

    private func finish(_ result: Result<Coordinate, Error>) {
        let w = waiting
        waiting = []
        for c in w { c.resume(with: result) }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let l = locations.last else { return }
        let c = Coordinate(lat: l.coordinate.latitude, lon: l.coordinate.longitude)
        Task { @MainActor in
            self.last = c
            self.finish(.success(c))
        }
    }

    nonisolated func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        Task { @MainActor in self.finish(.failure(error)) }
    }

    nonisolated func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        let status = manager.authorizationStatus
        Task { @MainActor in
            if status == .denied || status == .restricted { self.finish(.failure(LocationError.denied)) }
        }
    }
}
