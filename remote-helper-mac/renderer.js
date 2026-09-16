import { RemoteDesktopHostSession } from './host-session.js';

const statusEl = document.getElementById('status');
const connectBtn = document.getElementById('connect-btn');
const apiBaseInput = document.getElementById('api-base');
const codeInput = document.getElementById('pairing-code');
const hostNameInput = document.getElementById('host-name');

let activeSession = null;

function setStatus(text, type = '') {
    statusEl.textContent = text;
    statusEl.className = `status ${type}`.trim();
}

function normalizeApiBase(value) {
    return String(value || '').trim().replace(/\/+$/, '');
}

async function pair(apiBase, pairingCode, hostName) {
    const response = await fetch(`${apiBase}/api/remote-desktop/pair`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pairing_code: pairingCode,
            host_name: hostName,
        }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.message || data?.errors?.pairing_code?.[0] || 'Pairing failed.');
    }

    return data;
}

connectBtn.addEventListener('click', async () => {
    const apiBase = normalizeApiBase(apiBaseInput.value || localStorage.getItem('wiretalkHelperApiBase'));
    const pairingCode = codeInput.value.trim();
    const hostName = hostNameInput.value.trim() || undefined;

    if (!apiBase) {
        setStatus('Enter your Wiretalk server URL.', 'err');
        return;
    }
    if (!pairingCode) {
        setStatus('Enter the pairing code from your agent.', 'err');
        return;
    }

    localStorage.setItem('wiretalkHelperApiBase', apiBase);
    connectBtn.disabled = true;
    setStatus('Pairing…');

    try {
        activeSession?.destroy?.();
        const paired = await pair(apiBase, pairingCode, hostName);
        setStatus('Connected. Waiting for agent to accept control…', 'ok');

        activeSession = new RemoteDesktopHostSession({
            io: window.io,
            socketUrl: paired.socket_url,
            socketToken: paired.socket_token,
            conversationId: paired.conversation_id,
            hostId: paired.host_id,
            hostName: paired.host_name,
            ice: paired.ice,
            capturePrimarySource: () => window.wiretalkHelper.capturePrimarySource(),
            injectInput: (payload) => window.wiretalkHelper.injectInput(payload),
            onStatus: setStatus,
        });

        await activeSession.start();
    } catch (error) {
        setStatus(error.message || 'Could not connect.', 'err');
    } finally {
        connectBtn.disabled = false;
    }
});

apiBaseInput.value = localStorage.getItem('wiretalkHelperApiBase') || '';
