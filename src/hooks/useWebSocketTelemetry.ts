import { useState, useEffect, useRef, useCallback } from 'react';
import type { TelemetryEvent, AlertLog } from '../types/analytics';

export interface UseWebSocketTelemetryReturn {
  connectionStatus: 'connected' | 'reconnecting' | 'disconnected';
  activeVisitors: number;
  eventsPerMinute: number;
  topPages: Array<{ path: string; activeCount: number }>;
  liveEvents: TelemetryEvent[];
  lastAlert: { alert: any; log: AlertLog; message: string } | null;
  clearLastAlert: () => void;
  sendCustomEvent: (eventName: string, properties?: Record<string, any>) => void;
}

export function useWebSocketTelemetry(projectId: string = 'project_aether_demo'): UseWebSocketTelemetryReturn {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('reconnecting');
  const [activeVisitors, setActiveVisitors] = useState<number>(28);
  const [eventsPerMinute, setEventsPerMinute] = useState<number>(118);
  const [topPages, setTopPages] = useState<Array<{ path: string; activeCount: number }>>([
    { path: '/dashboard', activeCount: 12 },
    { path: '/pricing', activeCount: 7 },
    { path: '/docs/getting-started', activeCount: 5 },
    { path: '/analytics/realtime', activeCount: 4 },
  ]);
  const [liveEvents, setLiveEvents] = useState<TelemetryEvent[]>([]);
  const [lastAlert, setLastAlert] = useState<{ alert: any; log: AlertLog; message: string } | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?projectId=${encodeURIComponent(projectId)}`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        ws.send(JSON.stringify({ type: 'subscribe:project', projectId }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'telemetry:event') {
            const newEvent: TelemetryEvent = data.payload;
            setLiveEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
          } else if (data.type === 'realtime:metrics') {
            if (data.payload.activeVisitors !== undefined) setActiveVisitors(data.payload.activeVisitors);
            if (data.payload.eventsPerMinute !== undefined) setEventsPerMinute(data.payload.eventsPerMinute);
            if (data.payload.topPages) setTopPages(data.payload.topPages);
          } else if (data.type === 'alert:triggered') {
            setLastAlert(data.payload);
          }
        } catch (err) {
          console.error('[WebSocket] message parse error', err);
        }
      };

      ws.onclose = () => {
        setConnectionStatus('reconnecting');
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 10000);
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        setConnectionStatus('reconnecting');
        try {
          ws.close();
        } catch {}
      };
    } catch {
      setConnectionStatus('disconnected');
    }
  }, [projectId]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  const clearLastAlert = useCallback(() => {
    setLastAlert(null);
  }, []);

  const sendCustomEvent = useCallback((eventName: string, properties: Record<string, any> = {}) => {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        eventName,
        properties,
        pageUrl: window.location.pathname,
      }),
    }).catch(console.error);
  }, [projectId]);

  return {
    connectionStatus,
    activeVisitors,
    eventsPerMinute,
    topPages,
    liveEvents,
    lastAlert,
    clearLastAlert,
    sendCustomEvent,
  };
}
