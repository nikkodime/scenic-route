import SwiftUI
import ScenicKit

/// The Explore tab: scenic places within reach of where you are, found as soon as the tab opens.
struct ExploreHome: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        Group {
            if model.explore?.destinations.isEmpty == false {
                ExploreView()
                    .toolbar {
                        ToolbarItem(placement: .topBarTrailing) { spanMenu }
                    }
            } else {
                VStack(spacing: 0) {
                    Spacer()
                    IslandView(region: .tuscany).frame(height: 240)
                    if model.isExploring {
                        Text("Finding beautiful places near you").font(Theme.sofia(17, .medium)).foregroundStyle(Theme.ink).padding(.top, 12)
                        ProgressView().tint(Theme.green).padding(.top, 12)
                    } else {
                        Text(model.errorMessage ?? "Scenic places within reach").font(Theme.sofia(17, .medium)).foregroundStyle(Theme.ink)
                            .multilineTextAlignment(.center).padding(.top, 12)
                        HStack(spacing: 8) {
                            ForEach([(60, "1 h"), (120, "2 h"), (240, "Half day")], id: \.0) { opt in
                                Button { run(opt.0) } label: {
                                    Text(opt.1).font(Theme.sofia(15, .medium)).foregroundStyle(Theme.ink)
                                        .frame(maxWidth: .infinity, minHeight: 46)
                                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 12))
                                        .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(Theme.border))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.top, 18)
                        Button { model.mode = .explore; model.tab = .plan } label: {
                            Text("Start somewhere else").font(Theme.sofia(14, .medium)).foregroundStyle(Theme.green)
                        }
                        .padding(.top, 14)
                    }
                    Spacer()
                }
                .padding(.horizontal, 24)
                .frame(maxWidth: .infinity)
                .background(Theme.background)
                .toolbar(.hidden, for: .navigationBar)
            }
        }
        .task {
            if model.explore == nil, !model.isExploring { await model.runExplore() }
        }
    }

    private var spanMenu: some View {
        Menu {
            ForEach([(60, "Within 1 h"), (120, "Within 2 h"), (240, "Half day")], id: \.0) { opt in
                Button(opt.1) { run(opt.0) }
            }
        } label: {
            Image(systemName: "clock").font(.system(size: 15, weight: .semibold)).foregroundStyle(Theme.ink)
        }
        .accessibilityLabel("How far")
    }

    private func run(_ minutes: Int) {
        model.exploreMinutes = minutes
        model.roundTrip = false
        Task { await model.runExplore() }
    }
}
