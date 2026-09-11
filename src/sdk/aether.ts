/**
 * Aether Analytics TypeScript Client SDK
 */

export interface AetherConfig {
  projectId: string;
  endpoint?: string;
  autoPageview?: boolean;
  respectDoNotTrack?: boolean;
  debug?: boolean;
}

class AetherTracker {
  private config: AetherConfig = {
    projectId: '',
    endpoint: '/api/events',
    autoPageview: true,
    respectDoNotTrack: true,
    debug: false,
  };

  private sessionHash: string = '';
  private visitorHash: string = '';

  constructor() {
    this.initHashes();
  }

  private initHashes() {
    if (typeof window === 'undefined') return;
    try {
      let s = sessionStorage.getItem('_aether_s');
      if (!s) {
        s = 's_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        sessionStorage.setItem('_aether_s', s);
      }
      this.sessionHash = s;

      let v = localStorage.getItem('_aether_v');
      if (!v) {
        v = 'v_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 6);
        localStorage.setItem('_aether_v', v);
      }
      this.visitorHash = v;
    } catch {
      this.sessionHash = 's_ephemeral_' + Math.random().toString(36).substring(2, 9);
      this.visitorHash = 'v_ephemeral_' + Math.random().toString(36).substring(2, 9);
    }
  }

  public init(config: AetherConfig) {
    this.config = { ...this.config, ...config };
    if (this.config.autoPageview && typeof window !== 'undefined') {
      this.track('page_view', { title: document.title });
    }
  }

  public track(eventName: string, properties: Record<string, any> = {}) {
    if (!this.config.projectId) {
      if (this.config.debug) console.warn('[Aether] Project ID not set.');
      return;
    }

    if (this.config.respectDoNotTrack && typeof navigator !== 'undefined') {
      const dnt = navigator.doNotTrack || (window as any).doNotTrack;
      if (dnt === '1' || dnt === 'yes') return;
    }

    const payload = {
      id: 'evt_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      projectId: this.config.projectId,
      timestamp: new Date().toISOString(),
      eventName,
      pageUrl: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/',
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : '',
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      sessionHash: this.sessionHash,
      visitorHash: this.visitorHash,
      properties,
    };

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(this.config.endpoint || '/api/events', JSON.stringify(payload));
    } else if (typeof fetch !== 'undefined') {
      fetch(this.config.endpoint || '/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch((e) => {
        if (this.config.debug) console.error('[Aether] send error', e);
      });
    }
  }
}

export const Aether = new AetherTracker();
