import SwiftUI
import MapKit
import ScenicKit

struct ResultsView: View {
    @Environment(AppModel.self) private var model
    @State private var camera: MapCameraPosition = .automatic

    var body: some View {
        @Bindable var model = model
        VStack(spacing: 0) {
            RouteMap(routes: model.plan?.routes ?? [], selectedID: model.selectedRouteID, camera: $camera)
                .frame(maxHeight: .infinity)
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(Array((model.plan?.routes ?? []).enumerated()), id: \.element.id) { i, route in
                        NavigationLink(value: route) {
                            RouteCard(route: route, color: Theme.routeColors[i % Theme.routeColors.count], selected: route.id == model.selectedRouteID)
                        }
                        .buttonStyle(.plain)
                        .simultaneousGesture(TapGesture().onEnded { model.selectedRouteID = route.id })
                    }
                    ForEach(model.plan?.warnings ?? [], id: \.self) { w in
                        Label(w, systemImage: "info.circle").font(.caption).foregroundStyle(.secondary)
                    }
                    if let p = model.plan {
                        Text("Fastest way: \(Format.duration(minutes: p.fastest.minutes)), \(Format.distance(km: p.fastest.km))")
                            .font(.caption).foregroundStyle(.secondary)
                        Text(p.attribution.joined(separator: " · ")).font(.caption2).foregroundStyle(.tertiary)
                    }
                }
                .padding()
            }
            .frame(maxHeight: 380)
            .background(.bar)
        }
        .navigationTitle(model.destination?.label?.components(separatedBy: ",").first ?? "Routes")
        .navigationBarTitleDisplayMode(.inline)
        .navigationDestination(for: RouteOption.self) { RouteDetailView(route: $0) }
    }
}

struct RouteMap: View {
    let routes: [RouteOption]
    let selectedID: String?
    @Binding var camera: MapCameraPosition

    var body: some View {
        Map(position: $camera) {
            // Draw unselected first so the selected route sits on top.
            let indexed = Array(routes.enumerated())
            let ordered = indexed.filter { $0.element.id != selectedID } + indexed.filter { $0.element.id == selectedID }
            ForEach(ordered, id: \.element.id) { i, r in
                let selected = r.id == selectedID
                MapPolyline(coordinates: r.line.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                    .stroke(Theme.routeColors[i % Theme.routeColors.count].opacity(selected ? 1 : 0.45), style: StrokeStyle(lineWidth: selected ? 6 : 4, lineCap: .round, lineJoin: .round))
            }
            if let r = routes.first(where: { $0.id == selectedID }) ?? routes.first {
                ForEach(r.scenicStops, id: \.self) { s in
                    Annotation(s.name.isEmpty ? "Scenic spot" : s.name, coordinate: CLLocationCoordinate2D(latitude: s.lat, longitude: s.lon)) {
                        Image(systemName: "camera.fill").font(.caption2).padding(6)
                            .background(Theme.graphite, in: RoundedRectangle(cornerRadius: 6)).overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(Theme.sandglow, lineWidth: 2)).foregroundStyle(Theme.sandglow)
                    }
                }
                if let first = r.line.first {
                    Marker("Start", systemImage: "car.fill", coordinate: CLLocationCoordinate2D(latitude: first.lat, longitude: first.lon)).tint(Theme.basalt)
                }
                if let last = r.line.last {
                    Marker("Arrive", systemImage: "flag.checkered", coordinate: CLLocationCoordinate2D(latitude: last.lat, longitude: last.lon)).tint(Theme.basalt)
                }
            }
        }
        .mapStyle(.standard(elevation: .realistic, pointsOfInterest: .excludingAll))
        .mapControls { MapCompass(); MapScaleView() }
    }
}

struct RouteCard: View {
    let route: RouteOption
    let color: Color
    let selected: Bool

    var body: some View {
        HStack(spacing: 14) {
            ScoreRing(score: route.score, color: color, solid: selected)
            VStack(alignment: .leading, spacing: 4) {
                Text(route.label).font(Theme.headlineFont)
                Text(route.summary).font(.subheadline).foregroundStyle(.secondary).lineLimit(2)
                HStack(spacing: 10) {
                    Label(Format.duration(minutes: route.minutes), systemImage: "clock")
                    Text(Format.extra(minutes: route.extraMinutes)).foregroundStyle(color)
                    Text(Format.distance(km: route.km))
                }
                .font(.caption).monospacedDigit()
                if route.advisories.contains(where: { $0.severity != "info" }) {
                    Label(route.advisories.first { $0.severity != "info" }!.title, systemImage: "exclamationmark.triangle.fill")
                        .font(.caption).foregroundStyle(Theme.ember)
                }
            }
            Spacer(minLength: 0)
            Image(systemName: "chevron.right").foregroundStyle(.tertiary)
        }
        .padding(14)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.corner))
        .overlay(RoundedRectangle(cornerRadius: Theme.corner).strokeBorder(selected ? color : Theme.border, lineWidth: selected ? 2 : 1))
    }
}

/// Score plate from the design system: solid sandglow for the chosen route, outline for alternatives.
struct ScoreRing: View {
    let score: Double
    let color: Color
    var size: CGFloat = 54
    var solid = true

    var body: some View {
        VStack(spacing: 0) {
            Text("\(Int(score))").font(.system(size: size * 0.5, weight: .heavy).width(.condensed)).monospacedDigit()
            Text("SCENIC").font(.system(size: max(8, size * 0.14), weight: .bold, design: .monospaced)).tracking(1)
        }
        .foregroundStyle(solid ? Theme.onAccent : Theme.sandglow)
        .frame(width: size * 1.07, height: size)
        .background(solid ? Theme.sandglow : .clear, in: RoundedRectangle(cornerRadius: 6))
        .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(Theme.sandglow, lineWidth: solid ? 0 : 2))
        .accessibilityLabel("Scenery score \(Int(score)) out of 100")
    }
}
