import 'package:flutter/material.dart';
import 'package:wiretalk_chat/wiretalk_chat.dart';

const baseUrl = 'https://wiretalk.tech';
const widgetKey = 'wk_REPLACE_ME';
const appId = 'com.wiretalk.demo';

void main() {
  runApp(const WiretalkDemoApp());
}

class WiretalkDemoApp extends StatelessWidget {
  const WiretalkDemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wiretalk Demo',
      theme: ThemeData(colorSchemeSeed: Colors.indigo, useMaterial3: true),
      home: const DemoHomePage(),
    );
  }
}

class DemoHomePage extends StatefulWidget {
  const DemoHomePage({super.key});

  @override
  State<DemoHomePage> createState() => _DemoHomePageState();
}

class _DemoHomePageState extends State<DemoHomePage> {
  int unread = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Wiretalk Demo')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text('Unread: $unread', style: Theme.of(context).textTheme.titleMedium),
          ),
          Expanded(
            child: WiretalkChatPage(
              config: const WiretalkConfig(
                baseUrl: baseUrl,
                widgetKey: widgetKey,
                appId: appId,
                visitorName: 'Demo User',
                visitorEmail: 'demo@example.com',
              ),
              onBridgeEvent: (event) {
                if (event['type'] == 'unread:count') {
                  setState(() => unread = (event['count'] as num?)?.toInt() ?? 0);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
