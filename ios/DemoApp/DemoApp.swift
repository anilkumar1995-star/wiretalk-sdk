import SwiftUI
import WiretalkSDK

private enum DemoConfig {
    static let baseURL = URL(string: "https://wiretalk.tech")!
    static let widgetKey = "wk_REPLACE_ME"
    static let appId = "com.wiretalk.demo"
}

struct ContentView: View {
    @State private var unreadCount = 0
    @State private var showChat = false

    var body: some View {
        VStack(spacing: 24) {
            Text("Unread: \(unreadCount)")
                .font(.title2)

            Button("Open support chat") {
                showChat = true
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
        .sheet(isPresented: $showChat) {
            WiretalkChatHost(unreadCount: $unreadCount)
        }
    }
}

private struct WiretalkChatHost: UIViewControllerRepresentable {
    @Binding var unreadCount: Int

    func makeUIViewController(context: Context) -> WiretalkChatViewController {
        let config = WiretalkConfig(
            baseURL: DemoConfig.baseURL,
            widgetKey: DemoConfig.widgetKey,
            appId: DemoConfig.appId,
            visitorName: "Demo User",
            visitorEmail: "demo@example.com"
        )
        let chat = WiretalkChatViewController(config: config)
        chat.onBridgeEvent = { event in
            if event.type == "unread:count" {
                unreadCount = event.unreadCount
            }
        }
        return chat
    }

    func updateUIViewController(_ uiViewController: WiretalkChatViewController, context: Context) {}
}

#Preview {
    ContentView()
}
