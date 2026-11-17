import SwiftUI
import ScenicKit

@main
struct ScenicRouteApp: App {
    @State private var model = AppModel()

    init() { Theme.registerFonts() }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(model)
                .tint(Theme.accent)
                .font(Theme.bodyFont)
                .preferredColorScheme(.light)
                .task { await model.start() }
        }
    }
}

struct RootView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        @Bindable var model = model
        TabView {
            NavigationStack(path: $model.planPath) {
                PlanView().navigationDestination(for: PlanScreen.self) { screen in
                    switch screen {
                    case .explore: ExploreView()
                    case .results: ResultsView()
                    case .route(let route): RouteDetailView(route: route).onAppear { model.selectedRouteID = route.id }
                    }
                }
            }
                .tabItem { Label("Plan", systemImage: "map") }
            NavigationStack { TripsView() }
                .tabItem { Label("Trips", systemImage: "suitcase") }
        }
    }
}
