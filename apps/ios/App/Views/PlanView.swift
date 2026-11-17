import SwiftUI
import ScenicKit

/// Plan: photo-led, almost no copy. Labels are one or two words; pictures and icons carry the meaning.
struct PlanView: View {
    @Environment(AppModel.self) private var model
    @State private var picking: Field?

    enum Field: String, Identifiable { case origin, destination; var id: String { rawValue } }

    var body: some View {
        @Bindable var model = model
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                header
                modeSwitch
                places
                if model.mode == .explore { spanRow }
                caption("Style")
                styleTiles
                caption("I'd love")
                interestGrid
                vehicleRow
                if let error = model.errorMessage {
                    Label(error, systemImage: "exclamationmark.triangle").foregroundStyle(Theme.warning).font(Theme.sofia(14))
                }
                cta
            }
            .padding(.horizontal, Theme.gutter)
            .padding(.vertical, 8)
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

    // MARK: Header

    private var header: some View {
        @Bindable var model = model
        return HStack(alignment: .center) {
            Text(model.mode == .go ? "Where to?" : "Nearby").font(Theme.sofia(34, .semibold, relativeTo: .largeTitle))
                .tracking(-0.6).foregroundStyle(Theme.ink)
            Spacer()
            // When: a compact pill. Defaults to now.
            DatePicker("Leaving", selection: $model.departAt, in: Date()..., displayedComponents: [.date, .hourAndMinute])
                .labelsHidden().datePickerStyle(.compact).tint(Theme.green)
                .accessibilityIdentifier("departAt")
        }
        .padding(.top, 8)
    }

    private var modeSwitch: some View {
        @Bindable var model = model
        return HStack(spacing: 4) {
            ForEach(PlanMode.allCases) { m in
                let on = model.mode == m
                Button { withAnimation(.snappy(duration: 0.25)) { model.mode = m } } label: {
                    Text(m.title).font(Theme.sofia(15, on ? .semibold : .medium))
                        .foregroundStyle(on ? Theme.ink : Theme.ink2)
                        .frame(maxWidth: .infinity, minHeight: 40)
                        .background(on ? Theme.surface : .clear, in: RoundedRectangle(cornerRadius: 10))
                        .shadow(color: on ? Theme.ink.opacity(0.08) : .clear, radius: 4, y: 1)
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(on ? .isSelected : [])
            }
        }
        .padding(4)
        .background(Theme.mist, in: RoundedRectangle(cornerRadius: 14))
        .accessibilityIdentifier("modePicker")
    }

    // MARK: Places

    private var places: some View {
        VStack(spacing: 0) {
            placeRow(dot: false, value: model.origin?.label ?? "Current location", id: "originField") { picking = .origin }
            if model.mode == .go {
                Divider().padding(.leading, 40)
                HStack(spacing: 0) {
                    placeRow(dot: true, value: model.destination?.label ?? "Where to?", id: "destinationField", placeholder: model.destination == nil) { picking = .destination }
                    if model.destination != nil {
                        Button {
                            let o = model.origin
                            model.origin = model.destination
                            model.destination = o
                            model.loopVia = nil
                        } label: {
                            Image(systemName: "arrow.up.arrow.down").font(.system(size: 17, weight: .regular))
                                .foregroundStyle(Theme.ink2).frame(width: 48, height: 48)
                        }
                        .buttonStyle(.plain)
                        .disabled(model.origin == nil)
                        .accessibilityLabel("Swap start and destination")
                    }
                }
            }
        }
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).strokeBorder(Theme.border))
    }

    private func placeRow(dot: Bool, value: String, id: String, placeholder: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Circle().fill(dot ? Theme.green : .clear).frame(width: 9, height: 9)
                    .overlay(Circle().strokeBorder(dot ? Theme.green : Theme.ink, lineWidth: 1.6))
                    .frame(width: 12)
                Text(value).font(Theme.sofia(18, .medium)).foregroundStyle(placeholder ? Theme.ink3 : Theme.ink).lineLimit(1)
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 16).frame(minHeight: 56)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(id == "originField" ? "From, \(value)" : "To, \(value)")
        .accessibilityIdentifier(id)
    }

    // MARK: Explore span

    private var spanRow: some View {
        @Bindable var model = model
        return HStack(spacing: 8) {
            ForEach([(60, "1 h"), (120, "2 h"), (240, "Half day")], id: \.0) { minutes, label in
                tile(on: model.exploreMinutes == minutes, label: label, symbol: "clock") { model.exploreMinutes = minutes }
                    .accessibilityIdentifier("span-\(minutes)")
            }
            tile(on: model.roundTrip, label: "Loop", symbol: "arrow.triangle.2.circlepath") { model.roundTrip.toggle() }
                .accessibilityIdentifier("roundTrip")
        }
        .accessibilityIdentifier("explorePicker")
    }

    // MARK: Style

    private var styleTiles: some View {
        @Bindable var model = model
        return HStack(spacing: 8) {
            ForEach(RouteStyle.allCases) { s in
                let on = model.style == s
                Button { model.style = s } label: {
                    Color.clear.frame(height: 112)
                        .overlay { Image(s.photo).resizable().scaledToFill() }
                        .overlay {
                            LinearGradient(colors: [.clear, .black.opacity(0.55)], startPoint: .center, endPoint: .bottom)
                        }
                        .overlay(alignment: .bottomLeading) {
                            Text(s.title).font(Theme.sofia(14, .semibold)).foregroundStyle(.white)
                                .lineLimit(1).minimumScaleFactor(0.8).padding(.leading, 10).padding(.bottom, 16)
                        }
                        .overlay(alignment: .bottomTrailing) { PhotoCredit(text: s.credit, size: 7.5).padding(.trailing, 6).padding(.bottom, 3) }
                        .overlay(alignment: .topTrailing) {
                            if on {
                                Image(systemName: "checkmark").font(.system(size: 11, weight: .bold)).foregroundStyle(.white)
                                    .frame(width: 22, height: 22).background(Theme.green, in: Circle())
                                    .overlay(Circle().strokeBorder(.white, lineWidth: 1.5)).padding(7)
                            }
                        }
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                        .overlay(RoundedRectangle(cornerRadius: 16).strokeBorder(on ? Theme.green : .clear, lineWidth: 2.5))
                }
                .buttonStyle(.plain)
                .accessibilityLabel(s.title)
                .accessibilityAddTraits(on ? .isSelected : [])
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("stylePicker")
    }

    // MARK: Interests

    private var interestGrid: some View {
        @Bindable var model = model
        return LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
            ForEach(Interest.allCases) { i in
                let on = model.interests.contains(i)
                tile(on: on, label: i.short, symbol: i.symbol, height: 64) {
                    if on { model.interests.remove(i) } else { model.interests.insert(i) }
                }
                .accessibilityLabel(i.title)
                .accessibilityIdentifier("interest-\(i.rawValue)")
            }
        }
    }

    // MARK: Vehicle, time cap, road preferences

    private var vehicleRow: some View {
        @Bindable var model = model
        return HStack(spacing: 8) {
            ForEach(Vehicle.allCases) { v in
                let on = model.vehicle == v
                Button { model.vehicle = v } label: {
                    VehicleGlyph(vehicle: v).foregroundStyle(on ? Theme.green : Theme.ink)
                        .frame(maxWidth: .infinity, minHeight: 50)
                        .background(on ? Theme.greenTint : Theme.surface, in: RoundedRectangle(cornerRadius: 14))
                        .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(on ? Theme.green : Theme.border, lineWidth: on ? 1.5 : 1))
                }
                .buttonStyle(.plain)
                .accessibilityLabel(v.title)
                .accessibilityAddTraits(on ? .isSelected : [])
            }
            if model.mode == .go {
                // The old "extra time" control, demoted: tap to cycle none → +30 → +45 → +1 h → +2 h.
                Button {
                    let caps: [Int?] = [nil, 30, 45, 60, 120]
                    let i = caps.firstIndex(of: model.timeLimit) ?? 0
                    model.timeLimit = caps[(i + 1) % caps.count]
                } label: {
                    HStack(spacing: 5) {
                        Image(systemName: "clock").font(.system(size: 15))
                        Text(model.timeLimit.map { "+\(Format.duration(minutes: Double($0)))" } ?? "Any").font(Theme.sofia(14, .semibold)).monospacedDigit()
                    }
                    .foregroundStyle(model.timeLimit == nil ? Theme.ink : Theme.green)
                    .frame(maxWidth: .infinity, minHeight: 50)
                    .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14))
                    .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(Theme.border))
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Extra time limit")
                .accessibilityValue(model.timeLimit.map { "\($0) minutes" } ?? "none")
                .accessibilityIdentifier("timeLimit")
            }
            Menu {
                Toggle("Rental car", isOn: $model.prefs.rentalCar)
                Toggle("No gravel", isOn: $model.prefs.avoidUnpaved)
                Toggle("No tolls", isOn: $model.prefs.avoidTolls)
            } label: {
                Image(systemName: "slider.horizontal.3").font(.system(size: 16)).foregroundStyle(Theme.ink)
                    .frame(width: 50, height: 50)
                    .background(Theme.surface, in: RoundedRectangle(cornerRadius: 14))
                    .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(Theme.border))
            }
            .accessibilityLabel("Road preferences")
        }
    }

    // MARK: CTA

    @ViewBuilder private var cta: some View {
        if model.mode == .go {
            Button {
                Task {
                    await model.runPlan()
                    if model.plan?.routes.isEmpty == false { model.planPath = [.results] }
                }
            } label: { primaryLabel(busy: model.isPlanning, text: "Show routes") }
            .buttonStyle(.plain)
            .disabled(!model.canPlan)
            .opacity(model.canPlan || model.isPlanning ? 1 : 0.45)
            .accessibilityIdentifier("planButton")
        } else {
            Button {
                Task {
                    await model.runExplore()
                    if model.explore?.destinations.isEmpty == false { model.planPath = [.explore] }
                }
            } label: { primaryLabel(busy: model.isExploring, text: "Find places") }
            .buttonStyle(.plain)
            .disabled(!model.canExplore)
            .accessibilityIdentifier("exploreButton")
        }
    }

    private func primaryLabel(busy: Bool, text: String) -> some View {
        HStack(spacing: 10) {
            if busy { ProgressView().tint(.white) } else {
                Text(text).font(Theme.buttonFont)
                Image(systemName: "chevron.right").font(.system(size: 14, weight: .semibold))
            }
        }
        .foregroundStyle(Theme.onAccent)
        .frame(maxWidth: .infinity).frame(minHeight: 56)
        .background(Theme.green, in: RoundedRectangle(cornerRadius: 18))
        .accessibilityLabel(busy ? "Working" : text)
    }

    // MARK: Pieces

    private func caption(_ text: String) -> some View {
        Text(text.uppercased()).font(Theme.labelFont).tracking(1).foregroundStyle(Theme.ink3).padding(.bottom, -8)
    }

    /// A square-ish choice tile: off is white with a hairline, on is solid green with white contents.
    private func tile(on: Bool, label: String, symbol: String, height: CGFloat = 60, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 6) {
                Image(systemName: symbol).font(.system(size: 20, weight: .light))
                Text(label).font(Theme.sofia(12, .medium)).lineLimit(1).minimumScaleFactor(0.8)
            }
            .foregroundStyle(on ? Theme.onAccent : Theme.ink)
            .frame(maxWidth: .infinity, minHeight: height)
            .background(on ? Theme.green : Theme.surface, in: RoundedRectangle(cornerRadius: 14))
            .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(on ? Theme.green : Theme.border))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(on ? .isSelected : [])
    }
}

/// "© Author · Licence", required on every photo.
struct PhotoCredit: View {
    let text: String
    var size: CGFloat = 10
    var body: some View {
        Text(text).font(.system(size: size)).foregroundStyle(.white.opacity(0.88)).lineLimit(1).truncationMode(.tail)
            .shadow(color: .black.opacity(0.5), radius: 2)
    }
}

/// Car, campervan, car with caravan: drawn from SF Symbols.
struct VehicleGlyph: View {
    let vehicle: Vehicle
    var body: some View {
        switch vehicle {
        case .car: Image(systemName: "car.side").font(.system(size: 19))
        case .campervan: Image(systemName: "bus").font(.system(size: 18))
        case .caravan:
            HStack(spacing: 1) {
                Image(systemName: "car.side").font(.system(size: 15))
                Image(systemName: "house").font(.system(size: 13))
            }
        }
    }
}

extension RouteStyle {
    /// Static app photos (Wikimedia Commons), one per style.
    var photo: String {
        switch self { case .relaxed: "StyleRelaxed"; case .scenic: "StyleScenic"; case .mostBeautiful: "StyleMostBeautiful" }
    }
    var credit: String {
        switch self {
        case .relaxed: "© Repuli · CC BY-SA 4.0"
        case .scenic: "© Costaetrusca · CC BY-SA 4.0"
        case .mostBeautiful: "© kuhnmi · CC BY 2.0"
        }
    }
}

extension Interest {
    /// One word for the tile; `title` stays the accessible label.
    var short: String {
        switch self {
        case .views: "Views"; case .heritage: "Villages"; case .water: "Water"
        case .mountains: "Mountains"; case .countryside: "Vineyards"; case .quiet: "Quiet roads"
        }
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

