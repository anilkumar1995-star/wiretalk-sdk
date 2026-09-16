import Foundation

public struct WiretalkBridgeEvent {
    public let type: String
    public let raw: [String: Any]

    public var visitorUid: String? { raw["visitor_uid"] as? String }
    public var conversationId: Int? { raw["conversation_id"] as? Int }
    public var unreadCount: Int { raw["count"] as? Int ?? 0 }
    public var messageId: Int? { raw["message_id"] as? Int }
    public var messageBody: String? { raw["body"] as? String }
    public var isOpen: Bool { raw["open"] as? Bool ?? false }
    public var tab: String? { raw["tab"] as? String }
}

public enum WiretalkBridge {
    public static func parse(_ payload: Any) -> WiretalkBridgeEvent? {
        let dict: [String: Any]?
        if let string = payload as? String,
           let data = string.data(using: .utf8),
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            dict = json
        } else if let json = payload as? [String: Any] {
            dict = json
        } else {
            dict = nil
        }

        guard let dict, let type = dict["type"] as? String, !type.isEmpty else {
            return nil
        }

        return WiretalkBridgeEvent(type: type, raw: dict)
    }

    public static func command(type: String, fields: [String: Any] = [:]) -> String {
        var payload: [String: Any] = ["wiretalk": true, "type": type]
        fields.forEach { payload[$0.key] = $0.value }

        guard let data = try? JSONSerialization.data(withJSONObject: payload),
              let json = String(data: data, encoding: .utf8) else {
            return ""
        }

        return "window.dispatchEvent(new MessageEvent('message', { data: \(json) }));"
    }

    public static func open(tab: String = "chat") -> String {
        command(type: "widget:open", fields: ["tab": tab])
    }

    public static func close() -> String {
        command(type: "widget:close")
    }

    public static func toggle() -> String {
        command(type: "widget:toggle")
    }

    public static func updateVisitor(name: String? = nil, email: String? = nil, phone: String? = nil) -> String {
        var fields: [String: Any] = [:]
        if let name { fields["name"] = name }
        if let email { fields["email"] = email }
        if let phone { fields["phone"] = phone }
        return command(type: "visitor:update", fields: fields)
    }

    public static func storageSet(key: String, value: String) -> String {
        command(type: "storage:set", fields: ["key": key, "value": value])
    }
}
