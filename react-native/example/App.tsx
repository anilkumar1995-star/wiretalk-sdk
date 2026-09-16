import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { WiretalkChat } from '@wiretalk/react-native-chat';

const BASE_URL = 'https://wiretalk.tech';
const WIDGET_KEY = 'wk_REPLACE_ME';
const APP_ID = 'com.wiretalk.demo';

export default function App() {
  const [unread, setUnread] = useState(0);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.badge}>Unread: {unread}</Text>
      </View>
      <WiretalkChat
        style={styles.chat}
        config={{
          baseUrl: BASE_URL,
          widgetKey: WIDGET_KEY,
          appId: APP_ID,
          visitorName: 'Demo User',
          visitorEmail: 'demo@example.com',
        }}
        onBridgeEvent={(event) => {
          if (event.type === 'unread:count') {
            setUnread(event.count ?? 0);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  badge: { fontSize: 16, fontWeight: '600' },
  chat: { flex: 1 },
});
