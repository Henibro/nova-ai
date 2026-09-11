import type { AlertRule, AlertLog } from '../types/analytics';
import { websocketService } from './websocketService';

class AlertService {
  private alerts: AlertRule[] = [
    {
      id: 'alert_conv_drop',
      projectId: 'project_aether_demo',
      name: 'Conversion Rate Drop Warning',
      metric: 'conversion_rate',
      condition: '<',
      threshold: 2.5,
      timeWindowMin: 60,
      notificationMethod: 'dashboard',
      enabled: true,
      createdAt: '2026-01-20T10:00:00Z',
      triggeredCount: 2,
      lastTriggered: '2026-03-01T14:32:00Z',
    },
    {
      id: 'alert_lcp_spike',
      projectId: 'project_aether_demo',
      name: 'LCP Performance Degradation (>4.0s)',
      metric: 'lcp',
      condition: '>',
      threshold: 4.0,
      timeWindowMin: 15,
      notificationMethod: 'dashboard',
      enabled: true,
      createdAt: '2026-02-10T09:15:00Z',
      triggeredCount: 1,
      lastTriggered: '2026-02-28T18:40:00Z',
    },
    {
      id: 'alert_error_spike',
      projectId: 'project_aether_demo',
      name: 'High JavaScript Error Rate',
      metric: 'error_rate',
      condition: '>',
      threshold: 5.0,
      timeWindowMin: 10,
      notificationMethod: 'dashboard',
      enabled: true,
      createdAt: '2026-02-15T11:00:00Z',
      triggeredCount: 0,
    },
    {
      id: 'alert_active_traffic',
      projectId: 'project_aether_demo',
      name: 'Surge Traffic Milestone (>50 live)',
      metric: 'active_visitors',
      condition: '>=',
      threshold: 50,
      timeWindowMin: 5,
      notificationMethod: 'dashboard',
      enabled: true,
      createdAt: '2026-03-02T14:00:00Z',
      triggeredCount: 4,
      lastTriggered: '2026-03-08T09:12:00Z',
    },
  ];

  private history: AlertLog[] = [
    {
      id: 'hist_1',
      alertId: 'alert_conv_drop',
      alertName: 'Conversion Rate Drop Warning',
      metric: 'conversion_rate',
      currentValue: 2.1,
      threshold: 2.5,
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      status: 'resolved',
    },
    {
      id: 'hist_2',
      alertId: 'alert_lcp_spike',
      alertName: 'LCP Performance Degradation (>4.0s)',
      metric: 'lcp',
      currentValue: 4.3,
      threshold: 4.0,
      timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
      status: 'resolved',
    },
  ];

  public getAlerts(projectId?: string): AlertRule[] {
    if (!projectId || projectId === 'all') return this.alerts;
    return this.alerts.filter((a) => a.projectId === projectId);
  }

  public getHistory(): AlertLog[] {
    return this.history;
  }

  public createAlert(rule: Omit<AlertRule, 'id' | 'createdAt' | 'triggeredCount'>): AlertRule {
    const newAlert: AlertRule = {
      ...rule,
      id: `alert_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      triggeredCount: 0,
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  public toggleAlert(id: string): AlertRule | null {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.enabled = !alert.enabled;
      return alert;
    }
    return null;
  }

  public deleteAlert(id: string): boolean {
    const idx = this.alerts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.alerts.splice(idx, 1);
      return true;
    }
    return false;
  }

  public triggerTestAlert(alertId: string): AlertLog | null {
    const alert = this.alerts.find((a) => a.id === alertId) || this.alerts[0];
    if (!alert) return null;

    alert.triggeredCount++;
    alert.lastTriggered = new Date().toISOString();

    const testLog: AlertLog = {
      id: `log_${Date.now()}`,
      alertId: alert.id,
      alertName: alert.name,
      metric: alert.metric,
      currentValue: alert.threshold + 0.8,
      threshold: alert.threshold,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    this.history.unshift(testLog);

    // Broadcast alert event over WebSocket
    websocketService.broadcast('alert:triggered', {
      alert,
      log: testLog,
      message: `Alert triggered: ${alert.name} (Value: ${testLog.currentValue}, Threshold: ${alert.threshold})`,
    });

    return testLog;
  }
}

export const alertService = new AlertService();
