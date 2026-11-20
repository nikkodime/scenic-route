import SwiftUI
import CoreText
#if canImport(UIKit)
import UIKit
#endif

/// Design tokens from Panoramica "Atlas" (project design/DESIGN.md, round 3): light, calm, European.
/// Views use only these names, so a design change is a change to this file.
/// Each colour has a dusk value for dark mode: deep slate ground, pale ink, a lighter green that still carries white text.
public enum Theme {
    static func hex(_ v: UInt32) -> Color {
        Color(red: Double((v >> 16) & 0xff) / 255, green: Double((v >> 8) & 0xff) / 255, blue: Double(v & 0xff) / 255)
    }

    /// A colour that follows the appearance: `light` by day, `dark` in dark mode.
    static func hex(_ light: UInt32, dark: UInt32) -> Color {
        #if canImport(UIKit)
        func ui(_ v: UInt32) -> UIColor {
            UIColor(red: CGFloat((v >> 16) & 0xff) / 255, green: CGFloat((v >> 8) & 0xff) / 255, blue: CGFloat(v & 0xff) / 255, alpha: 1)
        }
        return Color(uiColor: UIColor { $0.userInterfaceStyle == .dark ? ui(dark) : ui(light) })
        #else
        return hex(light)
        #endif
    }

    public static let paper = hex(0xF5F6F3, dark: 0x0F181B)       // app ground
    public static let surface = hex(0xFFFFFF, dark: 0x18242A)     // cards, sheets, inputs
    public static let mist = hex(0xECEFEB, dark: 0x1F2D33)        // segmented track, tags
    public static let tile = hex(0xF2F4F1, dark: 0x1B282E)        // stat tiles
    public static let line = hex(0xDDE2DE, dark: 0x2B3A40)        // hairlines
    /// The morning sky behind the islands, fading into paper; a night sky in dark mode.
    public static let sky = hex(0xDEE8ED, dark: 0x16283A)
    public static let cardBorder = hex(0xE1E6E2, dark: 0x27363C)
    public static let ink = hex(0x17262A, dark: 0xE9EFED)         // text and icons
    public static let ink2 = hex(0x4B5A5C, dark: 0xAAB7B5)        // secondary text
    public static let ink3 = hex(0x7A8786, dark: 0x7F8E8C)        // captions
    public static let green = hex(0x1E6B52, dark: 0x2A8664)       // chosen route, primary buttons, selected states
    public static let greenDark = hex(0x154D3B, dark: 0x9BD6BD)
    public static let greenTint = hex(0xE4EFE9, dark: 0x17362C)
    public static let lake = hex(0x2E5E8C, dark: 0x6D9FD0)        // alternative routes
    public static let terracotta = hex(0xB85C3C, dark: 0xD8835F)  // light and sunset only
    public static let burgundy = hex(0x7E2E3E, dark: 0xC46A7C)    // stamp ink for exceptional drives
    public static let warning = hex(0xA23B2A, dark: 0xE27A64)

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
