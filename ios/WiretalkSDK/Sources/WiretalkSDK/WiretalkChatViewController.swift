import UIKit
import WebKit

public final class WiretalkChatViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {
    public var onBridgeEvent: ((WiretalkBridgeEvent) -> Void)?

    private let config: WiretalkConfig
    private lazy var webView: WKWebView = {
        let userContent = WKUserContentController()
        userContent.add(self, name: "wiretalk")

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = userContent
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        let view = WKWebView(frame: .zero, configuration: configuration)
        view.navigationDelegate = self
        view.translatesAutoresizingMaskIntoConstraints = false
        return view
    }()

    public init(config: WiretalkConfig) {
        self.config = config
        super.init(nibName: nil, bundle: nil)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])

        var effectiveConfig = config
        if let saved = UserDefaults.standard.string(forKey: "wiretalk_visitor_uid"), !saved.isEmpty {
            effectiveConfig = WiretalkConfig(
                baseURL: config.baseURL,
                widgetKey: config.widgetKey,
                appId: config.appId,
                platform: config.platform,
                locale: config.locale,
                initialTab: config.initialTab,
                visitorUid: saved,
                visitorName: config.visitorName,
                visitorEmail: config.visitorEmail,
                visitorPhone: config.visitorPhone,
                appVersion: config.appVersion,
                appBuild: config.appBuild
            )
        }

        webView.load(URLRequest(url: effectiveConfig.popoutURL()))
    }

    public func openChat(tab: String = "chat") {
        evaluate(WiretalkBridge.open(tab: tab))
    }

    public func closeChat() {
        evaluate(WiretalkBridge.close())
    }

    public func updateVisitor(name: String? = nil, email: String? = nil, phone: String? = nil) {
        evaluate(WiretalkBridge.updateVisitor(name: name, email: email, phone: phone))
    }

    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "wiretalk" else { return }
        guard let event = WiretalkBridge.parse(message.body) else { return }

        if event.type == "widget:ready", let uid = event.visitorUid {
            UserDefaults.standard.set(uid, forKey: "wiretalk_visitor_uid")
        }

        onBridgeEvent?(event)
    }

    private func evaluate(_ script: String) {
        guard !script.isEmpty else { return }
        webView.evaluateJavaScript(script)
    }
}
