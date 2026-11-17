import SwiftUI
import MapKit
import ScenicKit

/// "Explore nearby": a big map, and the places as photo cards you swipe through. The centred card lights up its road.
struct ExploreView: View {
    @Environment(AppModel.self) private var model
    @State private var camera: MapCameraPosition = .automatic
    @State private var selected: String?

    var body: some View {
        let places = model.explore?.destinations ?? []
        let current = selected ?? places.first?.id
        ZStack(alignment: .bottom) {
            Map(position: $camera) {
                if let o = model.explore?.origin {
                    Annotation("", coordinate: CLLocationCoordinate2D(latitude: o.lat, longitude: o.lon)) {
                        Circle().fill(Theme.ink).frame(width: 12, height: 12).overlay(Circle().stroke(.white, lineWidth: 2))
                    }
                }
                // Dim roads first, the chosen one last so it draws on top.
                ForEach(places.filter { $0.id != current } + places.filter { $0.id == current }) { d in
                    let on = d.id == current
                    MapPolyline(coordinates: d.line.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                        .stroke(on ? Theme.green : Theme.lake.opacity(0.3), style: StrokeStyle(lineWidth: on ? 5 : 2.5, lineCap: .round, lineJoin: .round))
                }
                ForEach(Array(places.enumerated()), id: \.element.id) { i, d in
                    let on = d.id == current
                    Annotation(on ? d.name : "", coordinate: CLLocationCoordinate2D(latitude: d.lat, longitude: d.lon)) {
                        Text("\(i + 1)").font(Theme.sofia(11, .bold)).foregroundStyle(on ? .white : Theme.green)
                            .frame(width: 22, height: 22)
                            .background(on ? Theme.green : Theme.surface, in: Circle())
                            .overlay(Circle().strokeBorder(on ? .white : Theme.green, lineWidth: 1.5))
                            .onTapGesture { withAnimation { selected = d.id } }
                    }
                }
            }
            .mapStyle(.standard(elevation: .realistic, pointsOfInterest: .excludingAll))
            .ignoresSafeArea(edges: .top)

            VStack(alignment: .leading, spacing: 10) {
                if let attribution = model.explore?.attribution {
                    Text(attribution.joined(separator: " · ")).font(.system(size: 9)).foregroundStyle(Theme.ink3)
                        .padding(.horizontal, 8).padding(.vertical, 3).background(.ultraThinMaterial, in: Capsule())
                        .padding(.leading, Theme.gutter)
                }
                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHStack(spacing: 12) {
                        ForEach(Array(places.enumerated()), id: \.element.id) { i, d in
                            Button {
                                selected = d.id
                                Task {
                                    await model.plan(to: d)
                                    if model.plan?.routes.isEmpty == false { model.planPath.append(.results) }
                                }
                            } label: {
                                PlaceCard(place: d, index: i + 1, selected: d.id == current)
                            }
                            .buttonStyle(.plain)
                            .accessibilityIdentifier("placeCard\(i)")
                            .id(d.id)
                        }
                    }
                    .scrollTargetLayout()
                    .padding(.horizontal, Theme.gutter)
                }
                .scrollTargetBehavior(.viewAligned)
                .scrollPosition(id: $selected, anchor: .center)
                .frame(height: 300)
            }
            .padding(.bottom, 8)
        }
        .overlay {
            if model.isPlanning {
                ProgressView().controlSize(.large).padding(24).background(.regularMaterial, in: RoundedRectangle(cornerRadius: Theme.corner))
            }
        }
        .background(Theme.background)
        .navigationTitle(model.roundTrip ? "Loops · \(Format.duration(minutes: Double(model.exploreMinutes)))" : "Within \(Format.duration(minutes: Double(model.exploreMinutes)))")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.visible, for: .navigationBar)
        .onAppear { if selected == nil { selected = places.first?.id } }
        .onChange(of: selected) { _, id in
            guard let d = places.first(where: { $0.id == id }) else { return }
            let pts = d.line + [Coordinate(lat: d.lat, lon: d.lon)]
            withAnimation(.easeInOut(duration: 0.6)) { camera = .rect(Self.rect(pts)) }
        }
    }

    /// A map rect around the points, padded so the road clears the cards at the bottom.
    static func rect(_ pts: [Coordinate]) -> MKMapRect {
        let r = pts.map { MKMapPoint(CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon)) }
            .reduce(MKMapRect.null) { $0.union(MKMapRect(origin: $1, size: MKMapSize(width: 1, height: 1))) }
        let padX = r.size.width * 0.25, padTop = r.size.height * 0.2, padBottom = r.size.height * 1.4
        return MKMapRect(x: r.origin.x - padX, y: r.origin.y - padTop, width: r.size.width + 2 * padX, height: r.size.height + padTop + padBottom)
    }
}

/// A place as a photo card: the picture says why; numbers say how far.
struct PlaceCard: View {
    @Environment(AppModel.self) private var model
    let place: ExploreDestination
    var index = 1
    var selected = false
    @State private var photo: Photo?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            PhotoView(photo: photo, families: place.families)
                .frame(height: 178)
                .overlay(alignment: .topLeading) {
                    HStack(spacing: 6) {
                        Text("\(index)").font(Theme.sofia(13, .bold)).monospacedDigit()
                        ForEach(place.families.prefix(3), id: \.self) { Image(systemName: FamilyIcon.symbol($0)).font(.system(size: 11)) }
                    }
                    .foregroundStyle(Theme.ink)
                    .padding(.horizontal, 10).frame(height: 28)
                    .background(.white.opacity(0.82), in: Capsule())
                    .padding(10)
                }
                .overlay(alignment: .topTrailing) {
                    ScoreRing(score: place.score, color: Theme.green, size: 54)
                        .padding(5).background(.white.opacity(0.72), in: Circle())
                        .padding(8)
                }
                .overlay(alignment: .bottomTrailing) {
                    if let photo { PhotoCredit(text: "© " + photo.credit, size: 9).frame(maxWidth: 210, alignment: .trailing).padding(.trailing, 8).padding(.bottom, 6) }
                }
                .clipped()
            VStack(alignment: .leading, spacing: 8) {
                Text(place.name).font(Theme.sofia(18, .semibold)).foregroundStyle(Theme.ink).lineLimit(1)
                HStack(spacing: 14) {
                    stat("clock", Format.duration(minutes: place.minutes))
                    stat("point.topleft.down.to.point.bottomright.curvepath", Format.distance(km: place.km))
                    if let sunset = Format.time(place.sunset) { stat("sunset", sunset, color: Theme.terracotta) }
                }
            }
            .padding(.horizontal, 14).padding(.vertical, 12)
        }
        .frame(width: 300)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(selected ? Theme.green : Theme.border, lineWidth: selected ? 2 : 1))
        .shadow(color: Theme.ink.opacity(0.12), radius: 16, y: 8)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(place.name), \(Format.duration(minutes: place.minutes)) away, score \(Int(place.score))")
        .task { photo = await model.photos(lat: place.lat, lon: place.lon, name: place.name).first }
    }

    private func stat(_ symbol: String, _ text: String, color: Color = Theme.ink2) -> some View {
        HStack(spacing: 5) {
            Image(systemName: symbol).font(.system(size: 12))
            Text(text).font(Theme.sofia(14, .medium)).monospacedDigit()
        }
        .foregroundStyle(color)
    }
}

/// A photo with a calm placeholder (the landscape family's icon on paper) while it loads or when none exists.
struct PhotoView: View {
    let photo: Photo?
    var families: [String] = []

    var body: some View {
        // Overlays, not a ZStack: a scaledToFill image in a ZStack makes the card as wide as the photo.
        Theme.mist
            .overlay {
                Image(systemName: FamilyIcon.symbol(families.first ?? "views"))
                    .font(.system(size: 40, weight: .light)).foregroundStyle(Theme.ink3)
            }
            .overlay {
                if let photo, let url = URL(string: photo.url) {
                    AsyncImage(url: url, transaction: Transaction(animation: .easeOut(duration: 0.3))) { phase in
                        if let image = phase.image { image.resizable().scaledToFill() } else { Color.clear }
                    }
                }
            }
            .clipped()
    }
}

enum FamilyIcon {
    static func symbol(_ family: String) -> String {
        switch family {
        case "views": "binoculars.fill"
        case "mountains": "mountain.2.fill"
        case "heritage": "building.columns.fill"
        case "water": "water.waves"
        case "countryside": "leaf.fill"
        case "roads": "road.lanes.curved.right"
        default: "sparkles"
        }
    }
}
