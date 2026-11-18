import SwiftUI
import MapKit
import ScenicKit

// "What does the scenery cost?": each route against the fastest road.
// Card strip (+38 min · +13 km · −€8), detail bars and a detour ribbon, chips and a ghost line on the map.

/// Three chips under a route card: extra time, extra km, and the toll difference.
struct VsStrip: View {
    let route: RouteOption

    var body: some View {
        HStack(spacing: 6) {
            if route.source == "fastest" {
                chip("Fastest road")
                if let t = route.tolls, t.eur >= 1 { chip("≈ €\(Int(t.eur)) tolls") }
            } else if let v = route.vsFastest {
                chip("+\(Format.duration(minutes: v.extraMinutes))")
                if v.extraKm >= 1 { chip("+\(Int(v.extraKm.rounded())) km") }
                else if v.extraKm <= -1 { chip("−\(Int((-v.extraKm).rounded())) km") }
                if v.tollSavedEur >= 1 { chip("−€\(Int(v.tollSavedEur))", filled: true) }
                else if v.tollSavedEur <= -1 { chip("+€\(Int(-v.tollSavedEur))") }
            } else if route.extraMinutes >= 1 {
                chip("+\(Int(route.extraMinutes.rounded())) min")
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(accessibility)
    }

    private func chip(_ text: String, filled: Bool = false) -> some View {
        Text(text).font(Theme.sofia(13, .semibold)).monospacedDigit()
            .foregroundStyle(filled ? .white : Theme.greenDark)
            .padding(.horizontal, 10).frame(height: 26)
            .background(filled ? Theme.green : Theme.greenTint, in: Capsule())
    }

    private var accessibility: String {
        guard let v = route.vsFastest, route.source != "fastest" else { return route.source == "fastest" ? "Fastest road" : "" }
        var s = "\(Int(v.extraMinutes)) minutes more than the fastest road, \(Int(abs(v.extraKm).rounded())) kilometres \(v.extraKm < 0 ? "shorter" : "longer")"
        if v.tollSavedEur >= 1 { s += ", about \(Int(v.tollSavedEur)) euros less in tolls" }
        return s
    }
}

/// Detail section: time bars, where the route turns off, toll bars.
struct VsFastestSection: View {
    let route: RouteOption
    let fastest: PlanResponse.Fastest

    var body: some View {
        if let v = route.vsFastest, route.source != "fastest" {
            VStack(alignment: .leading, spacing: 14) {
                eyebrow("Against the fastest road")
                CompareBars(rows: [
                    .init(label: "Fastest", value: fastest.minutes, text: Format.duration(minutes: fastest.minutes), direct: true),
                    .init(label: "This", value: route.minutes, text: Format.duration(minutes: route.minutes), direct: false),
                ])
                if v.sharedPct < 15 {
                    // Nothing in common with the fast road: one arc over the whole drive says nothing.
                    Label("A different road from start to finish", systemImage: "arrow.triangle.branch")
                        .font(Theme.sofia(14, .medium)).foregroundStyle(Theme.greenDark)
                        .padding(.horizontal, 12).padding(.vertical, 9)
                        .background(Theme.greenTint, in: RoundedRectangle(cornerRadius: 12))
                } else if !v.detours.isEmpty {
                    eyebrow("Where you turn off").padding(.top, 6)
                    DetourRibbon(km: route.km, detours: v.detours).frame(height: 104)
                }
                let tf = fastest.tolls?.eur ?? 0, tr = route.tolls?.eur ?? 0
                if tf >= 1 || tr >= 1 {
                    eyebrow("Tolls, about").padding(.top, 6)
                    CompareBars(rows: [
                        .init(label: "Fastest", value: tf, text: "€\(Int(tf))", direct: true),
                        .init(label: "This", value: tr, text: "€\(Int(tr))", direct: false),
                    ])
                }
            }
            .accessibilityElement(children: .contain)
        }
    }

    private func eyebrow(_ text: String) -> some View {
        Text(text.uppercased()).font(Theme.labelFont).tracking(0.8).foregroundStyle(Theme.ink3)
    }
}

/// Two bars: the fastest road dashed grey, this route solid green.
struct CompareBars: View {
    struct Row: Identifiable { let label: String; let value: Double; let text: String; let direct: Bool; var id: String { label } }
    let rows: [Row]

    var body: some View {
        let top = max(rows.map(\.value).max() ?? 1, 1)
        VStack(spacing: 8) {
            ForEach(rows) { r in
                HStack(spacing: 10) {
                    Text(r.label).font(Theme.sofia(13)).foregroundStyle(Theme.ink2).frame(width: 56, alignment: .leading)
                    GeometryReader { g in
                        let w = max(4, g.size.width * r.value / top)
                        ZStack(alignment: .leading) {
                            if r.direct {
                                Path { p in p.move(to: CGPoint(x: 2, y: 4)); p.addLine(to: CGPoint(x: w, y: 4)) }
                                    .stroke(Theme.ink3, style: StrokeStyle(lineWidth: 4, lineCap: .round, dash: [6, 4]))
                            } else {
                                Capsule().fill(Theme.green).frame(width: w, height: 8)
                            }
                        }
                        .frame(maxHeight: .infinity)
                    }
                    .frame(height: 10)
                    Text(r.text).font(Theme.sofia(14, .semibold)).monospacedDigit().foregroundStyle(Theme.ink)
                        .lineLimit(1).fixedSize().frame(minWidth: 64, alignment: .trailing)
                }
                .accessibilityElement(children: .combine)
            }
        }
    }
}

/// The drive as a straight dashed line from start to finish; each detour rises from it as a green arc,
/// as high as the minutes it adds, with its place name and "+15 min" underneath.
struct DetourRibbon: View {
    let km: Double
    let detours: [Detour]

    var body: some View {
        GeometryReader { g in
            let w = g.size.width, base = g.size.height - 40, x0: CGFloat = 6, x1 = w - 6
            let total = max(km, 1)
            let x = { (k: Double) in x0 + (x1 - x0) * CGFloat(min(total, max(0, k)) / total) }
            let most = max(detours.map(\.extraMinutes).max() ?? 1, 1)
            ZStack(alignment: .topLeading) {
                Path { p in p.move(to: CGPoint(x: x0, y: base)); p.addLine(to: CGPoint(x: x1, y: base)) }
                    .stroke(Theme.ink3, style: StrokeStyle(lineWidth: 3, lineCap: .round, dash: [7, 5]))
                Path { p in
                    p.move(to: CGPoint(x: x0, y: base))
                    for d in detours {
                        let a = x(d.fromKm), b = x(d.toKm), h = CGFloat(12 + 36 * d.extraMinutes / most)
                        p.addLine(to: CGPoint(x: a, y: base))
                        p.addQuadCurve(to: CGPoint(x: b, y: base), control: CGPoint(x: (a + b) / 2, y: base - 2 * h))
                    }
                    p.addLine(to: CGPoint(x: x1, y: base))
                }
                .stroke(Theme.green, style: StrokeStyle(lineWidth: 5, lineCap: .round, lineJoin: .round))
                Circle().fill(Theme.ink).frame(width: 9, height: 9).position(x: x0, y: base)
                Circle().fill(Theme.surface).overlay(Circle().strokeBorder(Theme.ink, lineWidth: 2.5)).frame(width: 10, height: 10).position(x: x1, y: base)
                ForEach(Array(labelled(x).enumerated()), id: \.offset) { _, d in
                    VStack(spacing: 1) {
                        if let n = d.name { Text(n).font(Theme.sofia(11, .bold)).foregroundStyle(Theme.ink).lineLimit(1) }
                        Text("+\(Int(d.extraMinutes)) min").font(Theme.sofia(11, .bold)).foregroundStyle(Theme.green).monospacedDigit()
                    }
                    .frame(width: 96)
                    .position(x: min(x1 - 44, max(x0 + 44, (x(d.fromKm) + x(d.toKm)) / 2)), y: base + 20)
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(detours.map { "\($0.name ?? "Detour") adds \(Int($0.extraMinutes)) minutes" }.joined(separator: ", "))
    }
}

extension DetourRibbon {
    /// The costliest detours get a label; one that would sit on top of a label already placed is left out.
    func labelled(_ x: (Double) -> CGFloat) -> [Detour] {
        var placed: [CGFloat] = []
        return detours.sorted { $0.extraMinutes > $1.extraMinutes }.filter { d in
            let cx = (x(d.fromKm) + x(d.toKm)) / 2
            guard !placed.contains(where: { abs($0 - cx) < 92 }) else { return false }
            placed.append(cx)
            return true
        }
    }
}

/// "+15 min" on the map, halfway along a detour.
struct DetourChip: View {
    let minutes: Double
    var body: some View {
        Text("+\(Int(minutes)) min").font(Theme.sofia(12, .bold)).foregroundStyle(.white).monospacedDigit()
            .padding(.horizontal, 8).frame(height: 22)
            .background(Theme.green, in: Capsule())
            .overlay(Capsule().strokeBorder(.white, lineWidth: 2))
            .shadow(color: Theme.ink.opacity(0.2), radius: 2, y: 1)
    }
}

extension RouteOption {
    /// Where to put each detour's chip on the map: halfway along it.
    var detourMidpoints: [(id: Int, minutes: Double, name: String?, at: Coordinate)] {
        guard source != "fastest", let v = vsFastest else { return [] }
        let line = self.line
        // The router's km and the decoded line's length differ slightly; place by share of the route.
        let lineKm = zip(line, line.dropFirst()).reduce(0.0) { $0 + Polyline.km($1.0, $1.1) }
        let scale = km > 0 ? lineKm / km : 1
        return v.detours.enumerated().compactMap { i, d in
            guard d.extraMinutes >= 1, let c = Polyline.coordinate(on: line, atKm: (d.fromKm + d.toKm) / 2 * scale) else { return nil }
            return (i, d.extraMinutes, d.name, c)
        }
    }

    /// The next detour ahead of the driver, within `withinKm`.
    func nextDetour(afterKm km: Double, withinKm: Double = 3) -> Detour? {
        vsFastest?.detours.first { $0.fromKm >= km - 0.2 && $0.fromKm - km <= withinKm && $0.extraMinutes >= 1 }
    }
}

extension AppModel {
    /// The fastest road of the plan this route came from (nil for a route from another plan, e.g. a saved trip).
    func fastest(for route: RouteOption) -> PlanResponse.Fastest? {
        guard let p = plan, p.routes.contains(where: { $0.id == route.id }) else { return nil }
        return p.fastest
    }
}
