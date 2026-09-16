// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "WiretalkSDK",
    platforms: [
        .iOS(.v15),
    ],
    products: [
        .library(name: "WiretalkSDK", targets: ["WiretalkSDK"]),
    ],
    targets: [
        .target(name: "WiretalkSDK"),
    ]
)
