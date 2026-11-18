import SwiftUI
import MapKit
import ScenicKit

struct ResultsView: View {
    @Environment(AppModel.self) private var model
    @State private var camera: MapCameraPosition = .automatic
    @State private var showNotes = false

    var body: some View {
        @Bindable var model = model
        let routes = model.plan?.routes ?? []
        VStack(spacing: 0) {
            RouteMap(routes: routes, selectedID: model.selectedRouteID, camera: $camera, fastest: model.plan?.fastest.line ?? [])
                .frame(minHeight: 260, maxHeight: 470)
                .overlay(alignment: .bottomLeading) {
                    if let notes = model.plan?.warnings, !notes.isEmpty {
                        Button { showNotes = true } label: {
                            Label("\(notes.count)", systemImage: "info.circle.fill")
                                .font(Theme.sofia(13, .semibold)).padding(.horizontal, 10).padding(.vertical, 6)
                        }
                        .buttonStyle(.plain)
                        .background(.regularMaterial, in: Capsule())
                        .padding(12)
                        .accessibilityLabel(notes.joined(separator: ". "))
                    }
                }

            // One card per route, snapping; the visible card drives the map.
            ScrollView(.horizontal) {
                LazyHStack(spacing: 14) {
                    ForEach(Array(routes.enumerated()), id: \.element.id) { i, route in
                        Button {
                            model.selectedRouteID = route.id
                            model.planPath.append(.route(route))
                        } label: {
                            RouteCard(route: route, number: i + 1, color: Theme.routeColors[i % Theme.routeColors.count], selected: route.id == model.selectedRouteID)
                                .contentShape(Rectangle())
                        }
                        .buttonStyle(.plain)
                        .accessibilityIdentifier("routeCard\(i)")
                        .id(route.id)
                    }
                }
                .scrollTargetLayout()
                .padding(.top, 16).padding(.bottom, 12)
            }
            .scrollTargetBehavior(.viewAligned)
            .scrollPosition(id: $model.selectedRouteID)
            .contentMargins(.horizontal, Theme.gutter, for: .scrollContent)
            .scrollIndicators(.hidden)
            .fixedSize(horizontal: false, vertical: true)
        }
        .background(Theme.background)
        .navigationTitle(model.tripTitle)
        .navigationBarTitleDisplayMode(.inline)
        .onAppear { if model.selectedRouteID == nil { model.selectedRouteID = routes.first?.id } }
        .sheet(isPresented: $showNotes) {
            VStack(alignment: .leading, spacing: 14) {
                ForEach(model.plan?.warnings ?? [], id: \.self) { Label($0, systemImage: "info.circle").font(Theme.bodyFont) }
                if let p = model.plan {
                    Text(p.attribution.joined(separator: " · ")).font(.caption2).foregroundStyle(Theme.ink3)
                }
            }
            .padding(Theme.gutter)
            .presentationDetents([.medium])
        }
    }
}

struct RouteMap: View {
    let routes: [RouteOption]
    let selectedID: String?
    @Binding var camera: MapCameraPosition
    /// The fastest road, drawn as a dashed grey ghost line under the routes.
    var fastest: [Coordinate] = []

    var body: some View {
        let chosen = routes.first(where: { $0.id == selectedID }) ?? routes.first
        Map(position: $camera) {
            // Draw unselected first so the selected route sits on top.
            let indexed = Array(routes.enumerated())
            let ordered = indexed.filter { $0.element.id != selectedID } + indexed.filter { $0.element.id == selectedID }
            // Alternatives first, then the fastest road as a dashed ghost (alternatives often share it), the chosen route on top.
            ForEach(ordered.filter { $0.element.id != selectedID }, id: \.element.id) { i, r in
                MapPolyline(coordinates: r.line.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                    .stroke(Theme.routeColors[i % Theme.routeColors.count].opacity(0.45), style: StrokeStyle(lineWidth: 4, lineCap: .round, lineJoin: .round))
            }
            if !fastest.isEmpty, chosen?.source != "fastest" {
                MapPolyline(coordinates: fastest.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                    .stroke(Theme.surface, style: StrokeStyle(lineWidth: 7, lineCap: .round, lineJoin: .round))
                MapPolyline(coordinates: fastest.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                    .stroke(Theme.ink2, style: StrokeStyle(lineWidth: 4, lineCap: .round, lineJoin: .round, dash: [8, 7]))
            }
            ForEach(ordered.filter { $0.element.id == selectedID }, id: \.element.id) { i, r in
                MapPolyline(coordinates: r.line.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                    .stroke(Theme.routeColors[i % Theme.routeColors.count], style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round))
            }
            if let r = chosen {
                if !fastest.isEmpty {
                    ForEach(r.detourMidpoints, id: \.id) { d in
                        Annotation(d.name ?? "Detour", coordinate: CLLocationCoordinate2D(latitude: d.at.lat, longitude: d.at.lon), anchor: .center) {
                            DetourChip(minutes: d.minutes)
                        }
                        .annotationTitles(.hidden)
                    }
                }
                ForEach(r.scenicStops, id: \.self) { s in
                    Annotation(s.name.isEmpty ? "Scenic spot" : s.name, coordinate: CLLocationCoordinate2D(latitude: s.lat, longitude: s.lon)) {
                        Image(systemName: "camera.fill").font(.caption2).padding(6)
                            .background(Theme.surface, in: Circle()).overlay(Circle().strokeBorder(Theme.accent, lineWidth: 2)).foregroundStyle(Theme.accent)
                    }
                }
                if let first = r.line.first {
                    Marker("Start", systemImage: "car.fill", coordinate: CLLocationCoordinate2D(latitude: first.lat, longitude: first.lon)).tint(Theme.ink)
                }
                if let last = r.line.last {
                    Marker("Arrive", systemImage: "flag.checkered", coordinate: CLLocationCoordinate2D(latitude: last.lat, longitude: last.lon)).tint(Theme.ink)
                }
            }
        }
        .mapStyle(.standard(elevation: .realistic, pointsOfInterest: .excludingAll))
        .mapControls { MapCompass(); MapScaleView() }
    }
}

/// A route as a photo (spec "Route card"): its best moment leads, the stamp says how good,
/// three highlight thumbnails and four icon + number pairs say why.
struct RouteCard: View {
    @Environment(AppModel.self) private var model
    let route: RouteOption
    let number: Int
    let color: Color
    let selected: Bool
    @State private var thumbs: [Photo] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            MomentPhoto(candidates: route.heroCandidates)
                .frame(width: 300, height: 178)
                .overlay(alignment: .topLeading) {
                    HStack(spacing: 6) {
                        Capsule().fill(color).frame(width: 18, height: 4)
                        Text("\(number)").font(Theme.sofia(13, .bold)).foregroundStyle(Theme.ink)
                    }
                    .padding(.horizontal, 10).padding(.vertical, 6)
                    .background(.white.opacity(0.82), in: Capsule())
                    .padding(12)
                }
                .overlay(alignment: .topTrailing) {
                    StampView(score: Int(route.score.rounded()), place: model.destinationShortName, ink: Theme.green, size: 66,
                              rotation: number % 2 == 0 ? 5 : -6, seed: number)
                        .padding(3)
                        .background(.white.opacity(0.72), in: Circle())
                        .padding(8)
                }
                .overlay(alignment: .bottomLeading) {
                    HStack(spacing: -8) {
                        ForEach(thumbs.prefix(3), id: \.url) { p in
                            PhotoView(photo: p)
                                .frame(width: 30, height: 30)
                                .clipShape(Circle())
                                .overlay(Circle().strokeBorder(.white, lineWidth: 2))
                        }
                    }
                    .padding(12)
                }
                .clipped()

            VStack(alignment: .leading, spacing: 10) {
                HStack(alignment: .firstTextBaseline) {
                    Text(route.label).font(Theme.sofia(17, .semibold)).foregroundStyle(Theme.ink).lineLimit(1)
                    Spacer(minLength: 4)
                    ForEach(route.warnings.prefix(2), id: \.self) { a in
                        Image(systemName: AdvisoryStyle.symbol(a)).font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(AdvisoryStyle.tint(a))
                            .accessibilityLabel(a.title)
                    }
                }
                HStack(spacing: 14) {
                    Metric(symbol: "clock", value: Format.duration(minutes: route.minutes))
                    Metric(symbol: "road.lanes", value: Format.distance(km: route.km))
                }
                VsStrip(route: route)
                Rectangle().fill(Theme.line).frame(height: 1)
                HStack(spacing: 0) {
                    ForEach(route.scorePairs, id: \.label) { p in
                        Metric(symbol: p.symbol, value: "\(Int(p.value))", tint: p.label == "Light" ? Theme.terracotta : Theme.ink)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .accessibilityLabel("\(p.label) \(Int(p.value))")
                    }
                }
            }
            .padding(14)
        }
        .frame(width: 300)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(selected ? Theme.green : Theme.border, lineWidth: selected ? 2 : 1))
        .shadow(color: Theme.ink.opacity(0.08), radius: 18, y: 10)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Route \(number), \(route.label), score \(Int(route.score)), \(Format.duration(minutes: route.minutes)), \(route.summary)")
        .task(id: route.id) {
            let moments = Array(route.moments.prefix(5))
            let got = await model.distinctPhotos(for: moments)
            thumbs = moments.compactMap { got[$0.id] }
        }
    }
}

/// The scenic score as a passport stamp (design system "Stamp"): double ring, slight rotation, worn ink.
/// Ink follows the route's line colour; the chosen route's stamp is fully inked, alternatives a little faded.
struct ScoreRing: View {
    let score: Double
    let color: Color
    var size: CGFloat = 58
    var solid = true
    /// Ink on paper multiplies; a white stamp over a photo must not.
    var inked = true

    var body: some View {
        ZStack {
            Circle().strokeBorder(color, lineWidth: 2)
            Circle().strokeBorder(color, lineWidth: 1).padding(4)
            VStack(spacing: 0) {
                Text("\(Int(score))").font(Theme.sofia(size * 0.4, .bold)).monospacedDigit()
                Text("SCENIC").font(Theme.sofia(max(7, size * 0.13), .semibold)).tracking(1)
            }
        }
        .foregroundStyle(color)
        .frame(width: size, height: size)
        .opacity(solid ? 1 : 0.8)
        .rotationEffect(.degrees(score.truncatingRemainder(dividingBy: 2) < 1 ? -6 : 4))
        .blendMode(inked ? .multiply : .normal)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Scenery score \(Int(score)) out of 100")
    }
}
