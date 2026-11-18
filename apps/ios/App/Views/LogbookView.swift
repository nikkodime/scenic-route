import SwiftUI
import ScenicKit

/// 07 Logbook: the year in kilometres, a passport page of stamps, recent drives.
struct LogbookView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        let drives = model.logbook
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                Text("YOUR LOGBOOK · \(String(Calendar.current.component(.year, from: Date())))")
                    .font(Theme.labelFont).tracking(1).foregroundStyle(Theme.ink2)
                if drives.isEmpty {
                    empty
                } else {
                    Text("\(Self.km(drives.reduce(0) { $0 + $1.km })) km of\nbeautiful roads")
                        .font(Theme.sofia(32, .medium, relativeTo: .title)).tracking(-0.5).foregroundStyle(Theme.ink)
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.top, 8)
                    Text(summary(drives)).font(Theme.sofia(14)).foregroundStyle(Theme.ink2).padding(.top, 8)
                    PassportPage(drives: Array(drives.prefix(6)), page: (drives.count + 5) / 6)
                        .padding(.top, 24)
                    HStack {
                        Text("Recent drives").font(Theme.sofia(18, .medium)).foregroundStyle(Theme.ink)
                        Spacer()
                        ShareLink(item: LogbookGPX(drives: drives), preview: SharePreview("Panoramica logbook GPX")) {
                            Text("Export GPX").font(Theme.sofia(14, .medium)).foregroundStyle(Theme.green)
                        }
                    }
                    .padding(.top, 28)
                    VStack(spacing: 0) {
                        ForEach(drives.prefix(20)) { d in
                            DriveRow(drive: d)
                                .contextMenu {
                                    Button("Remove from logbook", systemImage: "trash", role: .destructive) {
                                        Task { await model.deleteFromLogbook(d) }
                                    }
                                }
                            if d.id != drives.prefix(20).last?.id { Rectangle().fill(Theme.line).frame(height: 1).padding(.leading, 64) }
                        }
                    }
                    .padding(.top, 8)
                }
                if !model.trips.isEmpty {
                    NavigationLink { TripsView() } label: {
                        HStack {
                            Image(systemName: "bookmark").foregroundStyle(Theme.green)
                            Text("Saved routes").font(Theme.sofia(16, .medium)).foregroundStyle(Theme.ink)
                            Spacer()
                            Text("\(model.trips.count)").font(Theme.sofia(15)).foregroundStyle(Theme.ink2)
                            Image(systemName: "chevron.right").font(.system(size: 13, weight: .semibold)).foregroundStyle(Theme.ink3)
                        }
                        .padding(16)
                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16))
                        .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(Theme.border))
                    }
                    .buttonStyle(.plain)
                    .padding(.top, 28)
                }
            }
            .padding(.horizontal, Theme.gutter)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
        .background(SkyBackdrop())
        .toolbar(.hidden, for: .navigationBar)
    }

    private var empty: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Your first stamp is\none drive away")
                .font(Theme.sofia(32, .medium, relativeTo: .title)).tracking(-0.5).foregroundStyle(Theme.ink)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.top, 8)
            Text("Every drive you finish lands here as a stamp, with its score and the date.")
                .font(Theme.sofia(15)).foregroundStyle(Theme.ink2).padding(.top, 10)
                .fixedSize(horizontal: false, vertical: true)
            IslandView(region: .moselle).frame(height: 260).frame(maxWidth: .infinity).padding(.top, 16)
            Button { model.tab = .plan } label: {
                Text("Plan a drive").font(Theme.buttonFont).foregroundStyle(Theme.onAccent)
                    .frame(maxWidth: .infinity, minHeight: 54)
                    .background(Theme.green, in: RoundedRectangle(cornerRadius: 16))
            }
            .buttonStyle(.plain)
            .padding(.top, 16)
        }
    }

    private func summary(_ drives: [LoggedDrive]) -> String {
        let countries = Set(drives.compactMap(\.country)).count
        let avg = drives.map(\.score).reduce(0, +) / max(drives.count, 1)
        var parts = [drives.count == 1 ? "1 drive" : "\(drives.count) drives"]
        if countries > 0 { parts.append(countries == 1 ? "1 country" : "\(countries) countries") }
        parts.append("average score \(avg)")
        return parts.joined(separator: " · ")
    }

    static func km(_ v: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.locale = Locale(identifier: "en_GB")
        f.maximumFractionDigits = 0
        return f.string(from: NSNumber(value: v.rounded())) ?? "\(Int(v))"
    }
}

/// One page of the passport: stamps pressed at slightly random angles, some running off the edge.
struct PassportPage: View {
    let drives: [LoggedDrive]
    let page: Int
    /// Where each stamp lands (fractions of the page) and its shape, like the design board.
    private static let slots: [(x: CGFloat, y: CGFloat, visa: Bool)] = [
        (0.21, 0.34, false), (0.52, 0.30, true), (0.88, 0.35, false),
        (0.24, 0.73, true), (0.59, 0.75, false), (0.91, 0.75, false),
    ]

    var body: some View {
        GeometryReader { geo in
            let size = min(geo.size.width * 0.3, 112)
            ZStack(alignment: .topLeading) {
                ContourTexture()
                Text("PASSPORT · PAGE \(page)").font(Theme.labelFont).tracking(1).foregroundStyle(Theme.ink2)
                    .padding(14)
                ForEach(Array(drives.enumerated()), id: \.element.id) { i, d in
                    let slot = Self.slots[i % Self.slots.count]
                    let seed = d.stampSeed
                    StampView(score: d.score, place: d.place, date: d.date,
                              ink: StampInk.forScore(d.score, index: i),
                              shape: slot.visa ? .visa : .round,
                              size: slot.visa ? size * 0.92 : size,
                              rotation: Double(seed % 17) - 8, seed: seed)
                        .position(x: geo.size.width * slot.x, y: geo.size.height * slot.y)
                }
            }
        }
        .frame(height: 330)
        .background(Theme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).strokeBorder(Theme.border))
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Passport page \(page)")
    }
}

/// Faint contour lines, like the security print on a passport page.
private struct ContourTexture: View {
    var body: some View {
        Canvas { ctx, size in
            for i in 0..<14 {
                var p = Path()
                let y0 = size.height * CGFloat(i) / 12 - 20
                p.move(to: CGPoint(x: 0, y: y0))
                var x: CGFloat = 0
                while x <= size.width {
                    x += 8
                    let y = y0 + sin(x / 46 + CGFloat(i) * 0.7) * 9 + sin(x / 17 + CGFloat(i)) * 2.5
                    p.addLine(to: CGPoint(x: x, y: y))
                }
                ctx.stroke(p, with: .color(Theme.lake.opacity(0.07)), lineWidth: 0.8)
            }
        }
        .accessibilityHidden(true)
    }
}

private struct DriveRow: View {
    let drive: LoggedDrive

    var body: some View {
        HStack(spacing: 14) {
            MomentPhoto(candidates: [ScenicMoment(name: drive.place, type: "viewpoint", km: 0, coordinate: Coordinate(lat: drive.lat, lon: drive.lon))], showCredit: false)
                .frame(width: 50, height: 50)
                .clipShape(RoundedRectangle(cornerRadius: 10))
            VStack(alignment: .leading, spacing: 3) {
                Text(drive.name).font(Theme.sofia(15, .medium)).foregroundStyle(Theme.ink).lineLimit(1)
                Text(detail).font(Theme.sofia(13)).foregroundStyle(Theme.ink2)
            }
            Spacer(minLength: 8)
            Text("\(drive.score)").font(Theme.sofia(17, .medium)).foregroundStyle(Theme.green).monospacedDigit()
        }
        .padding(.vertical, 12)
        .accessibilityElement(children: .combine)
    }

    private var detail: String {
        var parts = [drive.date.formatted(.dateTime.day().month(.abbreviated)), "\(Int(drive.km.rounded())) km"]
        if drive.rating > 0 { parts.append("rated \(drive.rating)") }
        return parts.joined(separator: " · ")
    }
}

/// Every logged drive as one GPX file, a track each.
struct LogbookGPX: Transferable {
    let drives: [LoggedDrive]

    static var transferRepresentation: some TransferRepresentation {
        FileRepresentation(exportedContentType: .xml) { file in
            let url = FileManager.default.temporaryDirectory.appendingPathComponent("panoramica-logbook.gpx")
            try file.gpx.write(to: url, atomically: true, encoding: .utf8)
            return SentTransferredFile(url)
        }
    }

    var gpx: String {
        let iso = ISO8601DateFormatter()
        let tracks = drives.map { d -> String in
            let pts = Polyline.decode(d.polyline).map { String(format: "<trkpt lat=\"%.6f\" lon=\"%.6f\"/>", $0.lat, $0.lon) }.joined()
            let name = d.name.replacingOccurrences(of: "&", with: "&amp;").replacingOccurrences(of: "<", with: "&lt;")
            return "<trk><name>\(name)</name><desc>Scenic score \(d.score), \(iso.string(from: d.date))</desc><trkseg>\(pts)</trkseg></trk>"
        }.joined()
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><gpx version=\"1.1\" creator=\"Panoramica\" xmlns=\"http://www.topografix.com/GPX/1/1\">\(tracks)</gpx>"
    }
}
