import Foundation

/// The driver's logbook: finished drives, newest first, kept on the phone.
public actor LogbookStore {
    private let fileURL: URL
    private var drives: [LoggedDrive] = []

    public init(fileURL: URL = LogbookStore.defaultURL()) {
        self.fileURL = fileURL
        if let data = try? Data(contentsOf: fileURL) {
            let dec = JSONDecoder()
            dec.dateDecodingStrategy = .iso8601
            drives = (try? dec.decode([LoggedDrive].self, from: data)) ?? []
        }
    }

    public static func defaultURL() -> URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("logbook.json")
    }

    public var all: [LoggedDrive] { drives.sorted { $0.date > $1.date } }

    public func add(_ d: LoggedDrive) {
        drives.removeAll { $0.id == d.id }
        drives.append(d)
        persist()
    }

    public func delete(_ id: UUID) {
        drives.removeAll { $0.id == id }
        persist()
    }

    private func persist() {
        let enc = JSONEncoder()
        enc.dateEncodingStrategy = .iso8601
        if let data = try? enc.encode(drives) { try? data.write(to: fileURL, options: .atomic) }
    }
}
