import SwiftUI
import ScenicKit

/// The scenic score as a passport stamp (design system "Stamp"): double ring, place on the top arc,
/// date on the bottom arc, score in the middle, worn ink, multiply blend, a slight rotation.
/// Round = a single drive; visa = a pass or a journey day.
struct StampView: View {
    enum Shape { case round, visa }

    let score: Int
    var place: String = ""
    var date: Date? = nil
    var ink: Color = Theme.green
    var shape: Shape = .round
    var size: CGFloat = 120
    var rotation: Double = -6
    /// Seed for the worn-ink pattern, so each stamp wears differently but never flickers.
    var seed: Int = 7

    var body: some View {
        Group {
            switch shape {
            case .round: round
            case .visa: visa
            }
        }
        .foregroundStyle(ink)
        .mask { StampWear(seed: seed) }
        .blendMode(.multiply)
        .rotationEffect(.degrees(rotation))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("Scenic score \(score)\(place.isEmpty ? "" : ", \(place)")")
    }

    private var dateText: String {
        guard let date else { return "" }
        let f = DateFormatter()
        f.dateFormat = "d MMM yyyy"
        return f.string(from: date).uppercased()
    }

    private var round: some View {
        ZStack {
            Circle().strokeBorder(lineWidth: size * 0.022)
            Circle().strokeBorder(lineWidth: size * 0.009).padding(size * 0.085)
            if !place.isEmpty { ArcText(text: place.uppercased(), radius: size * 0.36, fontSize: size * 0.085, top: true) }
            if date != nil { ArcText(text: dateText, radius: size * 0.36, fontSize: size * 0.07, top: false) }
            VStack(spacing: size * 0.01) {
                Text("SCENIC").font(Theme.sofia(size * 0.06, .semibold)).tracking(size * 0.012)
                Text("\(score)").font(Theme.sofia(size * 0.27, .bold)).monospacedDigit()
                Squiggle().stroke(style: StrokeStyle(lineWidth: size * 0.014, lineCap: .round))
                    .frame(width: size * 0.2, height: size * 0.05)
            }
        }
        .frame(width: size, height: size)
    }

    private var visa: some View {
        let w = size * 1.18, h = size * 0.82
        return ZStack {
            RoundedRectangle(cornerRadius: size * 0.05).strokeBorder(lineWidth: size * 0.022)
            RoundedRectangle(cornerRadius: size * 0.03).strokeBorder(lineWidth: size * 0.009).padding(size * 0.05)
            VStack(spacing: size * 0.02) {
                Text(place.uppercased()).font(Theme.sofia(size * 0.075, .semibold)).tracking(size * 0.012).lineLimit(1)
                    .minimumScaleFactor(0.6)
                Rectangle().frame(height: size * 0.008).padding(.horizontal, size * 0.08)
                HStack(spacing: size * 0.06) {
                    VStack(spacing: 0) {
                        Text("\(score)").font(Theme.sofia(size * 0.26, .bold)).monospacedDigit()
                        Text("SCENIC").font(Theme.sofia(size * 0.05, .semibold)).tracking(size * 0.01)
                    }
                    Rectangle().frame(width: size * 0.008, height: size * 0.26)
                    VStack(spacing: size * 0.02) {
                        Text("ENTRY").font(Theme.sofia(size * 0.05, .semibold)).tracking(size * 0.01)
                        Text(dateText).font(Theme.sofia(size * 0.055, .medium)).lineLimit(1).minimumScaleFactor(0.6)
                        Squiggle().stroke(style: StrokeStyle(lineWidth: size * 0.012, lineCap: .round))
                            .frame(width: size * 0.16, height: size * 0.04)
                    }
                }
            }
            .padding(size * 0.1)
        }
        .frame(width: w, height: h)
    }
}

/// Letters set along an arc: the top arc reads clockwise, the bottom arc reads left to right, both upright.
private struct ArcText: View {
    let text: String
    let radius: CGFloat
    let fontSize: CGFloat
    let top: Bool

    var body: some View {
        let chars = Array(text)
        let step = Double(fontSize * 0.68 / radius) * 180 / .pi
        let span = step * Double(max(chars.count - 1, 0))
        ZStack {
            ForEach(Array(chars.enumerated()), id: \.offset) { i, c in
                let angle = top ? -span / 2 + step * Double(i) : span / 2 - step * Double(i)
                Text(String(c)).font(Theme.sofia(fontSize, .semibold))
                    .offset(y: top ? -radius : radius)
                    .rotationEffect(.degrees(angle))
            }
        }
    }
}

/// The little road under the score.
private struct Squiggle: SwiftUI.Shape {
    func path(in r: CGRect) -> Path {
        var p = Path()
        p.move(to: CGPoint(x: r.minX, y: r.midY))
        p.addCurve(to: CGPoint(x: r.midX, y: r.midY), control1: CGPoint(x: r.minX + r.width * 0.2, y: r.minY), control2: CGPoint(x: r.midX - r.width * 0.15, y: r.maxY))
        p.addCurve(to: CGPoint(x: r.maxX, y: r.midY), control1: CGPoint(x: r.midX + r.width * 0.15, y: r.minY), control2: CGPoint(x: r.maxX - r.width * 0.2, y: r.maxY))
        return p
    }
}

/// Worn ink: an opaque mask with small, seeded gaps, like a rubber stamp on paper.
private struct StampWear: View {
    let seed: Int
    var body: some View {
        Canvas { ctx, size in
            ctx.fill(Path(CGRect(origin: .zero, size: size)), with: .color(.black))
            var rng = SeededRandom(seed: UInt64(seed &* 2_654_435_761 &+ 1))
            ctx.blendMode = .destinationOut
            for _ in 0..<Int(size.width * size.height / 90) {
                let x = Double(rng.next() % 10_000) / 10_000 * size.width
                let y = Double(rng.next() % 10_000) / 10_000 * size.height
                let r = 0.4 + Double(rng.next() % 100) / 100 * 1.4
                let a = 0.25 + Double(rng.next() % 100) / 100 * 0.6
                ctx.fill(Path(ellipseIn: CGRect(x: x, y: y, width: r * 2, height: r * 2)), with: .color(.black.opacity(a)))
            }
        }
    }
}

private struct SeededRandom {
    var state: UInt64
    init(seed: UInt64) { state = seed == 0 ? 0x9E37_79B9_7F4A_7C15 : seed }
    mutating func next() -> UInt64 {
        state ^= state << 13; state ^= state >> 7; state ^= state << 17
        return state
    }
}

/// Stamp inks, varied per drive for a real passport feel; green is the default.
enum StampInk {
    static let all: [Color] = [Theme.green, Theme.lake, Theme.burgundy, Theme.terracotta]
    static func forScore(_ score: Int, index: Int) -> Color {
        score >= 95 ? Theme.burgundy : all[index % all.count]
    }
}

extension LoggedDrive {
    /// Stable per drive, so each stamp keeps its own wear across launches.
    var stampSeed: Int { id.uuidString.utf8.reduce(7) { ($0 &* 31 &+ Int($1)) % 100_003 } }
}
