import SwiftUI
import ScenicKit

struct PlaceSearchView: View {
    @Environment(AppModel.self) private var model
    @Environment(\.dismiss) private var dismiss
    let title: String
    let allowCurrentLocation: Bool
    let onPick: (Place?) -> Void

    @State private var query = ""
    @State private var results: [Place] = []
    @State private var searching = false

    var body: some View {
        NavigationStack {
            List {
                if allowCurrentLocation {
                    Button { onPick(nil); dismiss() } label: { Label("Current location", systemImage: "location.fill") }
                }
                ForEach(results) { place in
                    Button { onPick(place); dismiss() } label: {
                        VStack(alignment: .leading) {
                            Text(place.label?.components(separatedBy: ", ").first ?? "Place").foregroundStyle(.primary)
                            Text(place.label ?? "").font(.caption).foregroundStyle(.secondary).lineLimit(1)
                        }
                    }
                }
                if searching { ProgressView() }
                if !searching && results.isEmpty && query.count >= 2 { Text("No places found").foregroundStyle(.secondary) }
            }
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always), prompt: "Town, address or place")
            .task(id: query) {
                guard query.count >= 2 else { results = []; return }
                try? await Task.sleep(for: .milliseconds(300)) // debounce
                guard !Task.isCancelled else { return }
                searching = true
                results = await model.search(query)
                searching = false
            }
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
    }
}
