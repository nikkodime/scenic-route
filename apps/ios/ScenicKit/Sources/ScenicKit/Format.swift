import Foundation

public enum Format {
    /// 95 → "1 h 35 min", 40 → "40 min"
    public static func duration(minutes: Double) -> String {
        let m = Int(minutes.rounded())
        if m < 60 { return "\(m) min" }
        return m % 60 == 0 ? "\(m / 60) h" : "\(m / 60) h \(m % 60) min"
    }

    public static func distance(km: Double) -> String {
        km < 10 ? String(format: "%.1f km", km) : "\(Int(km.rounded())) km"
    }

    public static func extra(minutes: Double) -> String {
        minutes < 1 ? "No extra time" : "+\(duration(minutes: minutes))"
    }

    /// Short local time like "16:52" for an ISO timestamp.
    public static func time(_ iso: String?, timeZone: TimeZone = .current) -> String? {
        guard let iso, let d = ISO8601.parse(iso) else { return nil }
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        f.timeZone = timeZone
        return f.string(from: d)
    }

    public enum ScoreBand: String, Sendable { case stunning, lovely, pleasant, plain }

    public static func band(score: Double) -> ScoreBand {
        switch score {
        case 75...: return .stunning
        case 55..<75: return .lovely
        case 35..<55: return .pleasant
        default: return .plain
        }
    }

    public static func verdictText(_ v: String) -> String {
        ["great": "Great day for it", "good": "Good conditions", "mixed": "Mixed weather", "poor": "Views likely hidden"][v] ?? v.capitalized
    }
}
