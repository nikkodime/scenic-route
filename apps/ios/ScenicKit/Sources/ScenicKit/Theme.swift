import SwiftUI

/// Design tokens from the "Overland v2" design system (project design/DESIGN.md).
/// Views use only these names, so a design change is a change to this file.
public enum Theme {
    static func hex(_ v: UInt32) -> Color {
        Color(red: Double((v >> 16) & 0xff) / 255, green: Double((v >> 8) & 0xff) / 255, blue: Double(v & 0xff) / 255)
    }

    public static let graphite = hex(0x111416)   // app ground
    public static let basalt = hex(0x1A1F23)     // cards, surfaces
    public static let flint = hex(0x2E363C)      // 1px borders
    public static let ash = hex(0x9BA5AC)        // secondary text
    public static let bone = hex(0xECE8DF)       // primary text
    public static let sandglow = hex(0xF2B01E)   // THE signal colour: chosen route, primary button, score plate
    public static let skySlate = hex(0x7A93A8)
    public static let ice = hex(0x8FD0E0)        // weather
    public static let moss = hex(0x8CC084)       // good conditions
    public static let ember = hex(0xFF7A52)      // warnings

    public static let accent = sandglow
    public static let onAccent = graphite
    public static let background = graphite
    public static let surface = basalt
    public static let border = flint
    /// Chosen route is sandglow; alternatives are bone and ice.
    public static let routeColors: [Color] = [sandglow, bone, ice]

    public static func color(for band: Format.ScoreBand) -> Color {
        band == .plain ? ash : sandglow
    }

    public static let corner: CGFloat = 12
    public static let controlCorner: CGFloat = 10
    public static let gutter: CGFloat = 20
    /// Barlow Condensed in the design; system condensed until the font files are bundled.
    public static let displayFont = Font.system(size: 40, weight: .heavy).width(.condensed)
    public static let titleFont = Font.system(size: 26, weight: .bold).width(.condensed)
    public static let headlineFont = Font.system(.headline).weight(.semibold)
    /// JetBrains Mono labels in the design.
    public static let labelFont = Font.system(size: 11, weight: .medium, design: .monospaced)
}
