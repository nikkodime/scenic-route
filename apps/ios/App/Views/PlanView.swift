import SwiftUI
import ScenicKit

struct PlanView: View {
    @Environment(AppModel.self) private var model
    @State private var picking: Field?

    enum Field: String, Identifiable { case origin, destination; var id: String { rawValue } }

    var body: some View {
        @Bindable var model = model
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                hero
                VStack(spacing: 0) {
                    placeRow(icon: "location.fill", title: "From", value: model.origin?.label ?? "Current location") { picking = .origin }
                    Divider().padding(.leading, 44)
                    placeRow(icon: "flag.checkered", title: "To", value: model.destination?.label ?? "Where to?") { picking = .destination }
                }
                .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.corner))
                .overlay(RoundedRectangle(cornerRadius: Theme.corner).strokeBorder(Theme.border))

                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("Extra time for the views").font(Theme.headlineFont)
                        Spacer()
                        Text(model.extraMinutes == 0 ? "None" : "+\(Format.duration(minutes: model.extraMinutes))")
                            .monospacedDigit().foregroundStyle(Theme.accent)
                    }
                    Slider(value: $model.extraMinutes, in: 0...180, step: 15)
                        .accessibilityIdentifier("extraTimeSlider")
                    DatePicker("Leaving", selection: $model.departAt, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                }

                DisclosureGroup("Road preferences") {
                    Toggle("Rental car (no gravel roads)", isOn: $model.prefs.rentalCar)
                    Toggle("Avoid unpaved roads", isOn: $model.prefs.avoidUnpaved)
                    Toggle("Avoid tolls", isOn: $model.prefs.avoidTolls)
                }
                .tint(Theme.accent)

                if let error = model.errorMessage {
                    Label(error, systemImage: "exclamationmark.triangle").foregroundStyle(.red).font(.callout)
                }

                Button {
                    Task {
                        await model.runPlan()
                        if model.plan?.routes.isEmpty == false { model.planPath = [.results] }
                    }
                } label: {
                    HStack {
                        if model.isPlanning { ProgressView().tint(.white) }
                        Text(model.isPlanning ? "FINDING BEAUTIFUL ROADS…" : "FIND SCENIC ROUTES").font(Theme.titleFont.weight(.heavy))
                    }
                    .foregroundStyle(Theme.onAccent)
                    .frame(maxWidth: .infinity).frame(minHeight: 52)
                }
                .buttonStyle(.borderedProminent)
                .buttonBorderShape(.roundedRectangle(radius: Theme.controlCorner))
                .disabled(!model.canPlan)
                .accessibilityIdentifier("planButton")
            }
            .padding()
        }
        .background(Theme.background)
        .navigationTitle("Scenic Route")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $picking) { field in
            PlaceSearchView(title: field == .origin ? "Start" : "Destination", allowCurrentLocation: field == .origin) { place in
                if field == .origin { model.origin = place } else { model.destination = place }
            }
        }
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("TAKE THE BEAUTIFUL WAY").font(Theme.displayFont)
            Text("Tell us where you're going and how much extra time you'd enjoy. We'll find the road with the views.")
                .foregroundStyle(.secondary)
        }
        .padding(.top, 8)
    }

    private func placeRow(icon: String, title: String, value: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon).frame(width: 22).foregroundStyle(Theme.accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title.uppercased()).font(Theme.labelFont).tracking(1.2).foregroundStyle(Theme.ash)
                    Text(value).foregroundStyle(.primary).lineLimit(1)
                }
                Spacer()
                Image(systemName: "chevron.right").font(.caption).foregroundStyle(.tertiary)
            }
            .padding(14)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityIdentifier(title == "From" ? "originField" : "destinationField")
    }
}
