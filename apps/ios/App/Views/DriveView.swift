import SwiftUI
import MapKit
import AVFoundation
import CoreLocation
import ScenicKit

/// Follows the driver along the chosen route: progress, the next turn, the next scenic place, spoken prompts.
@MainActor
@Observable
final class DriveTracker: NSObject, CLLocationManagerDelegate {
    let route: RouteOption
    let line: [Coordinate]
    /// Cumulative km at each vertex of the line.
    private let cum: [Double]
    let started = Date()

    private(set) var progressKm: Double = 0
    private(set) var drivenKm: Double = 0
    private(set) var here: Coordinate?
    /// Steps already announced at "soon" (≤ 400 m) and "now" (≤ 80 m).
    private var spokenSoon = Set<Int>()
    private var spokenNow = Set<Int>()
    var voiceOn = UserDefaults.standard.object(forKey: "driveVoice") as? Bool ?? true

    private let manager = CLLocationManager()
    private let voice = AVSpeechSynthesizer()

    init(route: RouteOption) {
        self.route = route
        let pts = route.line
        line = pts
        var c: [Double] = [0]
        for i in 1..<max(pts.count, 1) { c.append(c[i - 1] + Self.km(pts[i - 1], pts[i])) }
        // Scale to the router's km so steps and highlights (measured by the router) line up.
        let total = c.last ?? 0
        cum = total > 0 ? c.map { $0 * route.km / total } : c
        super.init()
        manager.delegate = self
        manager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
        manager.activityType = .automotiveNavigation
        manager.distanceFilter = 8
    }

    func start() {
        if manager.authorizationStatus == .notDetermined { manager.requestWhenInUseAuthorization() }
        manager.startUpdatingLocation()
        UIApplication.shared.isIdleTimerDisabled = true
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .voicePrompt, options: [.duckOthers, .interruptSpokenAudioAndMixWithOthers])
        if let s = steps.first { say(s.text) }
    }

    func stop() {
        manager.stopUpdatingLocation()
        voice.stopSpeaking(at: .immediate)
        UIApplication.shared.isIdleTimerDisabled = false
        try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    }

    var steps: [RouteStep] { route.steps ?? [] }
    /// The next manoeuvre ahead (a step at the current km counts until we pass it by 30 m).
    var nextStepIndex: Int? { steps.firstIndex { $0.atKm > progressKm + 0.03 } ?? (steps.isEmpty ? nil : steps.count - 1) }
    var nextStep: RouteStep? { nextStepIndex.map { steps[$0] } }
    var metresToNext: Double { max(0, ((nextStep?.atKm ?? route.km) - progressKm) * 1000) }
    var kmToGo: Double { max(0, route.km - progressKm) }
    var arrival: Date { Date().addingTimeInterval(route.minutes * 60 * (route.km > 0 ? kmToGo / route.km : 0)) }

    var nextMoment: ScenicMoment? { route.moments.first { $0.km > progressKm + 0.2 } }
    /// Views ahead on the best stretch, when we are on it.
    var openViewsKm: Double? {
        guard let b = route.bestStretch, progressKm >= b.fromKm - 0.5, progressKm < b.toKm else { return nil }
        return b.toKm - max(progressKm, b.fromKm)
    }
    var viewpointsPassed: Int { route.moments.filter { $0.km <= progressKm + 0.3 }.count }

    nonisolated func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let l = locations.last, l.horizontalAccuracy >= 0, l.horizontalAccuracy < 80 else { return }
        let c = Coordinate(lat: l.coordinate.latitude, lon: l.coordinate.longitude)
        Task { @MainActor in self.update(c) }
    }

    private func update(_ c: Coordinate) {
        if let p = here { drivenKm += Self.km(p, c) }
        here = c
        progressKm = project(c)
        guard voiceOn, let i = nextStepIndex else { return }
        let s = steps[i], m = metresToNext
        if m <= 80, !spokenNow.contains(i) {
            spokenNow.insert(i); spokenSoon.insert(i)
            say(s.text)
        } else if m <= 400, m > 120, !spokenSoon.contains(i) {
            spokenSoon.insert(i)
            say("In \(Int((m / 50).rounded()) * 50) metres, \(s.text.prefix(1).lowercased() + s.text.dropFirst())")
        }
    }

    /// Km along the route of the nearest point, searched only a little behind and ahead so loops don't jump.
    private func project(_ p: Coordinate) -> Double {
        guard line.count > 1 else { return 0 }
        let near = cum.firstIndex { $0 >= progressKm - 1 } ?? 0
        var best = (d: Double.infinity, km: progressKm)
        for i in max(0, near - 1)..<(line.count - 1) where cum[i] <= progressKm + 8 {
            let a = line[i], b = line[i + 1]
            let kx = cos(a.lat * .pi / 180)
            let ax = a.lon * kx, ay = a.lat, bx = b.lon * kx, by = b.lat, px = p.lon * kx, py = p.lat
            let dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy
            let t = len2 > 0 ? min(1, max(0, ((px - ax) * dx + (py - ay) * dy) / len2)) : 0
            let qx = ax + t * dx - px, qy = ay + t * dy - py
            let d = (qx * qx + qy * qy).squareRoot() * 111
            if d < best.d { best = (d, cum[i] + t * (cum[i + 1] - cum[i])) }
        }
        // Off the route by more than 300 m: keep the last progress rather than snapping somewhere odd.
        return best.d < 0.3 ? best.km : progressKm
    }

    private func say(_ text: String) {
        guard voiceOn, !text.isEmpty else { return }
        let u = AVSpeechUtterance(string: text)
        u.voice = AVSpeechSynthesisVoice(language: "en-GB")
        voice.speak(u)
    }

    private static func km(_ a: Coordinate, _ b: Coordinate) -> Double {
        let r = 6371.0, dLat = (b.lat - a.lat) * .pi / 180, dLon = (b.lon - a.lon) * .pi / 180
        let h = sin(dLat / 2) * sin(dLat / 2) + cos(a.lat * .pi / 180) * cos(b.lat * .pi / 180) * sin(dLon / 2) * sin(dLon / 2)
        return 2 * r * asin(min(1, h.squareRoot()))
    }
}

enum StepIcon {
    static func symbol(_ sign: Int) -> String {
        switch sign {
        case -3, -2: "arrow.turn.up.left"
        case -1, -7: "arrow.up.left"
        case 1, 7: "arrow.up.right"
        case 2, 3: "arrow.turn.up.right"
        case 4: "flag.checkered"
        case 5: "mappin"
        case 6: "arrow.triangle.turn.up.right.circle"
        case -98, -8, 8: "arrow.uturn.down"
        default: "arrow.up"
        }
    }
}

/// 05 Drive mode: the next turn on top, the map, the next view and the essentials at the bottom.
struct DriveView: View {
    @Environment(AppModel.self) private var model
    @State private var tracker: DriveTracker
    @State private var camera: MapCameraPosition = .userLocation(followsHeading: true, fallback: .automatic)
    @State private var confirmEnd = false

    init(route: RouteOption) { _tracker = State(initialValue: DriveTracker(route: route)) }

    private var route: RouteOption { tracker.route }

    var body: some View {
        ZStack {
            map.ignoresSafeArea()
            VStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 12) {
                    maneuverCard
                    if let t = sunsetIn { sunsetChip(t) }
                }
                .padding(.horizontal, 12)
                Spacer()
                bottomCard.padding(.horizontal, 12).padding(.bottom, 8)
            }
        }
        .onAppear {
            tracker.start()
            if let r = MapRegion.fit(route.line) { camera = .userLocation(followsHeading: true, fallback: .region(r)) }
        }
        .onDisappear { tracker.stop() }
        .confirmationDialog("End this drive?", isPresented: $confirmEnd, titleVisibility: .visible) {
            Button("End and log it") { model.finishDrive(tracker) }
            Button("Discard drive", role: .destructive) { model.cancelDrive() }
        }
    }

    private var map: some View {
        Map(position: $camera) {
            MapPolyline(coordinates: route.line.map(\.cl)).stroke(Theme.green, style: StrokeStyle(lineWidth: 9, lineCap: .round, lineJoin: .round))
            ForEach(Array(route.moments.prefix(6).enumerated()), id: \.element.id) { i, m in
                Annotation(m.name, coordinate: m.coordinate.cl) {
                    Text("\(i + 1)").font(Theme.sofia(12, .semibold)).foregroundStyle(Theme.green)
                        .frame(width: 24, height: 24).background(.white, in: Circle())
                        .overlay(Circle().strokeBorder(Theme.green, lineWidth: 2))
                }
            }
            if let last = route.line.last {
                Annotation("", coordinate: last.cl) {
                    Circle().fill(Theme.green).frame(width: 22, height: 22).overlay(Circle().fill(.white).frame(width: 8, height: 8))
                }
            }
            UserAnnotation()
        }
        .mapStyle(.standard(elevation: .realistic, emphasis: .muted, pointsOfInterest: .excludingAll))
        .mapControls { MapCompass() }
    }

    private var maneuverCard: some View {
        HStack(spacing: 16) {
            Image(systemName: StepIcon.symbol(tracker.nextStep?.sign ?? 0))
                .font(.system(size: 26, weight: .semibold)).foregroundStyle(.white)
                .frame(width: 56, height: 56).background(Theme.green, in: RoundedRectangle(cornerRadius: 14))
            VStack(alignment: .leading, spacing: 2) {
                Text(distanceText(tracker.metresToNext)).font(Theme.sofia(28, .medium)).foregroundStyle(Theme.ink).monospacedDigit()
                Text(tracker.nextStep?.text ?? "Follow the route").font(Theme.sofia(16)).foregroundStyle(Theme.ink).lineLimit(1)
                if let sub = subLine { Text(sub).font(Theme.sofia(13)).foregroundStyle(Theme.ink2).lineLimit(1) }
            }
            Spacer(minLength: 0)
            Button { tracker.voiceOn.toggle() } label: {
                Image(systemName: tracker.voiceOn ? "speaker.wave.2.fill" : "speaker.slash.fill")
                    .font(.system(size: 15, weight: .semibold)).foregroundStyle(Theme.ink2).frame(width: 36, height: 36)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(tracker.voiceOn ? "Mute voice" : "Unmute voice")
        }
        .padding(16)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 20))
        .shadow(color: Theme.ink.opacity(0.12), radius: 14, y: 4)
        .accessibilityElement(children: .combine)
    }

    private var subLine: String? {
        if let k = tracker.openViewsKm, k >= 1 { return "Open views for \(Int(k.rounded())) km" }
        if let m = tracker.nextMoment { return "Then \(m.name)" }
        return nil
    }

    private func sunsetChip(_ text: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: "sunset.fill").font(.system(size: 12, weight: .semibold)).foregroundStyle(Theme.terracotta)
            Text(text).font(Theme.sofia(13, .medium)).foregroundStyle(Theme.ink)
        }
            .padding(.horizontal, 12).frame(height: 30)
            .background(Theme.surface, in: Capsule())
            .shadow(color: Theme.ink.opacity(0.1), radius: 6, y: 2)
    }

    private var sunsetIn: String? {
        guard let iso = route.conditions?.sunset, let d = ISO8601.parse(iso) else { return nil }
        let mins = Int(d.timeIntervalSinceNow / 60)
        guard mins > 0, mins < 180 else { return nil }
        return mins >= 60 ? "Sunset in \(mins / 60) h \(String(format: "%02d", mins % 60))" : "Sunset in \(mins) min"
    }

    private var bottomCard: some View {
        VStack(spacing: 14) {
            if let m = tracker.nextMoment {
                HStack(spacing: 10) {
                    Image(systemName: PlaceIcon.symbol(m.type)).font(.system(size: 14, weight: .semibold)).foregroundStyle(Theme.green)
                    Text("\(kindName(m.type)) in \(Int(max(1, (m.km - tracker.progressKm).rounded()))) km: \(m.name)")
                        .font(Theme.sofia(14, .medium)).foregroundStyle(Theme.greenDark).lineLimit(1)
                    Spacer(minLength: 0)
                }
                .padding(.horizontal, 14).frame(height: 40)
                .background(Theme.greenTint, in: RoundedRectangle(cornerRadius: 12))
            }
            HStack(alignment: .bottom, spacing: 22) {
                stat(tracker.arrival.formatted(date: .omitted, time: .shortened), "arrival", Theme.ink)
                stat("\(Int(tracker.kmToGo.rounded())) km", "to go", Theme.ink)
                stat("\(Int(route.score.rounded()))", "scenic", Theme.green)
                Spacer(minLength: 0)
                Button { confirmEnd = true } label: {
                    Text("End").font(Theme.sofia(16, .medium)).foregroundStyle(Theme.ink)
                        .frame(width: 64, height: 48)
                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(Theme.border))
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("driveEnd")
            }
        }
        .padding(16)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 22))
        .shadow(color: Theme.ink.opacity(0.12), radius: 14, y: 4)
    }

    private func stat(_ value: String, _ label: String, _ tint: Color) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(value).font(Theme.sofia(24, .medium)).foregroundStyle(tint).monospacedDigit()
            Text(label).font(Theme.sofia(12)).foregroundStyle(Theme.ink2)
        }
        .accessibilityElement(children: .combine)
    }

    private func kindName(_ type: String) -> String {
        switch type {
        case "viewpoint": "Viewpoint"
        case "hilltop_village", "village": "Village"
        case "castle": "Castle"
        case "lake": "Lake"
        case "peak", "mountain_pass": "Pass"
        default: "Next"
        }
    }

    private func distanceText(_ m: Double) -> String {
        if m >= 1000 { return String(format: m >= 10_000 ? "%.0f km" : "%.1f km", m / 1000) }
        return "\(max(10, Int((m / 10).rounded()) * 10)) m"
    }
}

extension Coordinate {
    var cl: CLLocationCoordinate2D { CLLocationCoordinate2D(latitude: lat, longitude: lon) }
}

enum MapRegion {
    static func fit(_ line: [Coordinate]) -> MKCoordinateRegion? {
        guard let first = line.first else { return nil }
        var minLat = first.lat, maxLat = first.lat, minLon = first.lon, maxLon = first.lon
        for c in line { minLat = min(minLat, c.lat); maxLat = max(maxLat, c.lat); minLon = min(minLon, c.lon); maxLon = max(maxLon, c.lon) }
        return MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: (minLat + maxLat) / 2, longitude: (minLon + maxLon) / 2),
                                  span: MKCoordinateSpan(latitudeDelta: (maxLat - minLat) * 1.3 + 0.01, longitudeDelta: (maxLon - minLon) * 1.3 + 0.01))
    }
}
