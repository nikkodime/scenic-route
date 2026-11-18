import SwiftUI
import ScenicKit

/// 01 Welcome: the island floats above the paper, one line of promise, one action.
struct WelcomeView: View {
    var onStart: () -> Void
    @State private var region: IslandRegion = .tuscany
    private let timer = Timer.publish(every: 12, on: .main, in: .common).autoconnect()

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .top) {
                Theme.background.ignoresSafeArea()
                IslandView(region: region, fill: true)
                    .frame(width: geo.size.width, height: geo.size.height * 0.58 + geo.safeAreaInsets.top)
                    .clipped()
                    .overlay(alignment: .bottom) {
                        LinearGradient(colors: [Theme.background.opacity(0), Theme.background], startPoint: .top, endPoint: .bottom)
                            .frame(height: 120)
                    }
                    .ignoresSafeArea(edges: .top)
                    .transition(.opacity)

                VStack(alignment: .leading, spacing: 0) {
                    Image("Wordmark").resizable().scaledToFit().frame(height: 24)
                        .accessibilityLabel("Panoramica")
                        .padding(.top, 12)
                    Spacer()
                    regionTag.frame(maxWidth: .infinity)
                        .padding(.bottom, 26)
                    Text("Take the\nbeautiful way.")
                        .font(Theme.sofia(44, .semibold, relativeTo: .largeTitle)).tracking(-1.1)
                        .foregroundStyle(Theme.ink)
                        .fixedSize(horizontal: false, vertical: true)
                    Text("Tell us how much time you have. We find the road with the views, the bends and the best light, from Tuscany to the Norwegian fjords.")
                        .font(Theme.sofia(16)).foregroundStyle(Theme.ink2).lineSpacing(3)
                        .padding(.top, 16)
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
                    .padding(.top, 32)
                    .accessibilityIdentifier("welcomeStart")
                    Text("Free to try. No account needed.")
                        .font(Theme.sofia(14)).foregroundStyle(Theme.ink2)
                        .frame(maxWidth: .infinity).padding(.top, 14)
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 16)
            }
        }
        .onReceive(timer) { _ in
            withAnimation(.easeInOut(duration: 0.8)) {
                let all = IslandRegion.allCases
                region = all[(all.firstIndex(of: region)! + 1) % all.count]
            }
        }
    }

    private var regionTag: some View {
        HStack(spacing: 10) {
            Text(region.title).font(Theme.sofia(13, .medium)).foregroundStyle(Theme.ink)
            HStack(spacing: 4) {
                ForEach(IslandRegion.allCases) { r in
                    Capsule().fill(r == region ? Theme.green : Theme.line)
                        .frame(width: r == region ? 16 : 5, height: 5)
                }
            }
        }
        .padding(.horizontal, 12).frame(height: 30)
        .background(Theme.surface, in: Capsule())
        .shadow(color: Theme.ink.opacity(0.06), radius: 8, y: 2)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(region.title)
    }
}
