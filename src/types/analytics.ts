export type EventType =
  | 'page_view'
  | 'page_exit'
  | 'button_click'
  | 'form_submit'
  | 'signup'
  | 'login'
  | 'purchase'
  | 'scroll'
  | 'error'
  | 'custom';

export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface TelemetryEvent {
  id: string;
  projectId: string;
  timestamp: string; // ISO 8601
  eventName: EventType | string;
  pageUrl: string;
  referrer: string;
  deviceType: DeviceType;
  browser: string;
  os: string;
  country: string;
  region?: string;
  sessionHash: string; // anonymized session hash
  visitorHash: string; // anonymized visitor hash
  properties: Record<string, any>;
  durationMs?: number;
  viewport?: { width: number; height: number };
}

export interface KpiMetric {
  value: number;
  formattedValue: string;
  previousValue: number;
  changePercentage: number;
  isPositiveGood?: boolean;
}

export interface OverviewMetrics {
  visitors: KpiMetric;
  pageViews: KpiMetric;
  sessions: KpiMetric;
  events: KpiMetric;
  conversionRate: KpiMetric;
  avgDurationSec: KpiMetric;
}

export interface TimeSeriesPoint {
  timestamp: string;
  dateStr: string;
  visitors: number;
  pageViews: number;
  conversions: number;
  bounceRate: number;
  avgSessionSec: number;
}

export interface BreakdownItem {
  name: string;
  visitors: number;
  pageViews: number;
  percentage: number;
  value?: number;
  icon?: string;
  bounceRate?: number;
}

export interface WebVitalMetric {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB' | string;
  label: string;
  unit: string;
  p75: number;
  p90: number;
  p95: number;
  avg: number;
  value?: number;
  threshold?: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  thresholds: {
    good: number;
    poor: number;
  };
  description: string;
}

export interface FunnelStep {
  id: string;
  name: string;
  stepOrder?: number;
  targetUrl?: string;
  eventName?: string;
  visitors: number;
  dropoffCount: number;
  dropoffRate: number;
  conversionRate?: number;
}

export interface Funnel {
  id: string;
  projectId: string;
  name: string;
  description: string;
  steps: FunnelStep[];
  overallConversion: number;
  totalStarted: number;
  totalCompleted: number;
  createdAt: string;
}

export interface AlertRule {
  id: string;
  projectId: string;
  name: string;
  metric: 'conversion_rate' | 'lcp' | 'error_rate' | 'active_visitors' | 'bounce_rate' | string;
  condition: '>' | '<' | '>=' | '<=' | 'gt' | 'lt' | string;
  threshold: number;
  timeWindowMin: number;
  notificationMethod: 'dashboard' | 'webhook' | 'email';
  enabled: boolean;
  createdAt: string;
  lastTriggered?: string;
  triggeredCount: number;
}

export interface AlertLog {
  id: string;
  alertId: string;
  alertName: string;
  metric: string;
  currentValue: number;
  threshold: number;
  timestamp: string;
  triggeredAt?: string;
  status: 'active' | 'resolved';
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  createdAt: string;
  retentionDays: number;
  ipAnonymization: boolean;
  cookieFree: boolean;
  honorDNT: boolean;
  totalEvents: number;
}

export type DateRangePreset =
  | 'today'
  | 'yesterday'
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'custom';

export interface GlobalFilter {
  dateRange: DateRangePreset;
  startDate?: string;
  endDate?: string;
  device?: DeviceType | 'all';
  browser?: string | 'all';
  os?: string | 'all';
  country?: string | 'all';
  eventType?: string | 'all';
}

export interface RealtimeData {
  activeVisitors: number;
  eventsPerMinute: number;
  topPages: Array<{ path: string; activeCount: number }>;
  recentEvents: TelemetryEvent[];
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
}
