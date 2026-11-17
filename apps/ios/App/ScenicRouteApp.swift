import SwiftUI
import ScenicKit

@main
struct ScenicRouteApp: App {
    @State private var model = AppModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(model)
                .tint(Theme.accent)
                .task { await model.start() }
        }
    }
}

struct RootView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        TabView {
            NavigationStack { PlanView() }
                .tabItem { Label("Plan", systemImage: "map") }
            NavigationStack { TripsView() }
                .tabItem { Label("Trips", systemImage: "suitcase") }
        }
    }
}
