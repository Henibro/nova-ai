import type {
  OverviewMetrics,
  TimeSeriesPoint,
  BreakdownItem,
  WebVitalMetric,
  Funnel,
  Project,
} from '../types/analytics';

class AnalyticsService {
  public getOverviewMetrics(projectId?: string, dateRange = 'last_7_days'): OverviewMetrics {
    // Multipliers based on date range for realistic dynamic shifts
    let multiplier = 1;
    if (dateRange === 'today') multiplier = 0.14;
    else if (dateRange === 'yesterday') multiplier = 0.16;
    else if (dateRange === 'last_30_days') multiplier = 3.8;
    else if (dateRange === 'last_90_days') multiplier = 11.2;

    const baseVisitors = Math.round(24892 * multiplier);
    const basePageviews = Math.round(81420 * multiplier);
    const baseSessions = Math.round(31204 * multiplier);
    const baseEvents = Math.round(142850 * multiplier);

    return {
      visitors: {
        value: baseVisitors,
        formattedValue: baseVisitors.toLocaleString(),
        previousValue: Math.round(baseVisitors * 0.84),
        changePercentage: 18.4,
        isPositiveGood: true,
      },
      pageViews: {
        value: basePageviews,
        formattedValue: basePageviews.toLocaleString(),
        previousValue: Math.round(basePageviews * 0.82),
        changePercentage: 22.1,
        isPositiveGood: true,
      },
      sessions: {
        value: baseSessions,
        formattedValue: baseSessions.toLocaleString(),
        previousValue: Math.round(baseSessions * 0.87),
        changePercentage: 14.6,
        isPositiveGood: true,
      },
      events: {
        value: baseEvents,
        formattedValue: baseEvents.toLocaleString(),
        previousValue: Math.round(baseEvents * 0.83),
        changePercentage: 19.8,
        isPositiveGood: true,
      },
      conversionRate: {
        value: 4.82,
        formattedValue: '4.82%',
        previousValue: 4.12,
        changePercentage: 17.0,
        isPositiveGood: true,
      },
      avgDurationSec: {
        value: 222,
        formattedValue: '3m 42s',
        previousValue: 205,
        changePercentage: 8.3,
        isPositiveGood: true,
      },
    };
  }

  public getTimeSeries(dateRange = 'last_7_days'): TimeSeriesPoint[] {
    const points: TimeSeriesPoint[] = [];
    const count = dateRange === 'today' || dateRange === 'yesterday' ? 24 : dateRange === 'last_30_days' ? 30 : 7;
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now);
      let dateLabel = '';
      if (count === 24) {
        d.setHours(d.getHours() - i);
        dateLabel = `${d.getHours().toString().padStart(2, '0')}:00`;
      } else {
        d.setDate(d.getDate() - i);
        dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      // Natural organic wave curves
      const baseWave = Math.sin(i * 0.8) * 400 + 3200;
      const visitors = Math.max(1200, Math.round(baseWave + (Math.random() * 300 - 150)));
      const pageViews = Math.round(visitors * (3.1 + Math.random() * 0.4));
      const conversions = Math.round(visitors * (0.045 + Math.random() * 0.01));
      const bounceRate = Math.round((38 + Math.sin(i * 0.5) * 4 + Math.random() * 2) * 10) / 10;
      const avgSessionSec = Math.round(210 + Math.random() * 30);

      points.push({
        timestamp: d.toISOString(),
        dateStr: dateLabel,
        visitors,
        pageViews,
        conversions,
        bounceRate,
        avgSessionSec,
      });
    }

    return points;
  }

  public getTopPages(): BreakdownItem[] {
    return [
      { name: '/dashboard', visitors: 11420, pageViews: 34100, percentage: 41.8, bounceRate: 24.5 },
      { name: '/pricing', visitors: 6400, pageViews: 14200, percentage: 17.4, bounceRate: 31.2 },
      { name: '/docs/getting-started', visitors: 4850, pageViews: 11240, percentage: 13.8, bounceRate: 28.0 },
      { name: '/features/privacy', visitors: 3200, pageViews: 7100, percentage: 8.7, bounceRate: 35.1 },
      { name: '/analytics/realtime', visitors: 2800, pageViews: 6900, percentage: 8.5, bounceRate: 19.8 },
      { name: '/blog/cookie-free-analytics', visitors: 1950, pageViews: 4200, percentage: 5.2, bounceRate: 46.2 },
      { name: '/signup', visitors: 1720, pageViews: 3680, percentage: 4.5, bounceRate: 18.2 },
    ];
  }

  public getReferrers(): BreakdownItem[] {
    return [
      { name: 'Direct / None', visitors: 9800, pageViews: 32100, percentage: 39.4 },
      { name: 'github.com', visitors: 5400, pageViews: 18200, percentage: 22.3 },
      { name: 'google.com', visitors: 4200, pageViews: 14600, percentage: 17.9 },
      { name: 'news.ycombinator.com', visitors: 2800, pageViews: 8900, percentage: 10.9 },
      { name: 'x.com / Twitter', visitors: 1650, pageViews: 4900, percentage: 6.0 },
      { name: 'linkedin.com', visitors: 850, pageViews: 2720, percentage: 3.5 },
    ];
  }

  public getDeviceBreakdown(): BreakdownItem[] {
    return [
      { name: 'Desktop', visitors: 15433, pageViews: 52100, percentage: 62.0 },
      { name: 'Mobile', visitors: 8214, pageViews: 25240, percentage: 33.0 },
      { name: 'Tablet', visitors: 1245, pageViews: 4080, percentage: 5.0 },
    ];
  }

  public getBrowserBreakdown(): BreakdownItem[] {
    return [
      { name: 'Chrome', visitors: 14437, pageViews: 48850, percentage: 58.0 },
      { name: 'Safari', visitors: 5974, pageViews: 19540, percentage: 24.0 },
      { name: 'Firefox', visitors: 2738, pageViews: 8950, percentage: 11.0 },
      { name: 'Edge', visitors: 1742, pageViews: 4080, percentage: 7.0 },
    ];
  }

  public getOSBreakdown(): BreakdownItem[] {
    return [
      { name: 'macOS', visitors: 10454, pageViews: 34200, percentage: 42.0 },
      { name: 'Windows', visitors: 8712, pageViews: 28500, percentage: 35.0 },
      { name: 'iOS', visitors: 3484, pageViews: 11400, percentage: 14.0 },
      { name: 'Android', visitors: 1493, pageViews: 4880, percentage: 6.0 },
      { name: 'Linux', visitors: 746, pageViews: 2440, percentage: 3.0 },
    ];
  }

  public getCountryBreakdown(): BreakdownItem[] {
    return [
      { name: 'United States', visitors: 9450, pageViews: 31000, percentage: 38.0 },
      { name: 'Germany', visitors: 3480, pageViews: 11400, percentage: 14.0 },
      { name: 'United Kingdom', visitors: 2980, pageViews: 9760, percentage: 12.0 },
      { name: 'Canada', visitors: 1740, pageViews: 5700, percentage: 7.0 },
      { name: 'France', visitors: 1490, pageViews: 4880, percentage: 6.0 },
      { name: 'Japan', visitors: 1240, pageViews: 4070, percentage: 5.0 },
      { name: 'Netherlands', visitors: 995, pageViews: 3250, percentage: 4.0 },
      { name: 'Others', visitors: 3517, pageViews: 11360, percentage: 14.0 },
    ];
  }

  public getFunnels(): Funnel[] {
    return [
      {
        id: 'funnel_main_conversion',
        projectId: 'project_aether_demo',
        name: 'Product Onboarding & Checkout',
        description: 'Measures visitors transitioning from landing page to completed subscription.',
        createdAt: '2026-01-15T00:00:00Z',
        totalStarted: 10000,
        totalCompleted: 780,
        overallConversion: 7.8,
        steps: [
          {
            id: 'step_1',
            name: 'Landing Page',
            targetUrl: '/',
            eventName: 'page_view',
            visitors: 10000,
            dropoffCount: 0,
            dropoffRate: 0,
            conversionRate: 100,
          },
          {
            id: 'step_2',
            name: 'Pricing Page',
            targetUrl: '/pricing',
            eventName: 'page_view',
            visitors: 6400,
            dropoffCount: 3600,
            dropoffRate: 36.0,
            conversionRate: 64.0,
          },
          {
            id: 'step_3',
            name: 'Create Account',
            targetUrl: '/signup',
            eventName: 'signup',
            visitors: 2100,
            dropoffCount: 4300,
            dropoffRate: 67.2,
            conversionRate: 21.0,
          },
          {
            id: 'step_4',
            name: 'Subscribe Plan',
            targetUrl: '/checkout',
            eventName: 'purchase',
            visitors: 780,
            dropoffCount: 1320,
            dropoffRate: 62.9,
            conversionRate: 7.8,
          },
        ],
      },
      {
        id: 'funnel_docs_activation',
        projectId: 'project_aether_demo',
        name: 'Developer SDK Activation',
        description: 'Tracking developers from documentation read to generating their first project API key.',
        createdAt: '2026-02-01T00:00:00Z',
        totalStarted: 4850,
        totalCompleted: 1120,
        overallConversion: 23.1,
        steps: [
          {
            id: 'd_step_1',
            name: 'Docs Getting Started',
            targetUrl: '/docs/getting-started',
            eventName: 'page_view',
            visitors: 4850,
            dropoffCount: 0,
            dropoffRate: 0,
            conversionRate: 100,
          },
          {
            id: 'd_step_2',
            name: 'Copy SDK Snippet',
            eventName: 'button_click',
            visitors: 2480,
            dropoffCount: 2370,
            dropoffRate: 48.9,
            conversionRate: 51.1,
          },
          {
            id: 'd_step_3',
            name: 'Send First Event',
            eventName: 'custom',
            visitors: 1120,
            dropoffCount: 1360,
            dropoffRate: 54.8,
            conversionRate: 23.1,
          },
        ],
      },
    ];
  }

  public getWebVitals(): WebVitalMetric[] {
    return [
      {
        name: 'LCP',
        label: 'Largest Contentful Paint',
        unit: 's',
        p75: 1.8,
        p90: 2.2,
        p95: 2.6,
        avg: 1.9,
        rating: 'good',
        thresholds: { good: 2.5, poor: 4.0 },
        description: 'Measures perceived loading speed and marks the point in page load timeline when the main content has likely loaded.',
      },
      {
        name: 'INP',
        label: 'Interaction to Next Paint',
        unit: 'ms',
        p75: 42,
        p90: 78,
        p95: 110,
        avg: 48,
        rating: 'good',
        thresholds: { good: 200, poor: 500 },
        description: 'Assesses overall responsiveness to user interactions like clicks, taps, and key presses throughout the entire page lifecycle.',
      },
      {
        name: 'CLS',
        label: 'Cumulative Layout Shift',
        unit: '',
        p75: 0.04,
        p90: 0.08,
        p95: 0.12,
        avg: 0.05,
        rating: 'good',
        thresholds: { good: 0.1, poor: 0.25 },
        description: 'Measures visual stability to prevent jarring unexpected layout movements while users are reading or interacting.',
      },
      {
        name: 'FCP',
        label: 'First Contentful Paint',
        unit: 's',
        p75: 0.9,
        p90: 1.2,
        p95: 1.5,
        avg: 1.0,
        rating: 'good',
        thresholds: { good: 1.8, poor: 3.0 },
        description: 'Measures the time from when the page starts loading to when any part of the page content is rendered on screen.',
      },
      {
        name: 'TTFB',
        label: 'Time to First Byte',
        unit: 'ms',
        p75: 180,
        p90: 240,
        p95: 320,
        avg: 195,
        rating: 'good',
        thresholds: { good: 800, poor: 1800 },
        description: 'Measures server response latency from initial HTTP request dispatch until the first byte of response data arrives.',
      },
    ];
  }

  public getProjects(): Project[] {
    return [
      {
        id: 'project_aether_demo',
        name: 'Aether Cloud (Production)',
        domain: 'aetheranalytics.io',
        apiKey: 'aether_live_948f29d10e82c19a2b8e',
        createdAt: '2026-01-10T08:00:00Z',
        retentionDays: 90,
        ipAnonymization: true,
        cookieFree: true,
        honorDNT: true,
        totalEvents: 142850,
      },
      {
        id: 'project_mobile_app',
        name: 'Aether iOS & Web App',
        domain: 'app.aetheranalytics.io',
        apiKey: 'aether_live_58c71b029f8a31e847cd',
        createdAt: '2026-02-05T12:00:00Z',
        retentionDays: 30,
        ipAnonymization: true,
        cookieFree: true,
        honorDNT: true,
        totalEvents: 48920,
      },
    ];
  }
}

export const analyticsService = new AnalyticsService();
