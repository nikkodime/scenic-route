import SwiftUI
import UIKit
import WebKit
import ScenicKit

/// The floating low-poly islands, rendered live in 3D with no background, so they sit on the paper at any size.
/// The engine (packages/islands) runs in a transparent WKWebView; a still of the same island shows until the first
/// frame is ready. With Reduce Motion on, the island stands still (it can still be turned by dragging).
struct IslandView: View {
    var region: IslandRegion = .tuscany
    /// 1 = the island spans the narrower side of the frame; smaller leaves more air around it.
    var fit: Double = 0.95
    /// Moves the island up (+) or down (-), as a fraction of the frame's height.
    var lift: Double = 0
    /// Clouds and distant islands drifting around it.
    var air = true
    /// Drag to turn it. Off where the island sits inside a scroll view, so scrolling keeps working.
    var interactive = true
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var ready = false

    var body: some View {
        ZStack {
            if !ready {
                GeometryReader { g in
                    IslandPoster(region: region).scaleEffect(fit / 0.86)
                        .frame(width: g.size.width, height: g.size.height)
                        .offset(y: -lift * g.size.height)
                }
                .transition(.opacity)
            }
            LiveIsland(region: region, fit: fit, lift: lift, air: air, interactive: interactive, motion: !reduceMotion) {
                withAnimation(.easeOut(duration: 0.35)) { ready = true }
            }
            .opacity(ready ? 1 : 0)
        }
        .accessibilityElement()
        .accessibilityLabel("\(region.title), a floating island")
        .accessibilityAddTraits(.isImage)
    }
}

/// A still of the island (transparent WebP rendered from the same engine): cards, grids, collections.
struct IslandPoster: View {
    var region: IslandRegion
    /// Faded and colourless: an island not collected yet.
    var locked = false
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        Group {
            if let img = IslandPoster.image(region) {
                Image(uiImage: img).resizable().interpolation(.high).scaledToFit()
            } else {
                Color.clear
            }
        }
        .saturation(locked ? 0 : 1)
        .contrast(locked ? 0.55 : 1)
        .brightness(locked ? (scheme == .dark ? 0 : 0.28) : 0)
        .opacity(locked ? (scheme == .dark ? 0.35 : 0.5) : 1)
        .accessibilityHidden(true)
    }

    @MainActor private static var cache: [IslandRegion: UIImage] = [:]
    @MainActor static func image(_ r: IslandRegion) -> UIImage? {
        if let i = cache[r] { return i }
        guard let url = Bundle.main.url(forResource: "poster-\(r.rawValue)", withExtension: "webp"),
              let data = try? Data(contentsOf: url), let img = UIImage(data: data) else { return nil }
        cache[r] = img
        return img
    }
}

private struct LiveIsland: UIViewRepresentable {
    let region: IslandRegion
    let fit: Double, lift: Double, air: Bool, interactive: Bool, motion: Bool
    let onReady: () -> Void

    func makeCoordinator() -> Coordinator { Coordinator(onReady: onReady) }

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.mediaTypesRequiringUserActionForPlayback = .all
        cfg.suppressesIncrementalRendering = true
        let opts = "window.ISLAND_OPTS={region:'\(region.rawValue)',fit:\(fit),lift:\(lift),air:\(air),interactive:\(interactive),motion:\(motion),phase:\(Double.random(in: 0..<1))};"
        cfg.userContentController.addUserScript(WKUserScript(source: opts, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        cfg.userContentController.add(WeakHandler(context.coordinator), name: "island")
        let web = WKWebView(frame: .zero, configuration: cfg)
        web.isOpaque = false
        web.backgroundColor = .clear
        web.scrollView.backgroundColor = .clear
        web.scrollView.isScrollEnabled = false
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.isUserInteractionEnabled = interactive
        web.allowsLinkPreview = false
        if #available(iOS 16.4, *) { web.isInspectable = false }
        context.coordinator.region = region
        context.coordinator.motion = motion
        if let html = Bundle.main.url(forResource: "island", withExtension: "html") {
            web.loadFileURL(html, allowingReadAccessTo: html.deletingLastPathComponent())
        }
        return web
    }

    func updateUIView(_ web: WKWebView, context: Context) {
        let c = context.coordinator
        if c.region != region { c.region = region; web.evaluateJavaScript("setRegion('\(region.rawValue)')") }
        if c.motion != motion { c.motion = motion; web.evaluateJavaScript("setMotion(\(motion))") }
    }

    static func dismantleUIView(_ web: WKWebView, coordinator: Coordinator) {
        web.configuration.userContentController.removeScriptMessageHandler(forName: "island")
        web.stopLoading()
    }

    final class Coordinator: NSObject, WKScriptMessageHandler {
        var region: IslandRegion?
        var motion = true
        let onReady: () -> Void
        init(onReady: @escaping () -> Void) { self.onReady = onReady }
        func userContentController(_ c: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.body as? String == "ready" { onReady() }
        }
    }

    /// WKUserContentController retains its handlers; this keeps the coordinator from leaking.
    private final class WeakHandler: NSObject, WKScriptMessageHandler {
        weak var target: WKScriptMessageHandler?
        init(_ t: WKScriptMessageHandler) { target = t }
        func userContentController(_ c: WKUserContentController, didReceive m: WKScriptMessage) { target?.userContentController(c, didReceive: m) }
    }
}

/// The eight island regions, one per landscape the app knows how to drive.
enum IslandRegion: String, CaseIterable, Identifiable, Hashable {
    case tuscany, dolomites, amalfi, sardinia, moselle, fjord, bardenas, highlands
    var id: String { rawValue }

    var title: String {
        switch self {
        case .tuscany: "Val d'Orcia, Tuscany"
        case .dolomites: "Passo Giau, Dolomites"
        case .amalfi: "Costiera Amalfitana"
        case .sardinia: "Costa Smeralda, Sardinia"
        case .moselle: "Moselle valley"
        case .fjord: "Geirangerfjord"
        case .bardenas: "Bardenas Reales"
        case .highlands: "Glen Coe, Highlands"
        }
    }

    /// One or two words, for cards and the collection.
    var short: String {
        switch self {
        case .tuscany: "Val d'Orcia"
        case .dolomites: "Dolomites"
        case .amalfi: "Amalfi"
        case .sardinia: "Sardinia"
        case .moselle: "Moselle"
        case .fjord: "Geiranger"
        case .bardenas: "Bardenas"
        case .highlands: "Glen Coe"
        }
    }

    var country: String {
        switch self {
        case .tuscany, .dolomites, .amalfi, .sardinia: "Italy"
        case .moselle: "Germany"
        case .fjord: "Norway"
        case .bardenas: "Spain"
        case .highlands: "Scotland"
        }
    }

    /// One line on why the roads there are worth it.
    var line: String {
        switch self {
        case .tuscany: "Cypress avenues, clay hills and hill towns in golden light"
        case .dolomites: "Pale peaks and alpine passes, 29 hairpins over Passo Giau"
        case .amalfi: "Cliff road over the sea, lemon terraces and pastel villages"
        case .sardinia: "Granite coves and turquoise water on the north-east coast"
        case .moselle: "Vineyard slopes and castles along a looping river"
        case .fjord: "Eagle Road and Trollstigen above the fjord"
        case .bardenas: "Badlands, mesas and empty desert tracks in Navarre"
        case .highlands: "Single-track roads through Glen Coe and the moors"
        }
    }

    /// The heart of the region, where "Plan a drive here" starts.
    var center: Coordinate {
        switch self {
        case .tuscany: Coordinate(lat: 43.07, lon: 11.62)
        case .dolomites: Coordinate(lat: 46.52, lon: 12.05)
        case .amalfi: Coordinate(lat: 40.63, lon: 14.60)
        case .sardinia: Coordinate(lat: 41.10, lon: 9.50)
        case .moselle: Coordinate(lat: 50.05, lon: 7.12)
        case .fjord: Coordinate(lat: 62.10, lon: 7.20)
        case .bardenas: Coordinate(lat: 42.20, lon: -1.50)
        case .highlands: Coordinate(lat: 56.68, lon: -5.10)
        }
    }

    /// How far out a drive still counts for this island, in km.
    var radiusKm: Double {
        switch self {
        case .tuscany: 130
        case .dolomites, .moselle, .highlands, .fjord: 120
        case .amalfi, .bardenas: 90
        case .sardinia: 160
        }
    }

    var place: Place { Place(lat: center.lat, lon: center.lon, label: title) }

    /// The island a place belongs to, if it is inside one of the regions.
    static func containing(lat: Double, lon: Double) -> IslandRegion? {
        allCases.map { ($0, $0.km(lat: lat, lon: lon)) }.filter { $0.1 <= $0.0.radiusKm }.min { $0.1 < $1.1 }?.0
    }

    /// The closest island to a place (for the planning screen and "you are here").
    static func nearest(lat: Double, lon: Double) -> IslandRegion {
        allCases.min { $0.km(lat: lat, lon: lon) < $1.km(lat: lat, lon: lon) } ?? .tuscany
    }

    func km(lat: Double, lon: Double) -> Double {
        let r = 6371.0, p1 = center.lat * .pi / 180, p2 = lat * .pi / 180
        let dp = p2 - p1, dl = (lon - center.lon) * .pi / 180
        let a = sin(dp / 2) * sin(dp / 2) + cos(p1) * cos(p2) * sin(dl / 2) * sin(dl / 2)
        return 2 * r * asin(min(1, sqrt(a)))
    }
}

extension AppModel {
    /// The islands brought home: one per region with at least one logged drive.
    var collectedIslands: Set<IslandRegion> {
        Set(logbook.compactMap { IslandRegion.containing(lat: $0.lat, lon: $0.lon) })
    }

    /// The island for where the driver is planning: the destination, else the start, else where they are.
    var planningIsland: IslandRegion {
        if let p = loopVia ?? destination ?? origin { return .nearest(lat: p.lat, lon: p.lon) }
        if let here = location.last { return .nearest(lat: here.lat, lon: here.lon) }
        return .tuscany
    }

    /// Explore every road around a region's heart.
    func exploreRegion(_ r: IslandRegion) async {
        origin = r.place
        mode = .explore
        roundTrip = false
        tab = .explore
        await runExplore()
    }
}

/// While roads are being found, the island of the area fills the screen and its car laps the road.
struct PlanningOverlay: View {
    @Environment(AppModel.self) private var model
    @State private var start = Date()

    var body: some View {
        let region = model.planningIsland
        ZStack {
            LinearGradient(colors: [Theme.sky, Theme.background], startPoint: .top, endPoint: UnitPoint(x: 0.5, y: 0.6))
                .ignoresSafeArea()
            VStack(spacing: 0) {
                IslandView(region: region, fit: 1.12, lift: 0.04, interactive: false)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                VStack(spacing: 10) {
                    Text("Finding beautiful roads").font(Theme.sofia(21, .semibold)).foregroundStyle(Theme.ink)
                    ProgressView().tint(Theme.green)
                    Text(region.title).font(Theme.sofia(14)).foregroundStyle(Theme.ink2)
                }
                .padding(.bottom, 64)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Finding beautiful roads")
    }
}
