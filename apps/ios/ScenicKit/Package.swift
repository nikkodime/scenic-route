// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "ScenicKit",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [.library(name: "ScenicKit", targets: ["ScenicKit"])],
    targets: [
        .target(name: "ScenicKit"),
        .testTarget(name: "ScenicKitTests", dependencies: ["ScenicKit"], resources: [.copy("Fixtures")]),
    ]
)
