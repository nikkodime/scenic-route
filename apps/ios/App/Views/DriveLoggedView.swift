import SwiftUI
import ScenicKit

/// 06 Drive logged: the stamp lands, four numbers, one question, one action.
struct DriveLoggedView: View {
    @Environment(AppModel.self) private var model
    let drive: LoggedDrive
    @State private var rating = 0
    @State private var landed = false
    @State private var card: SharedDrive?

    var body: some View {
        VStack(spacing: 0) {
            // The region's island rises in (a new one joins the collection), the stamp lands beside it.
            ZStack(alignment: .bottomTrailing) {
                IslandView(region: region, fit: 1.05, lift: 0.04, interactive: false)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .padding(.horizontal, -24)
                StampView(score: drive.score, place: drive.place, date: drive.date,
                          ink: StampInk.forScore(drive.score, index: model.logbook.count),
                          size: 118, rotation: -8, seed: drive.stampSeed)
                    .scaleEffect(landed ? 1 : 1.35)
                    .opacity(landed ? 1 : 0)
                    .animation(.spring(response: 0.35, dampingFraction: 0.55).delay(0.6), value: landed)
                    .offset(x: 4, y: 6)
            }
            .overlay(alignment: .top) {
                if isNewIsland {
                    Text("NEW ISLAND · \(region.short.uppercased())").font(Theme.labelFont).tracking(1).foregroundStyle(Theme.green)
                        .padding(.horizontal, 10).frame(height: 24)
                        .background(Theme.surface.opacity(0.9), in: Capsule())
                        .padding(.top, 6)
                }
            }
            .frame(minHeight: 220, maxHeight: 330)
            Text("Drive logged")
                .font(Theme.sofia(30, .semibold, relativeTo: .title)).tracking(-0.4).foregroundStyle(Theme.ink)
                .padding(.top, 8)
            Text(sentence)
                .font(Theme.sofia(15)).foregroundStyle(Theme.ink2).multilineTextAlignment(.center).lineSpacing(3)
                .padding(.top, 10).padding(.horizontal, 12)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 0) {
                stat("\(Int(drive.km.rounded())) km", "distance")
                stat(Format.duration(minutes: drive.minutes), "driving")
                stat("+\(Int(drive.extraMinutes.rounded()))", "minutes")
                stat("\(drive.viewpoints)", "viewpoints")
            }
            .padding(.vertical, 16)
            .overlay(alignment: .top) { Rectangle().fill(Theme.line).frame(height: 1) }
            .overlay(alignment: .bottom) { Rectangle().fill(Theme.line).frame(height: 1) }
            .padding(.top, 22)

            Text("How were the views?").font(Theme.sofia(15, .medium)).foregroundStyle(Theme.ink).padding(.top, 24)
            HStack(spacing: 8) {
                ForEach(1...5, id: \.self) { n in
                    Button { rating = n } label: {
                        Text("\(n)").font(Theme.sofia(15, .medium)).foregroundStyle(rating == n ? Theme.greenDark : Theme.ink)
                            .frame(maxWidth: .infinity, minHeight: 44)
                            .background(rating == n ? Theme.greenTint : Theme.surface, in: RoundedRectangle(cornerRadius: 12))
                            .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(rating == n ? Theme.green : Theme.border, lineWidth: rating == n ? 1.5 : 1))
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("\(n) of 5")
                    .accessibilityAddTraits(rating == n ? .isSelected : [])
                }
            }
            .padding(.top, 12)
            HStack {
                Text("Flat"); Spacer(); Text("Breathtaking")
            }
            .font(Theme.sofia(12)).foregroundStyle(Theme.ink3).padding(.top, 8)

            Spacer(minLength: 20)
            HStack(spacing: 10) {
                Button {
                    var d = drive
                    d.rating = rating
                    Task { await model.addToLogbook(d) }
                } label: {
                    Text("Add to logbook").font(Theme.buttonFont).foregroundStyle(Theme.onAccent)
                        .frame(maxWidth: .infinity, minHeight: 54)
                        .background(Theme.green, in: RoundedRectangle(cornerRadius: 16))
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("addToLogbook")
                Group {
                    // The island story card when it has rendered, the sentence until then.
                    if let card {
                        ShareLink(item: card, message: Text(shareText), preview: SharePreview(drive.name, image: Image(uiImage: card.image))) { shareIcon }
                    } else {
                        ShareLink(item: shareText) { shareIcon }
                    }
                }
                .accessibilityLabel("Share")
                .accessibilityIdentifier("shareDrive")
            }
        }
        .padding(.horizontal, 24)
        .padding(.bottom, 12)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(SkyBackdrop())
        .overlay(alignment: .topTrailing) {
            Button { model.cancelDrive() } label: {
                Image(systemName: "xmark").font(.system(size: 13, weight: .semibold)).foregroundStyle(Theme.ink2)
                    .frame(width: 34, height: 34).background(Theme.surface.opacity(0.8), in: Circle())
            }
            .padding(16)
            .accessibilityLabel("Don't log this drive")
        }
        .onAppear { landed = true; card = drive.islandShareCard() }
    }

    private var region: IslandRegion {
        IslandRegion.containing(lat: drive.lat, lon: drive.lon) ?? .nearest(lat: drive.lat, lon: drive.lon)
    }

    /// The first drive in a region brings its island into the logbook.
    private var isNewIsland: Bool {
        guard let r = IslandRegion.containing(lat: drive.lat, lon: drive.lon) else { return false }
        return !model.collectedIslands.contains(r)
    }

    private var sentence: String {
        var s = drive.name
        if !drive.place.isEmpty, drive.place != drive.name, !drive.name.contains(drive.place) { s += " by \(drive.place)" }
        s += "."
        if model.isBestThisMonth(drive.score), !model.logbook.isEmpty { s += " Your best score this month." }
        return s
    }

    private var shareIcon: some View {
        Image(systemName: "square.and.arrow.up").font(.system(size: 18, weight: .semibold)).foregroundStyle(Theme.ink)
            .frame(width: 54, height: 54)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16))
            .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(Theme.border))
    }

    private var shareText: String {
        "\(drive.name): \(Int(drive.km.rounded())) km of beautiful road, scenic score \(drive.score). Planned with Panoramica."
    }

    private func stat(_ value: String, _ label: String) -> some View {
        VStack(spacing: 4) {
            Text(value).font(Theme.sofia(21, .medium)).foregroundStyle(Theme.ink).monospacedDigit().lineLimit(1).minimumScaleFactor(0.7)
            Text(label).font(Theme.sofia(12)).foregroundStyle(Theme.ink2)
        }
        .frame(maxWidth: .infinity)
        .accessibilityElement(children: .combine)
    }
}

/// The pale sky behind the stamp screens: a hint of the island morning, fading into paper.
struct SkyBackdrop: View {
    var body: some View {
        LinearGradient(colors: [Color(red: 0.87, green: 0.91, blue: 0.93), Theme.background], startPoint: .top, endPoint: UnitPoint(x: 0.5, y: 0.45))
            .ignoresSafeArea()
    }
}
