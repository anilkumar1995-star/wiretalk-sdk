export type WiretalkPlatform = 'android' | 'ios' | 'react-native' | 'flutter' | 'capacitor' | 'cordova';

export type WiretalkConfig = {
  baseUrl: string;
  widgetKey: string;
  appId: string;
  platform?: WiretalkPlatform;
  locale?: string;
  initialTab?: 'chat' | 'home';
  visitorUid?: string;
  visitorName?: string;
  visitorEmail?: string;
  visitorPhone?: string;
  appVersion?: string;
};

export type WiretalkBridgeEvent = {
  type: string;
  count?: number;
  visitor_uid?: string;
  conversation_id?: number;
  message_id?: number;
  body?: string;
  open?: boolean;
  tab?: string;
  platform?: string;
};
