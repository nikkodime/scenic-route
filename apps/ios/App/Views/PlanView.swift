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
                Picker("Mode", selection: $model.mode) {
                    ForEach(PlanMode.allCases) { Text($0.title).tag($0) }
                }
                .pickerStyle(.segmented)
                .accessibilityIdentifier("modePicker")

                VStack(spacing: 0) {
                    placeRow(icon: "location.fill", title: "From", value: model.origin?.label ?? "Current location") { picking = .origin }
                    if model.mode == .go {
                        Divider().padding(.leading, 44)
                        placeRow(icon: "flag.checkered", title: "To", value: model.destination?.label ?? "Where to?") { picking = .destination }
                    }
                }
                .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.corner))
                .overlay(RoundedRectangle(cornerRadius: Theme.corner).strokeBorder(Theme.border))

                if model.mode == .explore {
                    section("How long a drive?") {
                        Picker("Drive time", selection: $model.exploreMinutes) {
                            Text("1 h").tag(60)
                            Text("2 h").tag(120)
                            Text("Half a day").tag(240)
                        }
                        .pickerStyle(.segmented)
                        .accessibilityIdentifier("explorePicker")
                        Toggle("Come back to the start", isOn: $model.roundTrip)
                            .tint(Theme.accent)
                            .accessibilityIdentifier("roundTrip")
                        Text(model.roundTrip ? "A loop: out one road, back another, within that time." : "Places you can reach within that time, by a beautiful road.")
                            .font(Theme.sofia(14)).foregroundStyle(Theme.ink2)
                    }
                }

                section("How do you want to drive?") {
                    Picker("Style", selection: $model.style) {
                        ForEach(RouteStyle.allCases) { Text($0.title).tag($0) }
                    }
                    .pickerStyle(.segmented)
                    .accessibilityIdentifier("stylePicker")
                    Text(model.style.blurb).font(Theme.sofia(14)).foregroundStyle(Theme.ink2)
                }

                section("What do you love?") {
                    ChipFlow(spacing: 8) {
                        ForEach(Interest.allCases) { i in
                            let on = model.interests.contains(i)
                            Button {
                                if on { model.interests.remove(i) } else { model.interests.insert(i) }
                            } label: {
                                Label(i.title, systemImage: i.symbol)
                                    .font(Theme.sofia(14, .medium))
                                    .padding(.horizontal, 14).frame(minHeight: 36)
                                    .foregroundStyle(on ? Theme.onAccent : Theme.ink)
                                    .background(on ? Theme.accent : Theme.surface, in: Capsule())
                                    .overlay(Capsule().strokeBorder(on ? Theme.accent : Theme.line))
                            }
                            .buttonStyle(.plain)
                            .accessibilityAddTraits(on ? .isSelected : [])
                            .accessibilityIdentifier("interest-\(i.rawValue)")
                        }
                    }
                }

                section("Vehicle") {
                    Picker("Vehicle", selection: $model.vehicle) {
                        ForEach(Vehicle.allCases) { Text($0.title).tag($0) }
                    }
                    .pickerStyle(.segmented)
                    if model.vehicle != .car {
                        Text("Wider roads, no gravel, no hairpin chains.").font(Theme.sofia(14)).foregroundStyle(Theme.ink2)
                    }
                }

                VStack(spacing: 0) {
                    if model.mode == .go {
                    HStack {
                        Text("Time limit").font(Theme.bodyFont)
                        Spacer()
                        Picker("Time limit", selection: $model.timeLimit) {
                            Text("No limit").tag(Int?.none)
                            ForEach([15, 30, 60, 120], id: \.self) { m in
                                Text("+\(Format.duration(minutes: Double(m)))").tag(Int?.some(m))
                            }
                        }
                        .accessibilityIdentifier("timeLimit")
                    }
                    .padding(.vertical, 6)
                    Divider()
                    }
                    DatePicker("Leaving", selection: $model.departAt, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                        .padding(.vertical, 6)
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

                if model.mode == .go {
                    Button {
                        Task {
                            await model.runPlan()
                            if model.plan?.routes.isEmpty == false { model.planPath = [.results] }
                        }
                    } label: {
                        primaryLabel(busy: model.isPlanning, busyText: "Finding beautiful roads…", text: "Find scenic routes")
                    }
                    .buttonStyle(.borderedProminent)
                    .buttonBorderShape(.roundedRectangle(radius: Theme.controlCorner))
                    .disabled(!model.canPlan)
                    .accessibilityIdentifier("planButton")
                } else {
                    Button {
                        Task {
                            await model.runExplore()
                            if model.explore?.destinations.isEmpty == false { model.planPath = [.explore] }
                        }
                    } label: {
                        primaryLabel(busy: model.isExploring, busyText: "Looking around…", text: "Show scenic places")
                    }
                    .buttonStyle(.borderedProminent)
                    .buttonBorderShape(.roundedRectangle(radius: Theme.controlCorner))
                    .disabled(!model.canExplore)
                    .accessibilityIdentifier("exploreButton")
                }
            }
            .padding()
        }
        .background(Theme.background)
        .toolbar(.hidden, for: .navigationBar)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(item: $picking) { field in
            PlaceSearchView(title: field == .origin ? "Start" : "Destination", allowCurrentLocation: field == .origin) { place in
                if field == .origin { model.origin = place } else { model.destination = place; model.loopVia = nil }
            }
        }
    }

    private func primaryLabel(busy: Bool, busyText: String, text: String) -> some View {
        HStack {
            if busy { ProgressView().tint(.white) }
            Text(busy ? busyText : text).font(Theme.buttonFont)
        }
        .foregroundStyle(Theme.onAccent)
        .frame(maxWidth: .infinity).frame(minHeight: 52)
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title).font(Theme.headlineFont).foregroundStyle(Theme.ink)
            content()
        }
    }

    private var hero: some View {
        VStack(alignment: .leading, spacing: 6) {
            Image("Wordmark").resizable().scaledToFit().frame(height: 26).padding(.bottom, 10)
                .accessibilityLabel("Panoramica")
            Text("Take the beautiful way").font(Theme.displayFont).tracking(-0.8).foregroundStyle(Theme.ink)
            Text(model.mode == .go ? "Tell us where you're going and what you love. We'll find the road with the views." : "Not sure where to go? See the most beautiful places within a drive.")
                .foregroundStyle(.secondary)
        }
        .padding(.top, 8)
    }

    private func placeRow(icon: String, title: String, value: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon).frame(width: 22).foregroundStyle(Theme.accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title.uppercased()).font(Theme.labelFont).tracking(0.8).foregroundStyle(Theme.ink3)
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

/// Wraps chips onto as many lines as needed.
struct ChipFlow: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = arrange(width: proposal.width ?? .infinity, subviews: subviews)
        return CGSize(width: proposal.width ?? rows.map(\.width).max() ?? 0, height: rows.last.map { $0.y + $0.height } ?? 0)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        for row in arrange(width: bounds.width, subviews: subviews) {
            var x = bounds.minX
            for i in row.items {
                let size = subviews[i].sizeThatFits(.unspecified)
                subviews[i].place(at: CGPoint(x: x, y: bounds.minY + row.y), proposal: ProposedViewSize(size))
                x += size.width + spacing
            }
        }
    }

    private struct Row { var items: [Int] = []; var y: CGFloat = 0; var width: CGFloat = 0; var height: CGFloat = 0 }

    private func arrange(width: CGFloat, subviews: Subviews) -> [Row] {
        var rows: [Row] = [Row()]
        for i in subviews.indices {
            let size = subviews[i].sizeThatFits(.unspecified)
            if !rows[rows.count - 1].items.isEmpty && rows[rows.count - 1].width + spacing + size.width > width {
                let last = rows[rows.count - 1]
                rows.append(Row(y: last.y + last.height + spacing))
            }
            var r = rows[rows.count - 1]
            r.width += (r.items.isEmpty ? 0 : spacing) + size.width
            r.height = max(r.height, size.height)
            r.items.append(i)
            rows[rows.count - 1] = r
        }
        return rows
    }
}

