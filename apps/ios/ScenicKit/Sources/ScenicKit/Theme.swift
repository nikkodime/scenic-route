import SwiftUI

/// Design tokens. Placeholder palette ("Tuscan dusk") until the design system lands;
/// views only use these names, so swapping values restyles the whole app.
public enum Theme {
    public static let terracotta = Color(red: 0.80, green: 0.42, blue: 0.27)
    public static let olive = Color(red: 0.42, green: 0.48, blue: 0.27)
    public static let cypress = Color(red: 0.16, green: 0.27, blue: 0.20)
    public static let sky = Color(red: 0.36, green: 0.58, blue: 0.75)
    public static let sand = Color(red: 0.96, green: 0.92, blue: 0.84)
    public static let ink = Color(red: 0.13, green: 0.12, blue: 0.11)

    public static let accent = terracotta
    public static let routeColors: [Color] = [terracotta, sky, olive]

    public static func color(for band: Format.ScoreBand) -> Color {
        switch band {
        case .stunning: return terracotta
        case .lovely: return olive
        case .pleasant: return sky
        case .plain: return .gray
        }
    }

    public static let corner: CGFloat = 18
    public static let titleFont = Font.system(.title2, design: .serif).weight(.semibold)
    public static let headlineFont = Font.system(.headline, design: .serif)
}
