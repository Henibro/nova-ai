/**
 * Aether Analytics Client SDK v1.0.0
 * Privacy-First Telemetry for Modern Web Products
 * No cookies. No PII. Lightweight (<3KB).
 */
(function (window, document) {
  'use strict';

  var config = {
    projectId: null,
    endpoint: '/api/events',
    autoPageview: true,
    respectDoNotTrack: true,
    debug: false,
  };

  // Generate anonymous ephemeral session and visitor hashes (stored only in sessionStorage/memory, never long-term tracking cookies)
  var sessionHash = (function () {
    try {
      var s = window.sessionStorage.getItem('_aether_s');
      if (!s) {
        s = 's_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
        window.sessionStorage.setItem('_aether_s', s);
      }
      return s;
    } catch (e) {
      return 's_ephemeral_' + Math.random().toString(36).substring(2, 11);
    }
  })();

  var visitorHash = (function () {
    try {
      var v = window.localStorage.getItem('_aether_v');
      if (!v) {
        v = 'v_' + Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 6);
        window.localStorage.setItem('_aether_v', v);
      }
      return v;
    } catch (e) {
      return 'v_ephemeral_' + Math.random().toString(36).substring(2, 11);
    }
  })();

  function isDNT() {
    if (!config.respectDoNotTrack) return false;
    var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return dnt === '1' || dnt === 'yes';
  }

  function getDeviceType() {
    var width = window.innerWidth || document.documentElement.clientWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function sendEvent(eventName, properties) {
    if (!config.projectId) {
      if (config.debug) console.warn('[Aether] Project ID not configured. Call Aether.init({ projectId: "..." })');
      return;
    }

    if (isDNT()) {
      if (config.debug) console.info('[Aether] Event dropped due to Do-Not-Track preference.');
      return;
    }

    var payload = {
      id: 'evt_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      projectId: config.projectId,
      timestamp: new Date().toISOString(),
      eventName: eventName,
      pageUrl: window.location.pathname + window.location.search,
      referrer: document.referrer ? new URL(document.referrer, window.location.href).origin : '',
      deviceType: getDeviceType(),
      sessionHash: sessionHash,
      visitorHash: visitorHash,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      properties: properties || {},
    };

    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(config.endpoint, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true,
      }).catch(function (err) {
        if (config.debug) console.error('[Aether] Telemetry push failed:', err);
      });
    }
  }

  // Core Web Vitals Observer (LCP, CLS, INP/FID, FCP)
  function observePerformance() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // First Contentful Paint
      var paintObserver = new PerformanceObserver(function (entryList) {
        entryList.getEntries().forEach(function (entry) {
          if (entry.name === 'first-contentful-paint') {
            sendEvent('performance_metric', { metric: 'FCP', value: Math.round(entry.startTime) });
          }
        });
      });
      paintObserver.observe({ type: 'paint', buffered: true });

      // Largest Contentful Paint
      var lcpObserver = new PerformanceObserver(function (entryList) {
        var entries = entryList.getEntries();
        if (entries.length > 0) {
          var lastEntry = entries[entries.length - 1];
          sendEvent('performance_metric', { metric: 'LCP', value: Math.round(lastEntry.startTime) });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift
      var clsValue = 0;
      var clsObserver = new PerformanceObserver(function (entryList) {
        entryList.getEntries().forEach(function (entry) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Report CLS on page exit
      window.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden' && clsValue > 0) {
          sendEvent('performance_metric', { metric: 'CLS', value: Math.round(clsValue * 1000) / 1000 });
        }
      });
    } catch (e) {
      if (config.debug) console.warn('[Aether] Web Vitals observer error:', e);
    }
  }

  var Aether = {
    init: function (options) {
      if (!options) return;
      config.projectId = options.projectId || config.projectId;
      config.endpoint = options.endpoint || config.endpoint;
      if (options.autoPageview !== undefined) config.autoPageview = options.autoPageview;
      if (options.respectDoNotTrack !== undefined) config.respectDoNotTrack = options.respectDoNotTrack;
      if (options.debug !== undefined) config.debug = options.debug;

      if (config.autoPageview) {
        sendEvent('page_view', { title: document.title });
      }

      observePerformance();

      // Click listener for data-aether-event attributes
      document.addEventListener('click', function (e) {
        var target = e.target;
        while (target && target !== document) {
          var attr = target.getAttribute && target.getAttribute('data-aether-event');
          if (attr) {
            var propAttr = target.getAttribute('data-aether-prop');
            var props = {};
            if (propAttr) {
              try { props = JSON.parse(propAttr); } catch (err) {}
            }
            sendEvent(attr, props);
            break;
          }
          target = target.parentNode;
        }
      }, true);
    },

    track: function (eventName, properties) {
      sendEvent(eventName, properties);
    },

    page: function (url, properties) {
      var props = properties || {};
      if (url) props.pageUrl = url;
      sendEvent('page_view', props);
    },
  };

  window.Aether = Aether;
})(window, document);
