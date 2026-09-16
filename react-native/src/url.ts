import type { WiretalkConfig } from './types';

export function buildPopoutUrl(config: WiretalkConfig): string {
  const base = config.baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams({
    locale: config.locale ?? 'en',
    tab: config.initialTab ?? 'chat',
    platform: config.platform ?? 'react-native',
    app_id: config.appId,
  });
  if (config.visitorUid) params.set('visitor_uid', config.visitorUid);
  if (config.visitorName) params.set('visitor_name', config.visitorName);
  if (config.visitorEmail) params.set('visitor_email', config.visitorEmail);
  if (config.visitorPhone) params.set('visitor_phone', config.visitorPhone);
  if (config.appVersion) params.set('app_version', config.appVersion);
  return `${base}/popout/${encodeURIComponent(config.widgetKey)}?${params.toString()}`;
}

export function parseBridgeMessage(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return parsed?.type ? parsed : null;
  } catch {
    return null;
  }
}

export function bridgeCommand(type: string, fields: Record<string, unknown> = {}): string {
  const payload = JSON.stringify({ wiretalk: true, type, ...fields });
  return `window.dispatchEvent(new MessageEvent('message', { data: ${payload} }));`;
}
