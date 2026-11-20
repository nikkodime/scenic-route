import SwiftUI
import ScenicKit

/// 9:16 story card for a finished drive: the region's island floating on the morning sky, the drive's name,
/// three numbers, the stamp and the route line. Rendered at 3× (1080 × 1920) for Stories, WhatsApp and Messages.
struct IslandShareCardView: View {
    let drive: LoggedDrive
    let region: IslandRegion

    var body: some View {
        ZStack(alignment: .topLeading) {
            LinearGradient(colors: [Theme.sky, Color(red: 0.93, green: 0.945, blue: 0.925), Theme.paper],
                           startPoint: .top, endPoint: .bottom)
            IslandPoster(region: region)
                .frame(width: 430, height: 430)
                .position(x: 180, y: 360)
            VStack(alignment: .leading, spacing: 0) {
                Text(region.title.uppercased()).font(Theme.sofia(10, .semibold)).tracking(1.2).foregroundStyle(Theme.ink2)
                Text(drive.name).font(Theme.sofia(30, .semibold)).tracking(-0.6).foregroundStyle(Theme.ink)
                    .lineLimit(2).minimumScaleFactor(0.7).padding(.top, 4)
                Text(numbers).font(Theme.sofia(13, .medium)).monospacedDigit().foregroundStyle(Theme.green).padding(.top, 6)
                Spacer()
                HStack(alignment: .bottom) {
                    StampView(score: drive.score, place: drive.place, date: drive.date, ink: StampInk.forScore(drive.score, index: 0),
                              size: 92, rotation: -9, seed: drive.stampSeed)
                    Spacer()
                    let line = Polyline.decode(drive.polyline)
                    if line.count > 1 {
                        ZStack {
                            RouteShape(line: line).stroke(.white, style: StrokeStyle(lineWidth: 6, lineCap: .round, lineJoin: .round))
                            RouteShape(line: line).stroke(Theme.green, style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round))
                        }
                        .frame(width: 92, height: 92)
                    }
                }
                Rectangle().fill(Theme.line).frame(height: 1).padding(.top, 18)
                HStack {
                    Image("Wordmark").resizable().scaledToFit().frame(height: 16)
                    Spacer()
                    Text(drive.date.formatted(date: .long, time: .omitted)).font(Theme.sofia(10, .medium)).foregroundStyle(Theme.ink3)
                }
                .padding(.top, 12)
            }
            .padding(.horizontal, 24).padding(.top, 34).padding(.bottom, 22)
        }
        .frame(width: 360, height: 640)
        .clipped()
    }

    private var numbers: String {
        var parts = ["\(Int(drive.km.rounded())) km", Format.duration(minutes: drive.minutes)]
        if drive.viewpoints > 0 { parts.append(drive.viewpoints == 1 ? "1 viewpoint" : "\(drive.viewpoints) viewpoints") }
        return parts.joined(separator: "  ·  ")
    }
}

extension LoggedDrive {
    /// The island story card, ready for the share sheet.
    @MainActor func islandShareCard() -> SharedDrive? {
        let region = IslandRegion.containing(lat: lat, lon: lon) ?? .nearest(lat: lat, lon: lon)
        let renderer = ImageRenderer(content: IslandShareCardView(drive: self, region: region).environment(\.colorScheme, .light))
        renderer.scale = 3
        guard let ui = renderer.uiImage else { return nil }
        return SharedDrive(image: ui, title: name)
    }
}
