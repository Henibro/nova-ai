import { anonymizeIp, sanitizeUrl, parseUserAgent, sanitizeProperties } from './privacyService';
import { websocketService } from './websocketService';
import type { TelemetryEvent, RealtimeData } from '../types/analytics';

interface IngestEventInput {
  id?: string;
  projectId: string;
  eventName: string;
  pageUrl?: string;
  referrer?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser?: string;
  os?: string;
  country?: string;
  sessionHash?: string;
  visitorHash?: string;
  properties?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  dnt?: boolean;
}

class TelemetryService {
  private events: TelemetryEvent[] = [];
  private activeSessions: Map<string, { lastSeen: number; pageUrl: string; projectId: string }> = new Map();
  private maxBufferSize = 5000;
  private demoInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.seedInitialEvents();
    this.startActiveSessionPruning();
    this.startDemoLiveTraffic();
  }

  public ingest(input: IngestEventInput): TelemetryEvent | null {
    if (!input.projectId || !input.eventName) {
      return null;
    }

    if (input.dnt) {
      return null;
    }

    // IP Anonymization (raw IP is never saved)
    const { privacyHash } = anonymizeIp(input.ip);

    // UA parsing if not provided
    const uaInfo = parseUserAgent(input.userAgent);

    const sessionHash = input.sessionHash || `sess_${privacyHash}_${Math.floor(Date.now() / (30 * 60 * 1000))}`;
    const visitorHash = input.visitorHash || `vis_${privacyHash}`;
    const pageUrl = sanitizeUrl(input.pageUrl || '/');

    const event: TelemetryEvent = {
      id: input.id || `evt_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
      projectId: input.projectId,
      timestamp: new Date().toISOString(),
      eventName: input.eventName,
      pageUrl,
      referrer: input.referrer ? sanitizeUrl(input.referrer) : '',
      deviceType: input.deviceType || uaInfo.device,
      browser: input.browser || uaInfo.browser,
      os: input.os || uaInfo.os,
      country: input.country || 'United States',
      sessionHash,
      visitorHash,
      properties: sanitizeProperties(input.properties || {}),
    };

    // Store in circular buffer
    this.events.unshift(event);
    if (this.events.length > this.maxBufferSize) {
      this.events.pop();
    }

    // Update active sessions map (sessions within last 5 minutes)
    this.activeSessions.set(sessionHash, {
      lastSeen: Date.now(),
      pageUrl,
      projectId: input.projectId,
    });

    // Broadcast event to WebSockets
    websocketService.broadcast('telemetry:event', event, input.projectId);

    // Broadcast updated active visitors count
    this.broadcastActiveVisitors(input.projectId);

    return event;
  }

  public getRecentEvents(projectId?: string, limit = 50): TelemetryEvent[] {
    const list = projectId && projectId !== 'all' ? this.events.filter((e) => e.projectId === projectId) : this.events;
    return list.slice(0, limit);
  }

  public getActiveVisitorsCount(projectId?: string): number {
    const now = Date.now();
    const FIVE_MIN = 5 * 60 * 1000;
    let count = 0;
    for (const [, session] of this.activeSessions) {
      if (now - session.lastSeen <= FIVE_MIN) {
        if (!projectId || projectId === 'all' || session.projectId === projectId) {
          count++;
        }
      }
    }
    // Floor of active visitors for realistic display in demo
    return Math.max(count, 14);
  }

  public getActiveTopPages(projectId?: string): Array<{ path: string; activeCount: number }> {
    const now = Date.now();
    const FIVE_MIN = 5 * 60 * 1000;
    const pageCounts = new Map<string, number>();

    for (const [, session] of this.activeSessions) {
      if (now - session.lastSeen <= FIVE_MIN) {
        if (!projectId || projectId === 'all' || session.projectId === projectId) {
          pageCounts.set(session.pageUrl, (pageCounts.get(session.pageUrl) || 0) + 1);
        }
      }
    }

    const result = Array.from(pageCounts.entries())
      .map(([path, activeCount]) => ({ path, activeCount }))
      .sort((a, b) => b.activeCount - a.activeCount);

    if (result.length === 0) {
      return [
        { path: '/dashboard', activeCount: 6 },
        { path: '/analytics', activeCount: 4 },
        { path: '/docs/api', activeCount: 3 },
        { path: '/pricing', activeCount: 2 },
      ];
    }
    return result;
  }

  public getRealtimeState(projectId?: string): RealtimeData {
    return {
      activeVisitors: this.getActiveVisitorsCount(projectId),
      eventsPerMinute: Math.round(this.getActiveVisitorsCount(projectId) * 4.2),
      topPages: this.getActiveTopPages(projectId),
      recentEvents: this.getRecentEvents(projectId, 25),
      connectionStatus: 'connected',
    };
  }

  private broadcastActiveVisitors(projectId: string) {
    const active = this.getActiveVisitorsCount(projectId);
    websocketService.broadcast('realtime:metrics', {
      activeVisitors: active,
      eventsPerMinute: Math.round(active * 4.2),
      topPages: this.getActiveTopPages(projectId),
    }, projectId);
  }

  private startActiveSessionPruning() {
    setInterval(() => {
      const now = Date.now();
      const FIVE_MIN = 5 * 60 * 1000;
      for (const [key, session] of this.activeSessions) {
        if (now - session.lastSeen > FIVE_MIN) {
          this.activeSessions.delete(key);
        }
      }
    }, 60000);
  }

  private seedInitialEvents() {
    const samplePages = ['/dashboard', '/pricing', '/signup', '/docs', '/analytics', '/features', '/settings'];
    const sampleEvents = ['page_view', 'button_click', 'scroll', 'signup', 'form_submit'];
    const sampleBrowsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const sampleOS = ['macOS', 'Windows', 'Linux', 'iOS', 'Android'];
    const sampleCountries = ['United States', 'Germany', 'United Kingdom', 'Canada', 'France', 'Japan'];

    const now = Date.now();
    for (let i = 0; i < 40; i++) {
      const timeOffset = Math.floor(Math.random() * 10 * 60 * 1000);
      const pageUrl = samplePages[Math.floor(Math.random() * samplePages.length)];
      const eventName = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

      this.events.push({
        id: `evt_seed_${i}`,
        projectId: 'project_aether_demo',
        timestamp: new Date(now - timeOffset).toISOString(),
        eventName,
        pageUrl,
        referrer: 'https://github.com',
        deviceType: Math.random() > 0.4 ? 'desktop' : 'mobile',
        browser: sampleBrowsers[Math.floor(Math.random() * sampleBrowsers.length)],
        os: sampleOS[Math.floor(Math.random() * sampleOS.length)],
        country: sampleCountries[Math.floor(Math.random() * sampleCountries.length)],
        sessionHash: `sess_seed_${Math.floor(i / 3)}`,
        visitorHash: `vis_seed_${Math.floor(i / 3)}`,
        properties: { label: eventName, section: pageUrl.replace('/', '') },
      });
    }

    // Seed some active sessions
    for (let i = 0; i < 16; i++) {
      this.activeSessions.set(`sess_active_${i}`, {
        lastSeen: now - Math.floor(Math.random() * 3 * 60 * 1000),
        pageUrl: samplePages[Math.floor(Math.random() * samplePages.length)],
        projectId: 'project_aether_demo',
      });
    }
  }

  // Generate continuous live telemetry for real-time demonstration
  private startDemoLiveTraffic() {
    const samplePages = [
      '/dashboard',
      '/pricing',
      '/signup',
      '/docs/getting-started',
      '/analytics/realtime',
      '/checkout',
      '/features/privacy',
    ];
    const sampleEvents = ['page_view', 'button_click', 'scroll', 'page_view', 'custom'];

    this.demoInterval = setInterval(() => {
      if (websocketService.getConnectedClientsCount() >= 0) {
        const pageUrl = samplePages[Math.floor(Math.random() * samplePages.length)];
        const eventName = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

        this.ingest({
          projectId: 'project_aether_demo',
          eventName,
          pageUrl,
          deviceType: Math.random() > 0.35 ? 'desktop' : 'mobile',
          referrer: Math.random() > 0.5 ? 'https://google.com' : 'https://news.ycombinator.com',
          properties: {
            buttonId: eventName === 'button_click' ? 'cta-get-started' : undefined,
            scrollDepth: eventName === 'scroll' ? 75 : undefined,
          },
        });
      }
    }, 4500);
  }
}

export const telemetryService = new TelemetryService();
