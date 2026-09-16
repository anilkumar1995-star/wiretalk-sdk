import React, { useCallback, useMemo, useRef } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import type { WiretalkBridgeEvent, WiretalkConfig } from './types';
import { buildPopoutUrl, bridgeCommand, parseBridgeMessage } from './url';

type Props = {
  config: WiretalkConfig;
  style?: StyleProp<ViewStyle>;
  onBridgeEvent?: (event: WiretalkBridgeEvent) => void;
};

export function WiretalkChat({ config, style, onBridgeEvent }: Props) {
  const webRef = useRef<WebView>(null);
  const uri = useMemo(() => buildPopoutUrl(config), [config]);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    const parsed = parseBridgeMessage(event.nativeEvent.data);
    if (parsed) {
      if (parsed.type === 'widget:ready' && parsed.visitor_uid) {
        webRef.current?.injectJavaScript(
          bridgeCommand('storage:set', { key: 'wiretalk_visitor_uid', value: parsed.visitor_uid }),
        );
      }
      onBridgeEvent?.(parsed);
    }
  }, [onBridgeEvent]);

  return (
    <WebView
      ref={webRef}
      source={{ uri }}
      style={[{ flex: 1 }, style]}
      javaScriptEnabled
      domStorageEnabled
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      onMessage={onMessage}
    />
  );
}

export function openChat(webRef: React.RefObject<WebView | null>, tab = 'chat') {
  webRef.current?.injectJavaScript(bridgeCommand('widget:open', { tab }));
}

export function updateVisitor(
  webRef: React.RefObject<WebView | null>,
  fields: { name?: string; email?: string; phone?: string },
) {
  webRef.current?.injectJavaScript(bridgeCommand('visitor:update', fields));
}
