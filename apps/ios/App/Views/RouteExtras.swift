import SwiftUI
import ScenicKit

// Route extras on the detail screen: leave in time for golden light, the weather where you'll be,
// stops worth making, and a card to share the drive. Each is its own view so a plan tier can hide it.

// MARK: Golden hour

/// "Leave 15:40 · Golden light at Pienza 16:42". One tap re-plans with that departure.
struct GoldenDepartureCard: View {
    let golden: GoldenDeparture
    let departure: String
    var onLeave: (Date) -> Void

    var body: some View {
        if golden.onTime {
            Label {
                Text("Golden light\(golden.place.map { " at \($0)" } ?? "") around \(Format.time(golden.reachAt) ?? "")")
            } icon: { Image(systemName: "sun.horizon.fill") }
            .font(Theme.sofia(14, .semibold)).foregroundStyle(Theme.terracotta)
            .padding(.horizontal, 12).padding(.vertical, 10)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.terracotta.opacity(0.10), in: RoundedRectangle(cornerRadius: 12))
        } else if let leave = ISO8601.parse(golden.leaveAt) {
            Button { onLeave(leave) } label: {
                HStack(spacing: 12) {
                    Image(systemName: "sun.horizon.fill").font(.system(size: 22, weight: .semibold)).foregroundStyle(Theme.terracotta)
                        .frame(width: 44, height: 44).background(Theme.terracotta.opacity(0.12), in: Circle())
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Leave \(tomorrow(leave) ? "tomorrow " : "")\(Format.time(golden.leaveAt) ?? "")")
                            .font(Theme.sofia(18, .bold)).monospacedDigit().foregroundStyle(Theme.ink)
                        Text("Golden light\(golden.place.map { " at \($0)" } ?? "") · \(Format.time(golden.reachAt) ?? "")")
                            .font(Theme.sofia(13, .medium)).foregroundStyle(Theme.ink2).lineLimit(1)
                    }
                    Spacer(minLength: 4)
                    Image(systemName: "arrow.clockwise").font(.system(size: 14, weight: .semibold)).foregroundStyle(Theme.terracotta)
                }
                .padding(12)
                .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16))
                .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(Theme.terracotta.opacity(0.35)))
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("goldenDeparture")
            .accessibilityHint("Plans again with this departure time")
        }
    }

    private func tomorrow(_ leave: Date) -> Bool {
        guard let dep = ISO8601.parse(departure) else { return false }
        return !Calendar.current.isDate(leave, inSameDayAs: dep)
    }
}

// MARK: Weather along the way

/// The forecast where you'll be, when you'll be there: time, icon, a number.
struct WeatherAlong: View {
    let samples: [WeatherSample]

    var body: some View {
        HStack(spacing: 8) {
            ForEach(samples, id: \.atKm) { w in
                VStack(spacing: 4) {
                    Text(Format.time(w.eta) ?? "").font(Theme.sofia(11, .medium)).monospacedDigit().foregroundStyle(Theme.ink3)
                    Image(systemName: Self.symbol(w)).symbolRenderingMode(.multicolor).font(.system(size: 19))
                    Text("\(Int((w.precipProb >= 30 ? w.precipProb : w.cloud).rounded()))%").font(Theme.sofia(14, .semibold)).monospacedDigit().foregroundStyle(Theme.ink)
                    Text("km \(Int(w.atKm))").font(Theme.sofia(10, .medium)).monospacedDigit().foregroundStyle(Theme.ink3)
                }
                .frame(maxWidth: .infinity).padding(.vertical, 10)
                .background(Theme.tile, in: RoundedRectangle(cornerRadius: 12))
                .accessibilityElement(children: .ignore)
                .accessibilityLabel("At \(Format.time(w.eta) ?? ""), km \(Int(w.atKm)): \(Int(w.cloud)) percent cloud, \(Int(w.precipProb)) percent chance of rain")
            }
        }
    }

    static func symbol(_ w: WeatherSample) -> String {
        if w.fog { return "cloud.fog.fill" }
        if w.precipProb >= 50 { return "cloud.rain.fill" }
        if w.cloud >= 60 { return "cloud.fill" }
        if w.cloud >= 30 { return "cloud.sun.fill" }
        return "sun.max.fill"
    }
}

// MARK: Stops worth making

enum StopStyle {
    static func symbol(_ kind: String) -> String {
        switch kind {
        case "viewpoint": "binoculars.fill"
        case "cafe": "cup.and.saucer.fill"
        case "agriturismo": "fork.knife"
        case "winery": "wineglass.fill"
        default: "mappin"
        }
    }
    static func reason(_ r: String) -> String {
        ["view": "Pull over", "coffee": "Coffee", "lunch": "Lunch", "wine": "Wine"][r] ?? r.capitalized
    }
}

/// Photo cards for viewpoints, icon cards for the rest; "Add" puts the stop on the route.
struct StopsSection: View {
    @Environment(AppModel.self) private var model
    let stops: [SuggestedStop]
    var onAdd: (SuggestedStop) -> Void
    @State private var photos: [String: Photo] = [:]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("WORTH A STOP").font(Theme.labelFont).tracking(0.8).foregroundStyle(Theme.ink3).padding(.horizontal, Theme.gutter)
            ScrollView(.horizontal) {
                LazyHStack(alignment: .top, spacing: 12) {
                    ForEach(stops) { s in card(s) }
                }
            }
            .contentMargins(.horizontal, Theme.gutter, for: .scrollContent)
            .scrollIndicators(.hidden)
        }
        .task(id: stops.map(\.id).joined()) {
            for s in stops where s.kind == "viewpoint" && !s.name.isEmpty {
                if let p = await model.photos(lat: s.lat, lon: s.lon, name: s.name.isEmpty ? nil : s.name).first { photos[s.id] = p }
            }
        }
        .accessibilityIdentifier("stopsSection")
    }

    private func card(_ s: SuggestedStop) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Group {
                if s.kind == "viewpoint" && !s.name.isEmpty {
                    CreditedPhoto(photo: photos[s.id], type: "viewpoint")
                } else {
                    Theme.greenTint.overlay {
                        Image(systemName: StopStyle.symbol(s.kind)).font(.system(size: 30, weight: .regular)).foregroundStyle(Theme.green)
                    }
                }
            }
            .frame(width: 148, height: 104)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(alignment: .topLeading) {
                Image(systemName: StopStyle.symbol(s.kind)).font(.system(size: 11, weight: .bold)).foregroundStyle(Theme.green)
                    .frame(width: 24, height: 24).background(.white, in: Circle()).padding(6)
            }
            Text(s.name.isEmpty ? "Viewpoint" : s.name).font(Theme.sofia(14, .semibold)).foregroundStyle(Theme.ink).lineLimit(1)
            Text("\(StopStyle.reason(s.reason)) · \(Format.time(s.eta) ?? "") · km \(Int(s.atKm))")
                .font(Theme.sofia(11, .medium)).monospacedDigit().foregroundStyle(Theme.ink3).lineLimit(1)
            Button { onAdd(s) } label: {
                Label("Add", systemImage: "plus").font(Theme.sofia(13, .semibold)).foregroundStyle(Theme.green)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Add \(s.name.isEmpty ? "viewpoint" : s.name) to the drive")
        }
        .frame(width: 148)
    }
}

// MARK: Share a drive

/// The route as a plain line on paper, scaled to fit, north up.
struct RouteShape: Shape {
    let line: [Coordinate]
    func path(in rect: CGRect) -> Path {
        var p = Path()
        guard line.count > 1 else { return p }
        let lats = line.map(\.lat), lons = line.map(\.lon)
        let minLat = lats.min()!, maxLat = lats.max()!, minLon = lons.min()!, maxLon = lons.max()!
        let k = cos((minLat + maxLat) / 2 * .pi / 180)
        let w = max((maxLon - minLon) * k, 1e-6), h = max(maxLat - minLat, 1e-6)
        let s = min(rect.width / w, rect.height / h)
        let ox = rect.minX + (rect.width - w * s) / 2, oy = rect.minY + (rect.height - h * s) / 2
        func pt(_ c: Coordinate) -> CGPoint { CGPoint(x: ox + (c.lon - minLon) * k * s, y: oy + (maxLat - c.lat) * s) }
        p.move(to: pt(line[0]))
        for c in line.dropFirst() { p.addLine(to: pt(c)) }
        return p
    }
}

/// 4:5 card for Instagram, WhatsApp and Messages: the best photo, the stamp, the route drawn on paper, three numbers.
struct ShareCardView: View {
    let route: RouteOption
    let title: String
    let photo: UIImage?
    let credit: String?

    var body: some View {
        VStack(spacing: 0) {
            Group {
                if let photo { Image(uiImage: photo).resizable().scaledToFill() }
                else { LinearGradient(colors: [Theme.greenTint, Theme.green.opacity(0.45)], startPoint: .top, endPoint: .bottom) }
            }
            .frame(width: 360, height: 252).clipped()
            .overlay(alignment: .topTrailing) {
                StampView(score: Int(route.score.rounded()), place: title.components(separatedBy: " → ").last ?? "", date: Date(), ink: Theme.green, size: 78, seed: route.rank)
                    .padding(3).background(.white.opacity(0.8), in: Circle()).padding(14)
            }
            .overlay(alignment: .bottomTrailing) {
                if let credit, photo != nil {
                    Text(credit).font(Theme.sofia(7, .medium)).foregroundStyle(.white.opacity(0.9)).shadow(radius: 1).padding(8)
                }
            }
            HStack(alignment: .top, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(title).font(Theme.sofia(21, .bold)).foregroundStyle(Theme.ink).lineLimit(2).minimumScaleFactor(0.7)
                    Text("\(Format.duration(minutes: route.minutes))  ·  \(Format.distance(km: route.km))")
                        .font(Theme.sofia(14, .semibold)).monospacedDigit().foregroundStyle(Theme.green)
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(Array(route.moments.prefix(4)), id: \.id) { m in
                            HStack(spacing: 6) {
                                Image(systemName: PlaceIcon.symbol(m.type)).frame(width: 14)
                                Text(m.name).lineLimit(1)
                            }
                            .font(Theme.sofia(11, .medium)).foregroundStyle(Theme.ink2)
                        }
                    }
                    .padding(.top, 4)
                }
                Spacer(minLength: 0)
                ZStack {
                    RouteShape(line: route.line).stroke(.white, style: StrokeStyle(lineWidth: 7, lineCap: .round, lineJoin: .round))
                    RouteShape(line: route.line).stroke(Theme.green, style: StrokeStyle(lineWidth: 3.5, lineCap: .round, lineJoin: .round))
                }
                .frame(width: 112, height: 112)
            }
            .padding(.horizontal, 22).padding(.top, 20)
            Spacer(minLength: 0)
            Rectangle().fill(Theme.line).frame(height: 1).padding(.horizontal, 22)
            HStack {
                Image("Wordmark").resizable().scaledToFit().frame(height: 18)
                Spacer()
                Text(Date().formatted(date: .long, time: .omitted)).font(Theme.sofia(10, .medium)).foregroundStyle(Theme.ink3)
            }
            .padding(.horizontal, 22).padding(.vertical, 14)
        }
        .frame(width: 360, height: 450)
        .background(Theme.paper)
    }
}

/// A rendered card ready for the share sheet.
struct SharedDrive: Transferable {
    let image: UIImage
    let title: String
    static var transferRepresentation: some TransferRepresentation {
        DataRepresentation(exportedContentType: .png) { $0.image.pngData() ?? Data() }
            .suggestedFileName { _ in "panoramica-drive.png" }
    }
}

extension AppModel {
    /// "Siena → Pienza", or "Siena loop via Pienza".
    var shareTitle: String {
        let short = { (p: Place?) in p?.label?.components(separatedBy: ",").first ?? "" }
        let from = short(origin ?? explore?.origin)
        let start = from.isEmpty || from == "Current location" ? "Here" : from
        if let loopVia { return "\(start) loop via \(short(loopVia))" }
        return "\(start) → \(short(destination))"
    }

    /// Render the share card for a route: the best photo along it (downloaded), then the card at 3× (1080 × 1350).
    func shareCard(for route: RouteOption) async -> SharedDrive? {
        var image: UIImage?, credit: String?
        for m in route.heroCandidates.prefix(4) {
            guard let p = await photos(lat: m.coordinate.lat, lon: m.coordinate.lon, name: m.name).first, let url = URL(string: p.url) else { continue }
            if let (data, _) = try? await URLSession.shared.data(from: url), let img = UIImage(data: data) { image = img; credit = p.credit; break }
        }
        let renderer = ImageRenderer(content: ShareCardView(route: route, title: shareTitle, photo: image, credit: credit))
        renderer.scale = 3
        guard let ui = renderer.uiImage else { return nil }
        return SharedDrive(image: ui, title: shareTitle)
    }
}
