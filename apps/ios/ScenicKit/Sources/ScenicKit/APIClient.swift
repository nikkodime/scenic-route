import Foundation

public enum APIError: Error, LocalizedError, Equatable {
    case http(Int, String)
    case invalidResponse
    case offline

    public var errorDescription: String? {
        switch self {
        case .http(_, let message): return message
        case .invalidResponse: return "The server sent something unexpected."
        case .offline: return "You're offline. Saved trips still work."
        }
    }
}

/// Network seam so tests can run without a server.
public protocol HTTPTransport: Sendable {
    func send(_ request: URLRequest) async throws -> (Data, HTTPURLResponse)
}

public struct URLSessionTransport: HTTPTransport {
    let session: URLSession
    public init(session: URLSession = .shared) { self.session = session }
    public func send(_ request: URLRequest) async throws -> (Data, HTTPURLResponse) {
        do {
            let (data, resp) = try await session.data(for: request)
            guard let http = resp as? HTTPURLResponse else { throw APIError.invalidResponse }
            return (data, http)
        } catch let e as URLError where [.notConnectedToInternet, .networkConnectionLost, .cannotConnectToHost, .timedOut].contains(e.code) {
            throw APIError.offline
        }
    }
}

/// Where the API token lives. The app uses the Keychain; tests use memory.
public protocol TokenStore: Sendable {
    func load() -> String?
    func save(_ token: String?)
}

public final class MemoryTokenStore: TokenStore, @unchecked Sendable {
    private var token: String?
    private let lock = NSLock()
    public init(_ token: String? = nil) { self.token = token }
    public func load() -> String? { lock.withLock { token } }
    public func save(_ t: String?) { lock.withLock { token = t } }
}

public final class APIClient: Sendable {
    public let baseURL: URL
    let transport: HTTPTransport
    let tokens: TokenStore

    public init(baseURL: URL, transport: HTTPTransport = URLSessionTransport(), tokens: TokenStore = MemoryTokenStore()) {
        self.baseURL = baseURL; self.transport = transport; self.tokens = tokens
    }

    static let encoder: JSONEncoder = JSONEncoder()
    static let decoder: JSONDecoder = JSONDecoder()

    func request<T: Decodable>(_ method: String, _ path: String, query: [URLQueryItem] = [], body: (any Encodable)? = nil, auth: Bool = false, as: T.Type = T.self) async throws -> T {
        var comps = URLComponents(url: baseURL.appendingPathComponent(path), resolvingAgainstBaseURL: false)!
        if !query.isEmpty { comps.queryItems = query }
        var req = URLRequest(url: comps.url!, timeoutInterval: 45)
        req.httpMethod = method
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        req.setValue(Locale.current.language.languageCode?.identifier ?? "en", forHTTPHeaderField: "Accept-Language")
        if let body {
            req.httpBody = try Self.encoder.encode(body)
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        }
        if auth {
            let token = try await ensureToken()
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        let (data, resp) = try await transport.send(req)
        guard (200..<300).contains(resp.statusCode) || resp.statusCode == 409 else {
            if resp.statusCode == 401 && auth { tokens.save(nil) }
            let msg = (try? JSONDecoder().decode([String: AnyCodable].self, from: data))?["error"]?.string ?? "Server error \(resp.statusCode)"
            throw APIError.http(resp.statusCode, msg)
        }
        if T.self == Empty.self { return Empty() as! T }
        do { return try Self.decoder.decode(T.self, from: data) } catch { throw APIError.invalidResponse }
    }

    /// Anonymous device account on first use: no sign-up before the first drive.
    public func ensureToken() async throws -> String {
        if let t = tokens.load() { return t }
        struct Auth: Decodable { let token: String; let userId: String }
        let a: Auth = try await request("POST", "v1/auth/anonymous")
        tokens.save(a.token)
        return a.token
    }

    public func signInWithApple(identityToken: String) async throws {
        struct Body: Encodable { let identityToken: String }
        struct Auth: Decodable { let token: String }
        let a: Auth = try await request("POST", "v1/auth/apple", body: Body(identityToken: identityToken), auth: tokens.load() != nil)
        tokens.save(a.token)
    }

    public func plan(_ req: PlanRequest) async throws -> PlanResponse {
        try await request("POST", "v1/plan", body: req)
    }

    public func geocode(_ q: String, near: Coordinate? = nil) async throws -> [Place] {
        struct R: Decodable { let results: [Place] }
        var query = [URLQueryItem(name: "q", value: q)]
        if let near { query += [URLQueryItem(name: "lat", value: String(near.lat)), URLQueryItem(name: "lon", value: String(near.lon))] }
        let r: R = try await request("GET", "v1/geocode", query: query)
        return r.results
    }

    public func trip(id: UUID) async throws -> Trip {
        try await request("GET", "v1/trips/\(id.uuidString.lowercased())", auth: true)
    }

    public func sync(cursor: Int?, changes: SyncChanges) async throws -> SyncResponse {
        try await request("POST", "v1/sync", body: SyncRequest(cursor: cursor, changes: changes), auth: true)
    }
}

public struct Empty: Codable, Sendable { public init() {} }

/// Minimal JSON value for reading error bodies.
public enum AnyCodable: Codable, Sendable {
    case string(String), number(Double), bool(Bool), other
    public init(from decoder: Decoder) throws {
        let c = try decoder.singleValueContainer()
        if let s = try? c.decode(String.self) { self = .string(s) }
        else if let n = try? c.decode(Double.self) { self = .number(n) }
        else if let b = try? c.decode(Bool.self) { self = .bool(b) }
        else { self = .other }
    }
    public func encode(to encoder: Encoder) throws {}
    var string: String? { if case .string(let s) = self { return s }; return nil }
}
