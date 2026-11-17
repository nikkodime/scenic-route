import SwiftUI
import ScenicKit

// Shared pieces for the photo-led Results and Route detail screens: icons instead of sentences,
// photos that say why a route is scenic, short chips for anything the driver must know.

/// SF Symbol for a scenic place type (feature types from the planner).
enum PlaceIcon {
    static func symbol(_ type: String) -> String {
        switch type {
        case "viewpoint": "binoculars.fill"
        case "peak", "mountain_pass": "mountain.2.fill"
        case "castle", "heritage", "attraction": "building.columns.fill"
        case "hilltop_village", "village": "house.fill"
        case "lake", "waterfall": "water.waves"
        case "coast", "beach": "beach.umbrella.fill"
        case "vineyard": "leaf.fill"
        case "cypress": "tree.fill"
        case "scenic_road": "road.lanes.curved.right"
        default: "sparkles"
        }
    }

    /// The Explore family a type belongs to, for photo placeholders.
    static func family(_ type: String) -> String {
        switch type {
        case "viewpoint": "views"
        case "peak", "mountain_pass": "mountains"
        case "lake", "waterfall", "coast", "beach": "water"
        case "vineyard", "cypress": "countryside"
        case "scenic_road": "roads"
        default: "heritage"
        }
    }

    /// Icon for one phrase of a route summary ("176 vineyards", "32 abbeys and old churches").
    static func symbol(forSummaryWord w: String) -> String {
        let s = w.lowercased()
        if s.contains("vineyard") { return "leaf.fill" }
        if s.contains("viewpoint") { return "binoculars.fill" }
        if s.contains("cypress") { return "tree.fill" }
        if s.contains("lake") || s.contains("waterfall") { return "water.waves" }
        if s.contains("coast") || s.contains("beach") { return "beach.umbrella.fill" }
        if s.contains("peak") || s.contains("hill") && !s.contains("town") || s.contains("pass") { return "mountain.2.fill" }
        if s.contains("town") || s.contains("village") { return "house.fill" }
        if s.contains("road") { return "road.lanes.curved.right" }
        return "building.columns.fill"
    }
}

/// A scenic place along a route, with a position (highlights only carry their km).
struct ScenicMoment: Identifiable, Hashable {
    let name: String
    let type: String
    let km: Double
    let coordinate: Coordinate
    var id: String { "\(name)@\(Int(km))" }
}

extension RouteOption {
    /// Named places worth a photo, in driving order. Viewpoints, hill towns and castles first when choosing a hero.
    var moments: [ScenicMoment] {
        let line = self.line
        var seen = Set<String>()
        return highlights.compactMap { h -> ScenicMoment? in
            guard !h.name.isEmpty, seen.insert(h.name).inserted, let c = Polyline.coordinate(on: line, atKm: h.atKm) else { return nil }
            return ScenicMoment(name: h.name, type: h.type, km: h.atKm, coordinate: c)
        }
        .sorted { $0.km < $1.km }
    }

    var heroCandidates: [ScenicMoment] {
        let rank = ["viewpoint": 0, "hilltop_village": 1, "castle": 2, "cypress": 3, "lake": 4, "coast": 5, "peak": 6]
        return moments.sorted { (rank[$0.type] ?? 9, $0.km) < (rank[$1.type] ?? 9, $1.km) }
    }

    /// "176 vineyards, 48 viewpoints, 32 abbeys" as icon + count pairs.
    var sceneryCounts: [(symbol: String, count: Int, label: String)] {
        summary.split(separator: ",").compactMap { part in
            let words = part.trimmingCharacters(in: .whitespaces).split(separator: " ", maxSplits: 1)
            guard words.count == 2, let n = Int(words[0]) else { return nil }
            return (PlaceIcon.symbol(forSummaryWord: String(words[1])), n, String(words[1]))
        }
    }

    var warnings: [Advisory] { advisories.filter { $0.severity != "info" } }

    /// The four score parts in spec order (Views, Hills, Bends, then Light once the API sends it; Variety until then).
    var scorePairs: [(symbol: String, value: Double, label: String)] {
        var out: [(String, Double, String)] = [("binoculars.fill", parts.views ?? parts.scenery, "Views")]
        if let r = parts.relief { out.append(("mountain.2.fill", r, "Hills")) }
        out.append(("road.lanes.curved.right", parts.bends, "Bends"))
        out.append(("sparkles", parts.variety, "Variety"))
        return out.map { (symbol: $0.0, value: $0.1, label: $0.2) }
    }
}

/// A photo for a place, loaded from /v1/photos, with the credit in the bottom-right corner.
struct MomentPhoto: View {
    @Environment(AppModel.self) private var model
    let candidates: [ScenicMoment]
    var showCredit = true
    @State private var photo: Photo?

    var body: some View {
        PhotoView(photo: photo, families: [PlaceIcon.family(candidates.first?.type ?? "")])
            .overlay(alignment: .bottomTrailing) {
                if showCredit, let photo { CreditTag(text: photo.credit) }
            }
            .task(id: candidates.first?.id) {
                for m in candidates.prefix(4) {
                    if let p = await model.photos(lat: m.coordinate.lat, lon: m.coordinate.lon, name: m.name).first {
                        photo = p
                        return
                    }
                }
            }
    }
}

/// A photo already chosen for a moment, with its credit.
struct CreditedPhoto: View {
    let photo: Photo?
    let type: String
    var body: some View {
        PhotoView(photo: photo, families: [PlaceIcon.family(type)])
            .overlay(alignment: .bottomTrailing) { if let photo { CreditTag(text: photo.credit) } }
    }
}

extension AppModel {
    /// One distinct photo per moment, in order: nearby places share photos, so each takes the first one not used yet.
    func distinctPhotos(for moments: [ScenicMoment]) async -> [String: Photo] {
        var used = Set<String>(), out: [String: Photo] = [:]
        for m in moments {
            let list = await photos(lat: m.coordinate.lat, lon: m.coordinate.lon, name: m.name)
            if let p = list.first(where: { !used.contains($0.url) }) {
                used.insert(p.url)
                out[m.id] = p
            }
        }
        return out
    }
}

struct CreditTag: View {
    let text: String
    var body: some View {
        Text("© \(text)")
            .font(.system(size: 8, weight: .medium)).foregroundStyle(.white.opacity(0.85))
            .lineLimit(1)
            .padding(.horizontal, 5).padding(.vertical, 2)
            .background(.black.opacity(0.28), in: Capsule())
            .padding(6)
            .accessibilityLabel("Photo: \(text)")
    }
}

/// The route's outline, drawn small over a photo.
struct RouteGlyph: Shape {
    let line: [Coordinate]

    func path(in rect: CGRect) -> Path {
        var p = Path()
        guard line.count > 1 else { return p }
        let step = max(1, line.count / 120)
        let pts = stride(from: 0, to: line.count, by: step).map { line[$0] } + [line[line.count - 1]]
        let lats = pts.map(\.lat), lons = pts.map(\.lon)
        let (minLat, maxLat, minLon, maxLon) = (lats.min()!, lats.max()!, lons.min()!, lons.max()!)
        let k = cos(((minLat + maxLat) / 2) * .pi / 180)
        let w = max((maxLon - minLon) * k, 1e-6), h = max(maxLat - minLat, 1e-6)
        let scale = min(rect.width / w, rect.height / h)
        let ox = rect.minX + (rect.width - w * scale) / 2, oy = rect.minY + (rect.height - h * scale) / 2
        for (i, c) in pts.enumerated() {
            let pt = CGPoint(x: ox + (c.lon - minLon) * k * scale, y: oy + (maxLat - c.lat) * scale)
            if i == 0 { p.move(to: pt) } else { p.addLine(to: pt) }
        }
        return p
    }
}

/// One- or two-word name for an advisory, with its icon. The full sentence stays one tap away.
enum AdvisoryStyle {
    static func symbol(_ a: Advisory) -> String {
        switch a.kind {
        case "ztl": "camera.fill"
        case "unpaved": "road.lanes"
        case "toll": "eurosign.circle.fill"
        case "vignette": "ticket.fill"
        case "ferry": "ferry.fill"
        case "lez": "aqi.medium"
        default: "exclamationmark.triangle.fill"
        }
    }

    static func short(_ a: Advisory) -> String {
        let t = a.title
        switch a.kind {
        case "ztl":
            if let r = t.range(of: #"the (.+) ZTL"#, options: .regularExpression) {
                return "ZTL " + t[r].dropFirst(4).dropLast(4)
            }
            return "ZTL"
        case "unpaved": return "Gravel " + (t.split(separator: " ").first.map { "\($0) km" } ?? "")
        case "toll": return "Tolls " + (t.split(separator: " ").first.map { "\($0) km" } ?? "")
        case "vignette": return "Vignette"
        case "ferry": return "Ferry"
        default: return t.split(separator: " ").prefix(2).joined(separator: " ")
        }
    }

    static func tint(_ a: Advisory) -> Color { a.severity == "info" ? Theme.lake : Theme.warning }
}

/// A short chip that unfolds into the full sentence.
struct AdvisoryChip: View {
    let advisory: Advisory
    var compact = false
    @State private var open = false

    var body: some View {
        Button { withAnimation(.snappy) { open.toggle() } } label: {
            VStack(alignment: .leading, spacing: 6) {
                Label(compact ? "" : AdvisoryStyle.short(advisory), systemImage: AdvisoryStyle.symbol(advisory))
                    .labelStyle(compact ? AnyLabelStyle(.iconOnly) : AnyLabelStyle(.titleAndIcon))
                    .font(Theme.sofia(13, .semibold))
                if open {
                    Text(advisory.detail).font(Theme.sofia(13)).foregroundStyle(Theme.ink2)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .foregroundStyle(AdvisoryStyle.tint(advisory))
            .padding(.horizontal, compact ? 7 : 11).padding(.vertical, 7)
            .background(AdvisoryStyle.tint(advisory).opacity(0.10), in: RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(advisory.title). \(advisory.detail)")
    }
}

struct AnyLabelStyle: LabelStyle {
    private let make: (Configuration) -> AnyView
    init<S: LabelStyle>(_ style: S) { make = { AnyView(style.makeBody(configuration: $0)) } }
    func makeBody(configuration: Configuration) -> some View { make(configuration) }
}

/// Icon + number, the app's replacement for "1 h 39 min · 66 km · +24 min".
struct Metric: View {
    let symbol: String
    let value: String
    var tint: Color = Theme.ink

    var body: some View {
        HStack(spacing: 5) {
            Image(systemName: symbol).font(.system(size: 13, weight: .semibold)).foregroundStyle(Theme.ink3)
            Text(value).font(Theme.sofia(15, .semibold)).monospacedDigit().foregroundStyle(tint)
        }
    }
}
