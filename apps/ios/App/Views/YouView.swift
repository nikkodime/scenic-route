import SwiftUI
import ScenicKit

/// You: the Scenic Pass, how you like to drive, and the small print.
struct YouView: View {
    @Environment(AppModel.self) private var model
    @AppStorage("driveVoice") private var voice = true
    @AppStorage("apiBaseURL") private var server = ""
    @State private var showPass = false

    var body: some View {
        @Bindable var model = model
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                Text("You").font(Theme.sofia(32, .medium, relativeTo: .title)).tracking(-0.5).foregroundStyle(Theme.ink)
                Text("No account needed while Panoramica is in testing.")
                    .font(Theme.sofia(14)).foregroundStyle(Theme.ink2).padding(.top, 6)

                Button { showPass = true } label: {
                    HStack(spacing: 14) {
                        IslandPoster(region: .dolomites).scaleEffect(1.15).frame(width: 76, height: 76)
                        VStack(alignment: .leading, spacing: 4) {
                            Text("SCENIC PASS").font(Theme.labelFont).tracking(1).foregroundStyle(Theme.green)
                            Text("Plan the whole journey").font(Theme.sofia(17, .medium)).foregroundStyle(Theme.ink)
                            Text("Multi-day trips, caravan profiles, offline maps").font(Theme.sofia(13)).foregroundStyle(Theme.ink2)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        Spacer(minLength: 0)
                        Image(systemName: "chevron.right").font(.system(size: 13, weight: .semibold)).foregroundStyle(Theme.ink3)
                    }
                    .padding(14)
                    .background(Theme.greenTint, in: RoundedRectangle(cornerRadius: 18))
                    .overlay(RoundedRectangle(cornerRadius: 18).strokeBorder(Theme.green.opacity(0.35)))
                }
                .buttonStyle(.plain)
                .padding(.top, 22)
                .accessibilityIdentifier("scenicPassEntry")

                section("How you drive")
                card {
                    row("Usual style") {
                        Picker("Usual style", selection: $model.style) {
                            ForEach(RouteStyle.allCases) { Text($0.title).tag($0) }
                        }
                        .labelsHidden().tint(Theme.ink2)
                    }
                    divider
                    row("Vehicle") {
                        Picker("Vehicle", selection: $model.vehicle) {
                            ForEach(Vehicle.allCases) { Text($0.title).tag($0) }
                        }
                        .labelsHidden().tint(Theme.ink2)
                    }
                    divider
                    toggle("Avoid motorways", $model.prefs.avoidMotorways)
                    divider
                    toggle("Avoid tolls", $model.prefs.avoidTolls)
                    divider
                    toggle("Avoid unpaved roads", $model.prefs.avoidUnpaved)
                    divider
                    toggle("Spoken directions", $voice)
                }

                section("Testing")
                card {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Route server").font(Theme.sofia(15)).foregroundStyle(Theme.ink)
                        TextField("Built-in address", text: $server)
                            .font(Theme.sofia(14)).foregroundStyle(Theme.ink2)
                            .textInputAutocapitalization(.never).autocorrectionDisabled().keyboardType(.URL)
                        Text("Takes effect the next time you open the app.").font(Theme.sofia(12)).foregroundStyle(Theme.ink3)
                    }
                    .padding(16)
                }

                section("About")
                card {
                    info("Photos", "Wikimedia Commons, credited on each photo")
                    divider
                    info("Maps and roads", "© OpenStreetMap contributors")
                    divider
                    info("Version", Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "")
                }
            }
            .padding(.horizontal, Theme.gutter)
            .padding(.top, 8)
            .padding(.bottom, 24)
        }
        .background(Theme.background)
        .toolbar(.hidden, for: .navigationBar)
        .sheet(isPresented: $showPass) { ScenicPassView() }
    }

    private func section(_ title: String) -> some View {
        Text(title.uppercased()).font(Theme.labelFont).tracking(1).foregroundStyle(Theme.ink3)
            .padding(.top, 28).padding(.bottom, 10)
    }

    private func card<C: View>(@ViewBuilder _ content: () -> C) -> some View {
        VStack(spacing: 0, content: content)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16))
            .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(Theme.border))
    }

    private var divider: some View { Rectangle().fill(Theme.line).frame(height: 1).padding(.leading, 16) }

    private func row<C: View>(_ title: String, @ViewBuilder _ trailing: () -> C) -> some View {
        HStack {
            Text(title).font(Theme.sofia(15)).foregroundStyle(Theme.ink)
            Spacer()
            trailing()
        }
        .padding(.horizontal, 16).frame(minHeight: 50)
    }

    private func toggle(_ title: String, _ on: Binding<Bool>) -> some View {
        Toggle(isOn: on) { Text(title).font(Theme.sofia(15)).foregroundStyle(Theme.ink) }
            .tint(Theme.green)
            .padding(.horizontal, 16).frame(minHeight: 50)
    }

    private func info(_ title: String, _ value: String) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title).font(Theme.sofia(15)).foregroundStyle(Theme.ink)
            Spacer(minLength: 12)
            Text(value).font(Theme.sofia(13)).foregroundStyle(Theme.ink2).multilineTextAlignment(.trailing)
        }
        .padding(.horizontal, 16).padding(.vertical, 14)
    }
}
