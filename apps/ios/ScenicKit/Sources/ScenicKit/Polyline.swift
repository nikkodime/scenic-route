import Foundation

/// Google encoded polyline (the API sends precision 5).
public enum Polyline {
    public static func decode(_ s: String, precision: Int = 5) -> [Coordinate] {
        let f = pow(10.0, Double(precision))
        var out: [Coordinate] = []
        let bytes = Array(s.utf8)
        var i = 0, lat = 0, lon = 0
        func next() -> Int? {
            var shift = 0, result = 0
            while i < bytes.count {
                let b = Int(bytes[i]) - 63
                i += 1
                result |= (b & 0x1f) << shift
                shift += 5
                if b < 0x20 { return (result & 1) != 0 ? ~(result >> 1) : (result >> 1) }
            }
            return nil
        }
        while i < bytes.count {
            guard let dLat = next(), let dLon = next() else { break }
            lat += dLat; lon += dLon
            out.append(Coordinate(lat: Double(lat) / f, lon: Double(lon) / f))
        }
        return out
    }

    /// Great-circle distance in km.
    public static func km(_ a: Coordinate, _ b: Coordinate) -> Double {
        let r = Double.pi / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r
        let h = sin(dLat / 2) * sin(dLat / 2) + cos(a.lat * r) * cos(b.lat * r) * sin(dLon / 2) * sin(dLon / 2)
        return 12742 * asin(min(1, sqrt(h)))
    }

    /// The point `atKm` along a line (clamped to its ends), e.g. to place a highlight that only knows its km.
    public static func coordinate(on line: [Coordinate], atKm target: Double) -> Coordinate? {
        guard var prev = line.first else { return nil }
        var done = 0.0
        for p in line.dropFirst() {
            let step = km(prev, p)
            if step > 0, done + step >= target {
                let t = max(0, (target - done) / step)
                return Coordinate(lat: prev.lat + (p.lat - prev.lat) * t, lon: prev.lon + (p.lon - prev.lon) * t)
            }
            done += step
            prev = p
        }
        return line.last
    }

    public static func encode(_ line: [Coordinate], precision: Int = 5) -> String {
        let f = pow(10.0, Double(precision))
        var out = "", pLat = 0, pLon = 0
        func enc(_ v: Int) {
            var v = v < 0 ? ~(v << 1) : (v << 1)
            while v >= 0x20 {
                out.unicodeScalars.append(UnicodeScalar(UInt8((0x20 | (v & 0x1f)) + 63)))
                v >>= 5
            }
            out.unicodeScalars.append(UnicodeScalar(UInt8(v + 63)))
        }
        for p in line {
            let lat = Int((p.lat * f).rounded()), lon = Int((p.lon * f).rounded())
            enc(lat - pLat); enc(lon - pLon)
            pLat = lat; pLon = lon
        }
        return out
    }
}

public enum GPX {
    /// GPX 1.1 track with scenic stops as waypoints, for OsmAnd, Organic Maps and car units.
    public static func make(name: String, line: [Coordinate], stops: [ScenicStop] = []) -> String {
        func esc(_ s: String) -> String {
            s.replacingOccurrences(of: "&", with: "&amp;").replacingOccurrences(of: "<", with: "&lt;")
                .replacingOccurrences(of: ">", with: "&gt;").replacingOccurrences(of: "\"", with: "&quot;")
        }
        let f = { (x: Double) in String(format: "%.6f", x) }
        let wpts = stops.enumerated().map { i, s in "<wpt lat=\"\(f(s.lat))\" lon=\"\(f(s.lon))\"><name>\(esc(s.name.isEmpty ? "Stop \(i + 1)" : s.name))</name></wpt>" }.joined()
        let trk = line.map { "<trkpt lat=\"\(f($0.lat))\" lon=\"\(f($0.lon))\"/>" }.joined()
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><gpx version=\"1.1\" creator=\"scenic-route\" xmlns=\"http://www.topografix.com/GPX/1/1\"><metadata><name>\(esc(name))</name></metadata>\(wpts)<trk><name>\(esc(name))</name><trkseg>\(trk)</trkseg></trk></gpx>"
    }
}
