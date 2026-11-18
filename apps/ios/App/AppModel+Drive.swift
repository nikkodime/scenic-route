import Foundation
import CoreLocation
import ScenicKit

extension AppModel {
    func startDrive(_ route: RouteOption) {
        justLogged = nil
        driving = route
    }

    /// Ends Drive mode and opens the Drive logged screen with what was actually driven.
    func finishDrive(_ t: DriveTracker) {
        let route = t.route
        let moved = max(t.drivenKm, t.progressKm)
        // A drive ended before really moving (a test at home) keeps the planned figures.
        let real = moved >= 0.5
        let minutes = real ? Date().timeIntervalSince(t.started) / 60 : route.minutes
        let km = real ? moved : route.km
        let from = origin?.label.map { short($0) }
        let to = loopVia.map { short($0.label) } ?? short(destination?.label)
        let name = from.map { "\($0) to \(to)" } ?? route.label
        let place = route.heroCandidates.first?.name ?? to
        let end = (real ? t.here : nil) ?? route.line.last ?? Coordinate(lat: 0, lon: 0)
        let drive = LoggedDrive(name: name, place: place, km: km, minutes: minutes,
                                extraMinutes: route.extraMinutes, viewpoints: real ? t.viewpointsPassed : route.moments.count,
                                score: Int(route.score.rounded()), rating: 0, country: nil,
                                lat: end.lat, lon: end.lon, polyline: route.polyline)
        driving = nil
        justLogged = drive
        let id = drive.id
        Task {
            if let c = try? await CLGeocoder().reverseGeocodeLocation(CLLocation(latitude: end.lat, longitude: end.lon)).first?.isoCountryCode,
               justLogged?.id == id {
                justLogged?.country = c
            }
        }
    }

    func cancelDrive() {
        driving = nil
        justLogged = nil
    }

    func addToLogbook(_ d: LoggedDrive) async {
        await logbookStore.add(d)
        logbook = await logbookStore.all
        justLogged = nil
        tab = .logbook
    }

    func deleteFromLogbook(_ d: LoggedDrive) async {
        await logbookStore.delete(d.id)
        logbook = await logbookStore.all
    }

    /// True when this score beats every drive logged this calendar month.
    func isBestThisMonth(_ score: Int) -> Bool {
        let cal = Calendar.current
        return !logbook.contains { cal.isDate($0.date, equalTo: Date(), toGranularity: .month) && $0.score >= score }
    }

    private func short(_ label: String?) -> String {
        label?.components(separatedBy: ",").first?.trimmingCharacters(in: .whitespaces) ?? ""
    }
}

extension LoggedDrive {
    /// Sample drives for design screenshots (launch argument -demoLogbook).
    static var demo: [LoggedDrive] {
        let d = { (s: String) in ISO8601.parse(s + "T12:00:00Z") ?? Date() }
        return [
            LoggedDrive(name: "Crete Senesi and the abbey", place: "Val d'Orcia", date: d("2026-11-17"), km: 68, minutes: 91, extraMinutes: 45, viewpoints: 3, score: 92, rating: 5, country: "IT", lat: 43.17, lon: 11.55, polyline: ""),
            LoggedDrive(name: "Passo Giau and Falzarego", place: "Passo Giau", date: d("2026-10-02"), km: 112, minutes: 150, extraMinutes: 50, viewpoints: 5, score: 95, rating: 5, country: "IT", lat: 46.48, lon: 12.05, polyline: ""),
            LoggedDrive(name: "Amalfi coast road", place: "Amalfi", date: d("2026-09-21"), km: 54, minutes: 110, extraMinutes: 30, viewpoints: 6, score: 89, rating: 4, country: "IT", lat: 40.63, lon: 14.6, polyline: ""),
            LoggedDrive(name: "Moselle vineyards", place: "Moselle", date: d("2026-08-21"), km: 96, minutes: 120, extraMinutes: 25, viewpoints: 2, score: 84, rating: 4, country: "DE", lat: 49.91, lon: 7.07, polyline: ""),
            LoggedDrive(name: "Eagle road to Geiranger", place: "Geiranger", date: d("2026-07-26"), km: 88, minutes: 140, extraMinutes: 40, viewpoints: 4, score: 97, rating: 5, country: "NO", lat: 62.1, lon: 7.2, polyline: ""),
            LoggedDrive(name: "Glen Coe", place: "Glen Coe", date: d("2026-06-14"), km: 120, minutes: 130, extraMinutes: 20, viewpoints: 3, score: 88, rating: 4, country: "GB", lat: 56.68, lon: -5.1, polyline: ""),
        ]
    }
}
