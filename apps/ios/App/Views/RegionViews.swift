import SwiftUI
import ScenicKit

/// A row of island cards, one per region: browse the scenic corners of Europe.
struct RegionShelf: View {
    var except: IslandRegion? = nil

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(IslandRegion.allCases.filter { $0 != except }) { r in
                    NavigationLink { RegionView(region: r) } label: { RegionCard(region: r) }
                        .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, Theme.gutter)
            .padding(.bottom, 4)
        }
    }
}

struct RegionCard: View {
    let region: IslandRegion
    var width: CGFloat = 150

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            IslandPoster(region: region)
                .scaleEffect(1.12)
                .frame(width: width - 12, height: width - 12)
                .background(LinearGradient(colors: [Theme.sky.opacity(0.8), Theme.tile], startPoint: .top, endPoint: .bottom),
                            in: RoundedRectangle(cornerRadius: 15))
                .clipShape(RoundedRectangle(cornerRadius: 15))
            Text(region.short).font(Theme.sofia(15, .semibold)).foregroundStyle(Theme.ink).padding(.horizontal, 6).padding(.top, 6)
            Text(region.country).font(Theme.sofia(12)).foregroundStyle(Theme.ink2).padding(.horizontal, 6)
        }
        .padding(6).padding(.bottom, 6)
        .frame(width: width)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).strokeBorder(Theme.border))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(region.title), \(region.country)")
    }
}

/// One region: the island fills the top of the screen (drag to turn it), one line, one action.
struct RegionView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.dismiss) private var dismiss
    let region: IslandRegion

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .bottom) {
                LinearGradient(colors: [Theme.sky, Theme.background], startPoint: .top, endPoint: UnitPoint(x: 0.5, y: 0.6))
                    .ignoresSafeArea()
                IslandView(region: region, fit: 1.08, lift: 0.18)
                    .frame(width: geo.size.width, height: geo.size.height + geo.safeAreaInsets.top)
                    .ignoresSafeArea(edges: .top)
                VStack(alignment: .leading, spacing: 0) {
                    Text(region.country.uppercased()).font(Theme.labelFont).tracking(1).foregroundStyle(Theme.ink2)
                    Text(region.title).font(Theme.sofia(30, .semibold, relativeTo: .title)).tracking(-0.6).foregroundStyle(Theme.ink)
                        .fixedSize(horizontal: false, vertical: true)
                    Text(region.line).font(Theme.sofia(15)).foregroundStyle(Theme.ink2).padding(.top, 6)
                        .fixedSize(horizontal: false, vertical: true)
                    HStack(spacing: 8) {
                        tile(distance, "from you")
                        tile(model.collectedIslands.contains(region) ? "Collected" : "Not yet", "your island")
                    }
                    .padding(.top, 16)
                    Button {
                        Task { await model.exploreRegion(region) }
                        dismiss()
                    } label: {
                        Text("Find drives here").font(Theme.buttonFont).foregroundStyle(Theme.onAccent)
                            .frame(maxWidth: .infinity, minHeight: 54)
                            .background(Theme.green, in: RoundedRectangle(cornerRadius: 16))
                    }
                    .buttonStyle(.plain)
                    .padding(.top, 16)
                    .accessibilityIdentifier("regionExplore")
                }
                .padding(.horizontal, Theme.gutter)
                .padding(.bottom, 16)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(.hidden, for: .navigationBar)
    }

    private var distance: String {
        guard let here = model.location.last else { return region.country }
        let km = region.km(lat: here.lat, lon: here.lon)
        return km < 25 ? "Here" : "\(LogbookView.km(km)) km"
    }

    private func tile(_ value: String, _ label: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(value).font(Theme.sofia(18, .semibold)).foregroundStyle(Theme.ink).monospacedDigit().lineLimit(1).minimumScaleFactor(0.7)
            Text(label).font(Theme.sofia(12)).foregroundStyle(Theme.ink2)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 12).padding(.vertical, 10)
        .background(Theme.surface.opacity(0.92), in: RoundedRectangle(cornerRadius: 14))
        .accessibilityElement(children: .combine)
    }
}

/// Every island, collected in colour, the rest as pale outlines: the logbook's second page.
struct IslandCollection: View {
    let collected: Set<IslandRegion>
    var newest: IslandRegion? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .firstTextBaseline) {
                Text("Islands").font(Theme.sofia(18, .medium)).foregroundStyle(Theme.ink)
                Spacer()
                Text("\(collected.count) of \(IslandRegion.allCases.count)").font(Theme.sofia(14, .medium)).foregroundStyle(Theme.ink2).monospacedDigit()
            }
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 4), spacing: 8) {
                ForEach(IslandRegion.allCases) { r in
                    let got = collected.contains(r)
                    NavigationLink { RegionView(region: r) } label: {
                        VStack(spacing: 0) {
                            IslandPoster(region: r, locked: !got).scaleEffect(1.08)
                                .aspectRatio(1, contentMode: .fit)
                            Text(r.short).font(Theme.sofia(11, got ? .semibold : .medium)).foregroundStyle(got ? Theme.ink : Theme.ink3)
                                .lineLimit(1).minimumScaleFactor(0.8).padding(.bottom, 8)
                        }
                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(r == newest ? Theme.green : Theme.border, lineWidth: r == newest ? 1.5 : 1))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("\(r.title), \(got ? "collected" : "not collected yet")")
                }
            }
            if collected.count < IslandRegion.allCases.count {
                Text("Drive a road in a region to bring its island home.").font(Theme.sofia(13)).foregroundStyle(Theme.ink2)
            }
        }
        .accessibilityElement(children: .contain)
    }
}

/// All regions as island cards, two to a row.
struct RegionsView: View {
    var body: some View {
        GeometryReader { geo in
            let w = (geo.size.width - Theme.gutter * 2 - 12) / 2
            ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                    Text("Regions").font(Theme.sofia(32, .medium, relativeTo: .title)).tracking(-0.5).foregroundStyle(Theme.ink)
                    Text("Eight landscapes worth the drive").font(Theme.sofia(14)).foregroundStyle(Theme.ink2).padding(.top, 4)
                    LazyVGrid(columns: [GridItem(.fixed(w), spacing: 12), GridItem(.fixed(w))], spacing: 12) {
                        ForEach(IslandRegion.allCases) { r in
                            NavigationLink { RegionView(region: r) } label: { RegionCard(region: r, width: w) }
                                .buttonStyle(.plain)
                        }
                    }
                    .padding(.top, 18)
                }
                .padding(.horizontal, Theme.gutter)
                .padding(.bottom, 24)
            }
        }
        .background(LinearGradient(colors: [Theme.sky, Theme.background], startPoint: .top, endPoint: UnitPoint(x: 0.5, y: 0.4)).ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
    }
}
