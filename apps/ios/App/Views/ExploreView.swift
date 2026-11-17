import SwiftUI
import MapKit
import ScenicKit

/// "Explore nearby": the most beautiful places within the chosen drive, photo first.
struct ExploreView: View {
    @Environment(AppModel.self) private var model
    @State private var camera: MapCameraPosition = .automatic
    @State private var selected: String?

    var body: some View {
        let places = model.explore?.destinations ?? []
        ScrollView {
            VStack(spacing: 16) {
                Map(position: $camera) {
                    if let o = model.explore?.origin {
                        Annotation("", coordinate: CLLocationCoordinate2D(latitude: o.lat, longitude: o.lon)) {
                            Circle().fill(Theme.ink).frame(width: 12, height: 12).overlay(Circle().stroke(.white, lineWidth: 2))
                        }
                    }
                    ForEach(places) { d in
                        let on = d.id == (selected ?? places.first?.id)
                        MapPolyline(coordinates: d.line.map { CLLocationCoordinate2D(latitude: $0.lat, longitude: $0.lon) })
                            .stroke(on ? Theme.green : Theme.lake.opacity(0.35), style: StrokeStyle(lineWidth: on ? 5 : 3, lineCap: .round, lineJoin: .round))
                        Annotation(d.name, coordinate: CLLocationCoordinate2D(latitude: d.lat, longitude: d.lon)) {
                            Circle().fill(on ? Theme.green : Theme.surface).frame(width: 14, height: 14)
                                .overlay(Circle().stroke(on ? .white : Theme.green, lineWidth: 2))
                        }
                    }
                }
                .mapStyle(.standard(elevation: .realistic, pointsOfInterest: .excludingAll))
                .frame(height: 240)
                .clipShape(RoundedRectangle(cornerRadius: Theme.corner))

                ForEach(Array(places.enumerated()), id: \.element.id) { i, d in
                    Button {
                        selected = d.id
                        Task {
                            await model.plan(to: d)
                            if model.plan?.routes.isEmpty == false { model.planPath.append(.results) }
                        }
                    } label: {
                        PlaceCard(place: d)
                    }
                    .buttonStyle(.plain)
                    .accessibilityIdentifier("placeCard\(i)")
                    .onAppear { if selected == nil { selected = places.first?.id } }
                }

                if let attribution = model.explore?.attribution {
                    Text((attribution + ["Photos: Wikimedia Commons"]).joined(separator: " · "))
                        .font(.caption2).foregroundStyle(Theme.ink3)
                }
            }
            .padding()
        }
        .overlay {
            if model.isPlanning {
                ProgressView().controlSize(.large).padding(24).background(.regularMaterial, in: RoundedRectangle(cornerRadius: Theme.corner))
            }
        }
        .background(Theme.background)
        .navigationTitle(model.roundTrip ? "Loops from here" : "Within \(Format.duration(minutes: Double(model.exploreMinutes)))")
        .navigationBarTitleDisplayMode(.inline)
    }
}

/// A place as a photo card: the picture says why; the overlay says how far.
struct PlaceCard: View {
    @Environment(AppModel.self) private var model
    let place: ExploreDestination
    @State private var photo: Photo?

    var body: some View {
        ZStack(alignment: .bottomLeading) {
            PhotoView(photo: photo, families: place.families)
                .frame(height: 210)
            LinearGradient(colors: [.clear, .black.opacity(0.65)], startPoint: .center, endPoint: .bottom)
            VStack(alignment: .leading, spacing: 8) {
                HStack(alignment: .top) {
                    Spacer()
                    ScoreRing(score: place.score, color: .white, size: 48)
                }
                Spacer()
                Text(place.name).font(Theme.sofia(26, .semibold, relativeTo: .title)).foregroundStyle(.white)
                HStack(spacing: 14) {
                    Label(Format.duration(minutes: place.minutes), systemImage: "car.fill")
                    if let sunset = Format.time(place.sunset) { Label(sunset, systemImage: "sunset.fill") }
                    HStack(spacing: 6) {
                        ForEach(place.families.prefix(3), id: \.self) { Image(systemName: FamilyIcon.symbol($0)) }
                    }
                }
                .font(Theme.sofia(14, .medium)).foregroundStyle(.white.opacity(0.92))
                .labelStyle(.titleAndIcon)
            }
            .padding(16)
            if let photo {
                Text(photo.credit).font(.system(size: 9)).foregroundStyle(.white.opacity(0.7))
                    .padding(6).frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
            }
        }
        .frame(height: 210)
        .clipShape(RoundedRectangle(cornerRadius: Theme.corner))
        .shadow(color: Theme.ink.opacity(0.10), radius: 18, y: 10)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(place.name), \(Format.duration(minutes: place.minutes)) away, score \(Int(place.score))")
        .task { photo = await model.photos(lat: place.lat, lon: place.lon, name: place.name).first }
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
