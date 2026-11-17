import SwiftUI
import MapKit
import ScenicKit

struct RouteDetailView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.openURL) private var openURL
    let route: RouteOption
    @State private var camera: MapCameraPosition = .automatic
    @State private var saved = false
    @State private var rated: Bool?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                RouteMap(routes: [route], selectedID: route.id, camera: $camera)
                    .frame(height: 240)
                    .clipShape(RoundedRectangle(cornerRadius: Theme.corner))

                HStack(spacing: 16) {
                    ScoreRing(score: route.score, color: Theme.color(for: Format.band(score: route.score)), size: 72)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(route.summary).font(Theme.headlineFont)
                        Text("\(Format.duration(minutes: route.minutes)) · \(Format.distance(km: route.km)) · \(Format.extra(minutes: route.extraMinutes))")
                            .font(.subheadline).foregroundStyle(.secondary).monospacedDigit()
                    }
                }

                driveButtons

                if let c = route.conditions { conditions(c) }

                if !route.advisories.isEmpty {
                    section("Good to know") {
                        ForEach(route.advisories, id: \.self) { a in
                            Label {
                                VStack(alignment: .leading) {
                                    Text(a.title).bold()
                                    Text(a.detail).font(.callout).foregroundStyle(.secondary)
                                }
                            } icon: {
                                Image(systemName: a.severity == "info" ? "info.circle" : "exclamationmark.triangle.fill")
                                    .foregroundStyle(a.severity == "info" ? Theme.ice : Theme.ember)
                            }
                        }
                    }
                }

                if !route.highlights.isEmpty {
                    section("Along the way") {
                        ForEach(route.highlights, id: \.self) { h in
                            HStack {
                                Text("km \(Int(h.atKm))").font(.caption.monospacedDigit()).foregroundStyle(.secondary).frame(width: 52, alignment: .leading)
                                Text(h.name)
                                Spacer()
                                Text(h.type.replacingOccurrences(of: "_", with: " ")).font(.caption).foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                section("Why it scores \(Int(route.score))") {
                    part("Scenery", route.parts.scenery)
                    if let v = route.parts.views { part("Views", v) }
                    if let r = route.parts.relief { part("Hills", r) }
                    part("Bends", route.parts.bends)
                    part("Variety", route.parts.variety)
                    if route.parts.motorwayPct > 0 { Text("\(Int(route.parts.motorwayPct))% motorway").font(.caption).foregroundStyle(.secondary) }
                }

                section("After your drive") {
                    HStack(spacing: 12) {
                        rateButton(up: true)
                        rateButton(up: false)
                    }
                    Text("Your ratings teach the app what beautiful means.").font(.caption).foregroundStyle(.secondary)
                }
            }
            .padding()
        }
        .accessibilityIdentifier("routeDetail")
        .navigationTitle(route.label)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button(saved ? "Saved" : "Save") { Task { await model.save(route: route); saved = true } }
                    .disabled(saved)
            }
        }
    }

    private var driveButtons: some View {
        VStack(spacing: 10) {
            Button {
                if let u = URL(string: route.handoff.googleMaps) { openURL(u) }
            } label: {
                Label("DRIVE WITH GOOGLE MAPS", systemImage: "car.fill").font(Theme.titleFont.weight(.heavy))
                    .foregroundStyle(Theme.onAccent).frame(maxWidth: .infinity).frame(minHeight: 52)
            }
            .buttonStyle(.borderedProminent)
            HStack {
                Button {
                    if let u = URL(string: route.handoff.appleMaps) { openURL(u) }
                } label: { Label("Apple Maps", systemImage: "map").frame(maxWidth: .infinity) }
                    .buttonStyle(.bordered)
                ShareLink(item: GPXFile(name: route.summary, route: route), preview: SharePreview("Scenic route GPX")) {
                    Label("GPX", systemImage: "square.and.arrow.up").frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
            }
            Text("Google Maps follows the scenic stops. Apple Maps only takes the first stop, so use it for short drives.")
                .font(.caption2).foregroundStyle(.secondary)
        }
    }

    private func conditions(_ c: Conditions) -> some View {
        section(Format.verdictText(c.verdict)) {
            HStack(spacing: 18) {
                if let t = Format.time(c.arrival) { stat("Arrive", t, "flag.checkered") }
                if let t = Format.time(c.sunset) { stat("Sunset", t, "sunset.fill") }
                if let w = c.weather.first { stat("Cloud", "\(Int(w.cloud))%", "cloud.sun") }
            }
            ForEach(c.notes, id: \.self) { n in
                Label(n, systemImage: "sparkle").font(.callout)
            }
        }
    }

    private func stat(_ title: String, _ value: String, _ icon: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Label(title, systemImage: icon).font(.caption).foregroundStyle(.secondary)
            Text(value).font(.headline.monospacedDigit())
        }
    }

    private func part(_ name: String, _ value: Double) -> some View {
        HStack {
            Text(name).frame(width: 70, alignment: .leading)
            ProgressView(value: value, total: 100).tint(Theme.accent)
            Text("\(Int(value))").font(.caption.monospacedDigit()).frame(width: 30, alignment: .trailing)
        }
    }

    private func rateButton(up: Bool) -> some View {
        Button {
            rated = up
            Task { await model.rate(route: route, up: up) }
        } label: {
            Label(up ? "Loved it" : "Not great", systemImage: up ? "hand.thumbsup.fill" : "hand.thumbsdown")
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)
        .tint(rated == up ? Theme.accent : Theme.ash)
        .disabled(rated != nil)
    }

    private func section<Content: View>(_ title: String, @ViewBuilder _ content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title.uppercased()).font(Theme.labelFont).tracking(1.4).foregroundStyle(Theme.ash)
            content()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

/// GPX export for ShareLink.
struct GPXFile: Transferable {
    let name: String
    let route: RouteOption

    static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(exportedContentType: .xml) { file in
            let url = FileManager.default.temporaryDirectory.appendingPathComponent("scenic-route.gpx")
            try GPX.make(name: file.name, line: file.route.line, stops: file.route.scenicStops).write(to: url, atomically: true, encoding: .utf8)
            return SentTransferredFile(url)
        }
    }
}
