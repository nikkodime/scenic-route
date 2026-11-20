import SwiftUI
import ScenicKit

/// 01 Welcome: a big live island over the morning sky, one line of promise, one action.
/// Every few seconds the island sinks away and the next region rises; drag to turn it.
struct WelcomeView: View {
    var onStart: () -> Void
    @State private var region: IslandRegion = .tuscany
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    private let timer = Timer.publish(every: 9, on: .main, in: .common).autoconnect()

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .top) {
                LinearGradient(colors: [Theme.sky, Theme.background], startPoint: .top, endPoint: UnitPoint(x: 0.5, y: 0.62))
                    .ignoresSafeArea()
                IslandView(region: region, fit: 1.08, lift: 0.02)
                    .frame(width: geo.size.width, height: geo.size.height * 0.66 + geo.safeAreaInsets.top)
                    .ignoresSafeArea(edges: .top)

                VStack(alignment: .leading, spacing: 0) {
                    Image("Wordmark").resizable().scaledToFit().frame(height: 24)
                        .accessibilityLabel("Panoramica")
                        .padding(.top, 12)
                    Spacer()
                    regionTag.frame(maxWidth: .infinity)
                        .padding(.bottom, 22)
                    Text("Take the\nbeautiful way.")
                        .font(Theme.sofia(44, .semibold, relativeTo: .largeTitle)).tracking(-1.1)
                        .foregroundStyle(Theme.ink)
                        .fixedSize(horizontal: false, vertical: true)
                    Text("Scenic roads across Europe, from Tuscany to the fjords.")
                        .font(Theme.sofia(16)).foregroundStyle(Theme.ink2).lineSpacing(3)
                        .padding(.top, 12)
                        .fixedSize(horizontal: false, vertical: true)
                    Button(action: onStart) {
                        HStack(spacing: 10) {
                            Text("Plan a drive").font(Theme.buttonFont)
                            Image(systemName: "arrow.right").font(.system(size: 15, weight: .semibold))
                        }
                        .foregroundStyle(Theme.onAccent)
                        .frame(maxWidth: .infinity, minHeight: 56)
                        .background(Theme.green, in: RoundedRectangle(cornerRadius: 16))
                    }
                    .buttonStyle(.plain)
                    .padding(.top, 26)
                    .accessibilityIdentifier("welcomeStart")
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 16)
            }
        }
        .onReceive(timer) { _ in
            guard !reduceMotion else { return }
            step(1)
        }
    }

    private func step(_ by: Int) {
        let all = IslandRegion.allCases
        let next = all[(all.firstIndex(of: region)! + by + all.count) % all.count]
        // The engine sinks the old island first; the label follows once the new one is rising.
        region = next
    }

    private var regionTag: some View {
        Button { step(1) } label: {
            HStack(spacing: 10) {
                Text(region.title).font(Theme.sofia(13, .medium)).foregroundStyle(Theme.ink)
                    .contentTransition(.opacity)
                    .animation(.easeInOut(duration: 0.4).delay(0.45), value: region)
                HStack(spacing: 4) {
                    ForEach(IslandRegion.allCases) { r in
                        Capsule().fill(r == region ? Theme.green : Theme.line)
                            .frame(width: r == region ? 16 : 5, height: 5)
                    }
                }
                .animation(.easeInOut(duration: 0.3), value: region)
            }
            .padding(.horizontal, 12).frame(height: 30)
            .background(Theme.surface.opacity(0.92), in: Capsule())
            .shadow(color: Theme.ink.opacity(0.06), radius: 8, y: 2)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(region.title)
        .accessibilityHint("Shows the next region")
    }
}
