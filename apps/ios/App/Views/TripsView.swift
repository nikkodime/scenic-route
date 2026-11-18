import SwiftUI
import ScenicKit

struct TripsView: View {
    @Environment(AppModel.self) private var model

    var body: some View {
        List {
            if let s = model.syncStatus { Text(s).font(.caption).foregroundStyle(.secondary) }
            if model.trips.isEmpty {
                VStack(spacing: 12) {
                    IslandView().frame(maxWidth: 280)
                    Text("No trips yet").font(Theme.headlineFont).foregroundStyle(Theme.ink)
                }
                .frame(maxWidth: .infinity)
                .listRowBackground(Color.clear)
                .listRowSeparator(.hidden)
            }
            ForEach(model.trips) { trip in
                NavigationLink(value: trip) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(trip.name).font(Theme.headlineFont)
                        if let r = trip.days.first?.route {
                            Text("\(r.summary) · \(Format.duration(minutes: r.minutes))").font(.caption).foregroundStyle(.secondary)
                        }
                        Text(trip.days.count == 1 ? "1 day" : "\(trip.days.count) days").font(.caption2).foregroundStyle(.tertiary)
                    }
                }
            }
            .onDelete { idx in
                let doomed = idx.map { model.trips[$0] }
                Task { for t in doomed { await model.delete(t) } }
            }
        }
        .navigationTitle("Trips")
        .refreshable { await model.sync() }
        .navigationDestination(for: Trip.self) { trip in
            if let r = trip.days.first?.route { RouteDetailView(route: r) } else { Text(trip.name) }
        }
    }
}
