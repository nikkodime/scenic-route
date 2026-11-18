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
    @AppStorage("seenWelcome") private var seenWelcome = false
    private let uiTest = ProcessInfo.processInfo.arguments.contains("-uiTestPlaces")

    var body: some View {
        @Bindable var model = model
        TabView(selection: $model.tab) {
            NavigationStack(path: $model.planPath) {
                PlanView().navigationDestination(for: PlanScreen.self) { screen in
                    switch screen {
                    case .explore: ExploreView()
                    case .results: ResultsView()
                    case .route(let route): RouteDetailView(route: route).onAppear { model.selectedRouteID = route.id }
                    }
                }
            }
            .tabItem { Label("Plan", systemImage: "safari") }
            .tag(AppTab.plan)
            NavigationStack { ExploreHome() }
                .tabItem { Label("Explore", systemImage: "map") }
                .tag(AppTab.explore)
            NavigationStack { LogbookView() }
                .tabItem { Label("Logbook", systemImage: "seal") }
                .tag(AppTab.logbook)
            NavigationStack { YouView() }
                .tabItem { Label("You", systemImage: "person") }
                .tag(AppTab.you)
        }
        .fullScreenCover(isPresented: Binding(get: { !seenWelcome && !uiTest }, set: { if !$0 { seenWelcome = true } })) {
            WelcomeView { seenWelcome = true }
        }
        .fullScreenCover(isPresented: Binding(get: { model.driving != nil || model.justLogged != nil }, set: { if !$0 { model.cancelDrive() } })) {
            Group {
                if let d = model.justLogged { DriveLoggedView(drive: d) }
                else if let r = model.driving { DriveView(route: r) }
            }
        }
    }
}
