import SwiftUI
import CoreText

/// Design tokens from Panoramica "Atlas" (project design/DESIGN.md, round 3): light, calm, European.
/// Views use only these names, so a design change is a change to this file.
public enum Theme {
    static func hex(_ v: UInt32) -> Color {
        Color(red: Double((v >> 16) & 0xff) / 255, green: Double((v >> 8) & 0xff) / 255, blue: Double(v & 0xff) / 255)
    }

    public static let paper = hex(0xF5F6F3)       // app ground
    public static let surface = hex(0xFFFFFF)     // cards, sheets, inputs
    public static let mist = hex(0xECEFEB)        // segmented track, tags
    public static let tile = hex(0xF2F4F1)        // stat tiles
    public static let line = hex(0xDDE2DE)        // hairlines
    public static let cardBorder = hex(0xE1E6E2)
    public static let ink = hex(0x17262A)         // text and icons
    public static let ink2 = hex(0x4B5A5C)        // secondary text
    public static let ink3 = hex(0x7A8786)        // captions
    public static let green = hex(0x1E6B52)       // chosen route, primary buttons, selected states
    public static let greenDark = hex(0x154D3B)
    public static let greenTint = hex(0xE4EFE9)
    public static let lake = hex(0x2E5E8C)        // alternative routes
    public static let terracotta = hex(0xB85C3C)  // light and sunset only
    public static let burgundy = hex(0x7E2E3E)    // stamp ink for exceptional drives
    public static let warning = hex(0xA23B2A)

    public static let accent = green
    public static let onAccent = Color.white
    public static let background = paper
    public static let border = cardBorder
    /// Chosen route green; alternatives lake blue and burgundy (also the stamp inks).
    public static let routeColors: [Color] = [green, lake, burgundy]

    public static func color(for band: Format.ScoreBand) -> Color {
        band == .plain ? ink3 : green
    }

    public static let corner: CGFloat = 16
    public static let controlCorner: CGFloat = 12
    public static let gutter: CGFloat = 20

    // Sofia Sans everywhere, sentence case; falls back to the system font if registration failed.
    public static func sofia(_ size: CGFloat, _ weight: Font.Weight = .regular, relativeTo style: Font.TextStyle = .body) -> Font {
        let name: String
        switch weight {
        case .bold, .heavy, .black: name = "SofiaSans-Bold"
        case .semibold: name = "SofiaSans-SemiBold"
        case .medium: name = "SofiaSans-Medium"
        default: name = "SofiaSans-Regular"
        }
        return fontsRegistered ? .custom(name, size: size, relativeTo: style) : .system(size: size, weight: weight)
    }
    public static var displayFont: Font { sofia(40, .semibold, relativeTo: .largeTitle) }
    public static var titleFont: Font { sofia(26, .semibold, relativeTo: .title) }
    public static var headlineFont: Font { sofia(18, .semibold, relativeTo: .headline) }
    public static var bodyFont: Font { sofia(16, .regular, relativeTo: .body) }
    public static var buttonFont: Font { sofia(17, .semibold, relativeTo: .headline) }
    /// Eyebrow: the only uppercase text besides stamps.
    public static var labelFont: Font { sofia(12, .semibold, relativeTo: .caption) }

    nonisolated(unsafe) private static var fontsRegistered = false
    /// Call once at launch (the app's init). Safe to call again.
    @MainActor public static func registerFonts() {
        guard !fontsRegistered else { return }
        let urls = ["Regular", "Medium", "SemiBold", "Bold"].compactMap {
            Bundle.module.url(forResource: "SofiaSans-\($0)", withExtension: "ttf", subdirectory: "Fonts")
                ?? Bundle.module.url(forResource: "SofiaSans-\($0)", withExtension: "ttf")
        }
        var ok = !urls.isEmpty
        for url in urls {
            var error: Unmanaged<CFError>?
            if !CTFontManagerRegisterFontsForURL(url as CFURL, .process, &error) {
                // Already registered (e.g. previews) is fine; anything else falls back to the system font.
                let code = (error?.takeRetainedValue()).map { CFErrorGetCode($0) } ?? 0
                if code != CTFontManagerError.alreadyRegistered.rawValue { ok = false }
            }
        }
        fontsRegistered = ok
    }
}
