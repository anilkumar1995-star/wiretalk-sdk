import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// Wiretalk mobile SDK for Flutter (WebView wrapper).
class WiretalkConfig {
  const WiretalkConfig({
    required this.baseUrl,
    required this.widgetKey,
    required this.appId,
    this.platform = 'flutter',
    this.locale = 'en',
    this.initialTab = 'chat',
    this.visitorUid,
    this.visitorName,
    this.visitorEmail,
    this.visitorPhone,
    this.appVersion,
  });

  final String baseUrl;
  final String widgetKey;
  final String appId;
  final String platform;
  final String locale;
  final String initialTab;
  final String? visitorUid;
  final String? visitorName;
  final String? visitorEmail;
  final String? visitorPhone;
  final String? appVersion;

  String popoutUrl() {
    final base = baseUrl.replaceAll(RegExp(r'/+$'), '');
    final params = {
      'locale': locale,
      'tab': initialTab,
      'platform': platform,
      'app_id': appId,
      if (visitorUid != null && visitorUid!.isNotEmpty) 'visitor_uid': visitorUid!,
      if (visitorName != null && visitorName!.isNotEmpty) 'visitor_name': visitorName!,
      if (visitorEmail != null && visitorEmail!.isNotEmpty) 'visitor_email': visitorEmail!,
      if (visitorPhone != null && visitorPhone!.isNotEmpty) 'visitor_phone': visitorPhone!,
      if (appVersion != null && appVersion!.isNotEmpty) 'app_version': appVersion!,
    };
    final query = params.entries
        .map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}')
        .join('&');
    return '$base/popout/${Uri.encodeComponent(widgetKey)}?$query';
  }
}

typedef WiretalkBridgeHandler = void Function(Map<String, dynamic> event);

class WiretalkChatPage extends StatefulWidget {
  const WiretalkChatPage({
    super.key,
    required this.config,
    this.onBridgeEvent,
  });

  final WiretalkConfig config;
  final WiretalkBridgeHandler? onBridgeEvent;

  @override
  State<WiretalkChatPage> createState() => _WiretalkChatPageState();
}

class _WiretalkChatPageState extends State<WiretalkChatPage> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'WiretalkFlutter',
        onMessageReceived: (message) {
          try {
            final event = jsonDecode(message.message) as Map<String, dynamic>;
            if (event['type'] == 'widget:ready' && event['visitor_uid'] != null) {
              persistVisitorUid(event['visitor_uid'].toString());
            }
            widget.onBridgeEvent?.call(event);
          } catch (_) {}
        },
      )
      ..loadRequest(Uri.parse(widget.config.popoutUrl()));
  }

  void openChat({String tab = 'chat'}) {
    _controller.runJavaScript(
      "window.dispatchEvent(new MessageEvent('message', { data: { wiretalk: true, type: 'widget:open', tab: '$tab' } }));",
    );
  }

  void persistVisitorUid(String uid) {
    _controller.runJavaScript(
      "window.dispatchEvent(new MessageEvent('message', { data: { wiretalk: true, type: 'storage:set', key: 'wiretalk_visitor_uid', value: '$uid' } }));",
    );
  }

  @override
  Widget build(BuildContext context) {
    return WebViewWidget(controller: _controller);
  }
}
