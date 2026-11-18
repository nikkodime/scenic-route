import SwiftUI
import ScenicKit

/// The Explore tab: scenic places within reach of where you are, found as soon as the tab opens.
struct ExploreHome: View {
    @Environment(AppModel.self) private var model
    @State private var loop = false

    var body: some View {
        Group {
            if model.explore?.destinations.isEmpty == false {
                ExploreView()
                    .toolbar {
                        ToolbarItem(placement: .topBarLeading) {
                            Button { run(model.exploreMinutes, loop: !model.roundTrip) } label: {
                                Label(model.roundTrip ? "Loops" : "To a place", systemImage: model.roundTrip ? "arrow.triangle.2.circlepath" : "arrow.right")
                                    .labelStyle(.titleAndIcon).font(Theme.sofia(14, .semibold)).foregroundStyle(Theme.ink)
                            }
                            .accessibilityHint(model.roundTrip ? "Switch to places to drive to" : "Switch to loops from here")
                            .accessibilityIdentifier("loopToggle")
                        }
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
                        Text(model.errorMessage ?? (loop ? "A loop from here and back" : "Scenic places within reach")).font(Theme.sofia(17, .medium)).foregroundStyle(Theme.ink)
                            .multilineTextAlignment(.center).padding(.top, 12)
                        // One way to a place, or a round trip that comes back by another road.
                        HStack(spacing: 0) {
                            segment("To a place", symbol: "arrow.right", on: !loop) { loop = false }
                            segment("Loop", symbol: "arrow.triangle.2.circlepath", on: loop) { loop = true }
                        }
                        .padding(3).background(Theme.mist, in: RoundedRectangle(cornerRadius: 12))
                        .padding(.top, 16)
                        HStack(spacing: 8) {
                            ForEach([(60, "1 h"), (120, "2 h"), (240, "Half day")], id: \.0) { opt in
                                Button { run(opt.0, loop: loop) } label: {
                                    Text(opt.1).font(Theme.sofia(15, .medium)).foregroundStyle(Theme.ink)
                                        .frame(maxWidth: .infinity, minHeight: 46)
                                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 12))
                                        .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(Theme.border))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.top, 10)
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
        .onAppear { loop = model.roundTrip }
        .task {
            if model.explore == nil, !model.isExploring { await model.runExplore() }
        }
    }

    private var spanMenu: some View {
        Menu {
            Section("Places within") {
                ForEach([(60, "1 h"), (120, "2 h"), (240, "Half a day")], id: \.0) { opt in
                    Button(opt.1) { run(opt.0, loop: false) }
                }
            }
            Section("Loops from here") {
                ForEach([(60, "1 h loop"), (120, "2 h loop"), (240, "Half-day loop")], id: \.0) { opt in
                    Button(opt.1, systemImage: "arrow.triangle.2.circlepath") { run(opt.0, loop: true) }
                }
            }
        } label: {
            Image(systemName: "clock").font(.system(size: 15, weight: .semibold)).foregroundStyle(Theme.ink)
        }
        .accessibilityLabel("How far")
    }

    private func run(_ minutes: Int, loop: Bool) {
        model.exploreMinutes = minutes
        model.roundTrip = loop
        Task { await model.runExplore() }
    }

    private func segment(_ title: String, symbol: String, on: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Label(title, systemImage: symbol).font(Theme.sofia(14, .semibold))
                .foregroundStyle(on ? Theme.ink : Theme.ink3)
                .frame(maxWidth: .infinity, minHeight: 38)
                .background(on ? Theme.surface : .clear, in: RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(on ? .isSelected : [])
    }
}
