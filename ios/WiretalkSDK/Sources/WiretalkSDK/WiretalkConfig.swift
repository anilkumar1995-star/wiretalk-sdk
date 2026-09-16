import Foundation

public enum WiretalkPlatform: String {
    case android
    case ios
    case reactNative = "react-native"
    case flutter
    case capacitor
    case cordova
}

public struct WiretalkConfig {
    public let baseURL: URL
    public let widgetKey: String
    public let appId: String
    public let platform: WiretalkPlatform
    public let locale: String
    public let initialTab: String
    public let visitorUid: String?
    public let visitorName: String?
    public let visitorEmail: String?
    public let visitorPhone: String?
    public let appVersion: String?
    public let appBuild: String?

    public init(
        baseURL: URL,
        widgetKey: String,
        appId: String,
        platform: WiretalkPlatform = .ios,
        locale: String = "en",
        initialTab: String = "chat",
        visitorUid: String? = nil,
        visitorName: String? = nil,
        visitorEmail: String? = nil,
        visitorPhone: String? = nil,
        appVersion: String? = nil,
        appBuild: String? = nil
    ) {
        self.baseURL = baseURL
        self.widgetKey = widgetKey
        self.appId = appId
        self.platform = platform
        self.locale = locale
        self.initialTab = initialTab
        self.visitorUid = visitorUid
        self.visitorName = visitorName
        self.visitorEmail = visitorEmail
        self.visitorPhone = visitorPhone
        self.appVersion = appVersion
        self.appBuild = appBuild
    }

    public func popoutURL() -> URL {
        var components = URLComponents(url: baseURL.appendingPathComponent("popout/\(widgetKey)"), resolvingAgainstBaseURL: false)!
        var items = [
            URLQueryItem(name: "locale", value: locale),
            URLQueryItem(name: "tab", value: initialTab),
            URLQueryItem(name: "platform", value: platform.rawValue),
            URLQueryItem(name: "app_id", value: appId),
        ]
        if let visitorUid, !visitorUid.isEmpty { items.append(URLQueryItem(name: "visitor_uid", value: visitorUid)) }
        if let visitorName, !visitorName.isEmpty { items.append(URLQueryItem(name: "visitor_name", value: visitorName)) }
        if let visitorEmail, !visitorEmail.isEmpty { items.append(URLQueryItem(name: "visitor_email", value: visitorEmail)) }
        if let visitorPhone, !visitorPhone.isEmpty { items.append(URLQueryItem(name: "visitor_phone", value: visitorPhone)) }
        if let appVersion, !appVersion.isEmpty { items.append(URLQueryItem(name: "app_version", value: appVersion)) }
        if let appBuild, !appBuild.isEmpty { items.append(URLQueryItem(name: "app_build", value: appBuild)) }
        components.queryItems = items
        return components.url!
    }

    public static func generateVisitorUid() -> String {
        UUID().uuidString.lowercased()
    }
}
