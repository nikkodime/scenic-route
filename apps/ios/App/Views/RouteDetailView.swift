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
    @State private var page = 0
    @State private var photos: [String: Photo] = [:]

    private var moments: [ScenicMoment] { route.moments }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                hero
                metrics.padding(.horizontal, Theme.gutter)
                scoreParts.padding(.horizontal, Theme.gutter)
                if let f = model.fastest(for: route) { VsFastestSection(route: route, fastest: f).padding(.horizontal, Theme.gutter) }
                if moments.contains(where: { photos[$0.id] != nil }) { highlightStrip }
                if let e = route.elevation, e.count > 1 {
                    ElevationProfile(samples: e, sunset: Format.time(route.conditions?.sunset)).padding(.horizontal, Theme.gutter)
                }
                if let c = route.conditions { light(c).padding(.horizontal, Theme.gutter) }
                if !route.advisories.isEmpty { goodToKnow.padding(.horizontal, Theme.gutter) }
                rating.padding(.horizontal, Theme.gutter)
            }
            .padding(.bottom, 110)
        }
        .background(Theme.background)
        .task(id: route.id) { photos = await model.distinctPhotos(for: Array(moments.prefix(10))) }
        .safeAreaInset(edge: .bottom) { driveBar }
        .accessibilityIdentifier("routeDetail")
        .navigationTitle(route.label)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button { Task { await model.save(route: route); saved = true } } label: {
                    Image(systemName: saved ? "bookmark.fill" : "bookmark")
                }
                .disabled(saved)
                .accessibilityLabel(saved ? "Saved" : "Save")
            }
        }
    }

    // MARK: Hero: the route's best moments, swipeable, the map last.

    private var hero: some View {
        TabView(selection: $page) {
            ForEach(Array(route.heroCandidates.filter { photos[$0.id] != nil }.prefix(4).enumerated()), id: \.element.id) { i, m in
                CreditedPhoto(photo: photos[m.id], type: m.type)
                    .overlay(alignment: .bottomLeading) { caption(m) }
                    .tag(i)
            }
            RouteMap(routes: [route], selectedID: route.id, camera: $camera, fastest: model.fastest(for: route)?.line ?? [])
                .tag(99)
        }
        .tabViewStyle(.page(indexDisplayMode: .always))
        .onChange(of: photos.isEmpty) { _, empty in page = empty ? 99 : 0 }
        .frame(height: 310)
        .overlay(alignment: .topTrailing) {
            if page != 99 {
                StampView(score: Int(route.score.rounded()), place: model.destinationShortName, date: Date(), ink: Theme.green, size: 96, seed: route.rank)
                    .padding(4)
                    .background(.white.opacity(0.72), in: Circle())
                    .padding(14)
            }
        }
    }

    private func caption(_ m: ScenicMoment) -> some View {
        HStack(spacing: 6) {
            Image(systemName: PlaceIcon.symbol(m.type))
            Text(m.name).lineLimit(1)
        }
        .font(Theme.sofia(15, .semibold)).foregroundStyle(.white)
        .padding(.horizontal, 12).padding(.vertical, 7)
        .background(.black.opacity(0.32), in: Capsule())
        .padding(.leading, 16).padding(.bottom, 34)
    }

    // MARK: Numbers instead of a sentence.

    private var metrics: some View {
        HStack(spacing: 0) {
            stat("clock", Format.duration(minutes: route.minutes), "Drive")
            stat("road.lanes", Format.distance(km: route.km), "Distance")
            stat("plus.circle", route.extraMinutes >= 1 ? "\(Int(route.extraMinutes.rounded())) min" : "0", "Extra")
        }
    }

    private func stat(_ symbol: String, _ value: String, _ label: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Image(systemName: symbol).font(.system(size: 14, weight: .semibold)).foregroundStyle(Theme.green)
            Text(value).font(Theme.sofia(20, .semibold)).monospacedDigit().foregroundStyle(Theme.ink).lineLimit(1).minimumScaleFactor(0.7)
            Text(label).font(Theme.labelFont).foregroundStyle(Theme.ink3)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }

    // MARK: Why it's scenic: numbered photos in driving order.

    private var highlightStrip: some View {
        VStack(alignment: .leading, spacing: 12) {
            eyebrow("Highlights").padding(.horizontal, Theme.gutter)
            ScrollView(.horizontal) {
                LazyHStack(alignment: .top, spacing: 12) {
                    ForEach(Array(moments.prefix(10).filter { photos[$0.id] != nil }.enumerated()), id: \.element.id) { i, m in
                        VStack(alignment: .leading, spacing: 6) {
                            CreditedPhoto(photo: photos[m.id], type: m.type)
                                .frame(width: 128, height: 118)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .overlay(alignment: .topLeading) {
                                    Text("\(i + 1)").font(Theme.sofia(12, .bold)).foregroundStyle(.white)
                                        .frame(width: 22, height: 22).background(Theme.green, in: Circle())
                                        .padding(6)
                                }
                            Text(m.name).font(Theme.sofia(13, .semibold)).foregroundStyle(Theme.ink).lineLimit(1)
                            HStack(spacing: 4) {
                                Image(systemName: PlaceIcon.symbol(m.type))
                                Text("km \(Int(m.km))").monospacedDigit()
                            }
                            .font(Theme.sofia(11, .medium)).foregroundStyle(Theme.ink3)
                        }
                        .frame(width: 128)
                        .accessibilityElement(children: .combine)
                    }
                }
            }
            .contentMargins(.horizontal, Theme.gutter, for: .scrollContent)
            .scrollIndicators(.hidden)
        }
    }

    // MARK: Light and weather as tiles; sentences only behind a chip.

    private func light(_ c: Conditions) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            eyebrow(Format.verdictText(c.verdict))
            HStack(spacing: 10) {
                if let t = Format.time(c.departure) { tile("car.fill", t, "Leave") }
                if let t = Format.time(c.arrival) { tile("flag.checkered", t, "Arrive") }
                if let t = Format.time(c.sunset) { tile("sunset.fill", t, "Sunset", tint: Theme.terracotta) }
                if let w = c.weather.first { tile(w.precipProb > 40 ? "cloud.rain.fill" : w.cloud > 60 ? "cloud.fill" : "sun.max.fill", "\(Int(w.cloud))%", "Cloud") }
            }
            let flags = lightFlags(c)
            if !flags.isEmpty {
                ChipFlow(spacing: 8) {
                    ForEach(flags, id: \.label) { f in
                        Label(f.label, systemImage: f.symbol)
                            .font(Theme.sofia(13, .semibold)).foregroundStyle(f.tint)
                            .padding(.horizontal, 11).padding(.vertical, 7)
                            .background(f.tint.opacity(0.10), in: RoundedRectangle(cornerRadius: 10))
                            .accessibilityLabel(c.notes.joined(separator: ". "))
                    }
                }
            }
        }
    }

    private func lightFlags(_ c: Conditions) -> [(label: String, symbol: String, tint: Color)] {
        var out: [(String, String, Color)] = []
        if c.arrivesAfterDark { out.append(("After dark", "moon.stars.fill", Theme.ink2)) }
        if c.goldenHour != nil { out.append(("Golden hour", "sun.horizon.fill", Theme.terracotta)) }
        if !c.glare.isEmpty { out.append(("Low sun", "sun.max.trianglebadge.exclamationmark", Theme.terracotta)) }
        if c.weather.contains(where: { $0.fog }) { out.append(("Fog", "cloud.fog.fill", Theme.ink2)) }
        else if c.weather.contains(where: { $0.precipProb > 50 }) { out.append(("Rain", "cloud.rain.fill", Theme.lake)) }
        return out.map { (label: $0.0, symbol: $0.1, tint: $0.2) }
    }

    private func tile(_ symbol: String, _ value: String, _ label: String, tint: Color = Theme.ink) -> some View {
        VStack(spacing: 4) {
            Image(systemName: symbol).font(.system(size: 15, weight: .semibold)).foregroundStyle(tint == Theme.ink ? Theme.green : tint)
            Text(value).font(Theme.sofia(16, .semibold)).monospacedDigit().foregroundStyle(Theme.ink).lineLimit(1).minimumScaleFactor(0.7)
            Text(label).font(Theme.sofia(11, .medium)).foregroundStyle(Theme.ink3)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 12)
        .background(Theme.tile, in: RoundedRectangle(cornerRadius: 14))
        .accessibilityElement(children: .combine)
    }

    // MARK: Warnings as chips.

    private var goodToKnow: some View {
        VStack(alignment: .leading, spacing: 12) {
            eyebrow("Good to know")
            ChipFlow(spacing: 8) {
                ForEach(route.advisories, id: \.self) { AdvisoryChip(advisory: $0) }
            }
        }
    }

    // MARK: The score, as four small rings.

    private var scoreParts: some View {
        HStack(spacing: 0) {
            ForEach(route.scorePairs, id: \.label) { partRing($0.symbol, $0.value, $0.label, tint: $0.tint) }
        }
        .padding(.vertical, 16)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(Theme.border))
    }

    private func partRing(_ symbol: String, _ value: Double, _ label: String, tint: Color = Theme.green) -> some View {
        VStack(spacing: 6) {
            ZStack {
                Circle().stroke(Theme.mist, lineWidth: 5)
                Circle().trim(from: 0, to: max(0.02, value / 100)).stroke(tint, style: StrokeStyle(lineWidth: 5, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                VStack(spacing: 0) {
                    Image(systemName: symbol).font(.system(size: 11, weight: .semibold)).foregroundStyle(Theme.ink3)
                    Text("\(Int(value))").font(Theme.sofia(15, .bold)).monospacedDigit().foregroundStyle(Theme.ink)
                }
            }
            .frame(width: 58, height: 58)
            Text(label).font(Theme.sofia(11, .medium)).foregroundStyle(Theme.ink3)
        }
        .frame(maxWidth: .infinity)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("\(label) \(Int(value)) out of 100")
    }

    private var rating: some View {
        HStack(spacing: 12) {
            eyebrow("Drove it?")
            Spacer()
            rateButton(up: true)
            rateButton(up: false)
        }
    }

    private func rateButton(up: Bool) -> some View {
        Button {
            rated = up
            Task { await model.rate(route: route, up: up) }
        } label: {
            Image(systemName: up ? (rated == true ? "hand.thumbsup.fill" : "hand.thumbsup") : (rated == false ? "hand.thumbsdown.fill" : "hand.thumbsdown"))
                .font(.system(size: 17, weight: .semibold))
                .frame(width: 46, height: 46)
                .background(Theme.surface, in: Circle())
                .overlay(Circle().strokeBorder(Theme.border))
        }
        .buttonStyle(.plain)
        .foregroundStyle(rated == up ? Theme.green : Theme.ink2)
        .disabled(rated != nil)
        .accessibilityLabel(up ? "Loved it" : "Not great")
    }

    // MARK: One action: drive. Everything else is behind "Send".

    private var driveBar: some View {
        HStack(spacing: 10) {
            Button { model.startDrive(route) } label: {
                Text("Start drive").font(Theme.buttonFont)
                    .foregroundStyle(Theme.onAccent).frame(maxWidth: .infinity).frame(minHeight: 52)
                    .background(Theme.green, in: RoundedRectangle(cornerRadius: 16))
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("startDrive")
            .accessibilityHint("Turn-by-turn in Panoramica")
            Button { if let u = URL(string: route.handoff.googleMaps) { openURL(u) } } label: {
                Text("Google Maps").font(Theme.sofia(16, .medium)).foregroundStyle(Theme.ink)
                    .padding(.horizontal, 16).frame(minHeight: 52)
                    .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16))
                    .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(Theme.border))
            }
            .buttonStyle(.plain)
            .contextMenu {
                Button("Open in Apple Maps", systemImage: "map") { if let u = URL(string: route.handoff.appleMaps) { openURL(u) } }
            }
            ShareLink(item: GPXFile(name: route.summary, route: route), preview: SharePreview("Scenic route GPX")) {
                squareIcon("arrow.down.to.line")
            }
            .accessibilityLabel("Save GPX for offline")
        }
        .padding(.horizontal, Theme.gutter).padding(.vertical, 10)
        .background(.regularMaterial)
    }

    private func squareIcon(_ symbol: String) -> some View {
        Image(systemName: symbol).font(.system(size: 18, weight: .semibold))
            .foregroundStyle(Theme.ink).frame(width: 52, height: 52)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16))
            .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(Theme.border))
    }

    private func eyebrow(_ text: String) -> some View {
        Text(text.uppercased()).font(Theme.labelFont).tracking(0.8).foregroundStyle(Theme.ink3)
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
