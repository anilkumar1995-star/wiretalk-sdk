const INPUT_CHANNEL_LABEL = 'wiretalk-input';

function buildIceServers(config = {}) {
    const servers = [];
    (config.stun_urls || ['stun:stun.l.google.com:19302']).forEach((url) => {
        servers.push({ urls: url });
    });

    const turnUrls = config.turn_urls || [];
    const username = config.turn_username || '';
    const credential = config.turn_credential || '';
    if (turnUrls.length && username && credential) {
        servers.push({ urls: turnUrls, username, credential });
    }

    return servers.length ? servers : [{ urls: 'stun:stun.l.google.com:19302' }];
}

export class RemoteDesktopHostSession {
    constructor({
        io,
        socketUrl,
        socketToken,
        conversationId,
        hostId,
        hostName,
        ice,
        capturePrimarySource,
        injectInput,
        onStatus = () => {},
    }) {
        this.io = io;
        this.socketUrl = socketUrl;
        this.socketToken = socketToken;
        this.conversationId = conversationId;
        this.hostId = hostId;
        this.hostName = hostName;
        this.iceServers = buildIceServers(ice);
        this.capturePrimarySource = capturePrimarySource;
        this.injectInput = injectInput;
        this.onStatus = onStatus;
        this.socket = null;
        this.peer = null;
        this.localStream = null;
        this.inputChannel = null;
        this._pendingIce = [];
        this._remoteDescriptionSet = false;
    }

    async start() {
        if (!this.io) {
            throw new Error('Socket client unavailable.');
        }

        this.socket = this.io(this.socketUrl, { transports: ['websocket', 'polling'] });
        await new Promise((resolve, reject) => {
            this.socket.on('connect', resolve);
            this.socket.on('connect_error', reject);
        });

        this.socket.emit('join', {
            rooms: [`conversation:${this.conversationId}`],
            token: this.socketToken,
        });

        this.socket.on('remotedesktop:signal', (payload) => void this.handleSignal(payload));

        const source = await this.capturePrimarySource();
        this.localStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                },
            },
        });

        this.peer = new RTCPeerConnection({ iceServers: this.iceServers });
        this.inputChannel = this.peer.createDataChannel(INPUT_CHANNEL_LABEL, { ordered: true });
        this.inputChannel.onmessage = (event) => {
            void this.injectInput(event.data);
        };

        this.peer.onicecandidate = (event) => {
            if (!event.candidate) return;
            this.emit('ice', { candidate: event.candidate.toJSON?.() || event.candidate });
        };

        this.localStream.getTracks().forEach((track) => this.peer.addTrack(track, this.localStream));
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        this.emit('offer', {
            sessionId: crypto.randomUUID(),
            sdp: { type: offer.type, sdp: offer.sdp },
        });
        this.onStatus('Sharing desktop. Agent can now accept control.', 'ok');
    }

    emit(type, extra = {}) {
        this.socket?.emit('remotedesktop:signal', {
            room: `conversation:${this.conversationId}`,
            type,
            payload: {
                conversationId: this.conversationId,
                from: {
                    role: 'remote_host',
                    id: this.hostId,
                    name: this.hostName || 'Remote PC',
                },
                ...extra,
            },
        });
    }

    async handleSignal({ type, payload } = {}) {
        if (String(payload?.conversationId) !== String(this.conversationId)) {
            return;
        }
        if (payload?.from?.role !== 'agent') {
            return;
        }

        if (type === 'answer' && payload?.sdp) {
            await this.peer.setRemoteDescription(payload.sdp);
            this._remoteDescriptionSet = true;
            await this.flushPendingIce();
            this.onStatus('Agent connected. Remote control is active.', 'ok');
            return;
        }

        if (type === 'ice' && payload?.candidate) {
            if (!this.peer || !this._remoteDescriptionSet) {
                this._pendingIce.push(payload.candidate);
                return;
            }
            try {
                await this.peer.addIceCandidate(payload.candidate);
            } catch {
                /* stale */
            }
            return;
        }

        if (type === 'end') {
            this.destroy();
            this.onStatus('Remote desktop session ended.', 'ok');
        }
    }

    async flushPendingIce() {
        const queued = this._pendingIce.splice(0);
        for (const candidate of queued) {
            try {
                await this.peer.addIceCandidate(candidate);
            } catch {
                /* stale */
            }
        }
    }

    destroy() {
        this.socket?.disconnect();
        this.socket = null;
        this.localStream?.getTracks()?.forEach((track) => track.stop());
        this.localStream = null;
        this.peer?.close();
        this.peer = null;
        this.inputChannel = null;
    }
}
