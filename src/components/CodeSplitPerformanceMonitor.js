// CAUSAI Enhanced: Code Splitting Performance Measurement
class CodeSplitPerformanceMonitor {
  constructor() {
    this.measurements = {
      initialLoad: {},
      routeNavigations: {},
      chunkLoading: {}
    };
    this.startTime = performance.now();
    this.init();
  }

  init() {
    this.measureInitialLoad();
    this.measureChunkLoading();
    this.measureRoutePerformance();
  }

  measureInitialLoad() {
    // Measure First Contentful Paint and Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            this.measurements.initialLoad[entry.name] = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            this.measurements.initialLoad.largestContentfulPaint = entry.startTime;
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }

    // Measure Time to Interactive
    this.measureTTI();
  }

  measureTTI() {
    // Simple TTI approximation - when main thread is quiet for 5 seconds
    let lastLongTask = 0;
    
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) { // Long task threshold
            lastLongTask = entry.startTime + entry.duration;
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }

    // Check for TTI after 5 seconds of no long tasks
    setTimeout(() => {
      const now = performance.now();
      if (now - lastLongTask > 5000) {
        this.measurements.initialLoad.timeToInteractive = lastLongTask || now;
      }
    }, 6000);
  }

  measureChunkLoading() {
    // Monitor resource loading for chunks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('.js') && entry.name.includes('/')) {
            const chunkName = entry.name.split('/').pop();
            this.measurements.chunkLoading[chunkName] = {
              size: entry.transferSize,
              loadTime: entry.duration,
              cacheHit: entry.transferSize === 0
            };
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  measureRoutePerformance() {
    // Track route navigation performance
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    const trackNavigation = (url) => {
      const startTime = performance.now();
      
      // Wait for next paint to measure route change performance
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const endTime = performance.now();
          this.measurements.routeNavigations[url] = {
            navigationTime: endTime - startTime,
            timestamp: Date.now()
          };
        });
      });
    };

    history.pushState = function(...args) {
      trackNavigation(args[2] || window.location.pathname);
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      trackNavigation(args[2] || window.location.pathname);
      return originalReplaceState.apply(this, args);
    };
  }

  getBundleMetrics() {
    const resources = performance.getEntriesByType('resource');
    const jsChunks = resources.filter(r => r.name.includes('.js'));
    
    const metrics = {
      totalChunks: jsChunks.length,
      totalJSSize: jsChunks.reduce((sum, chunk) => sum + (chunk.transferSize || 0), 0),
      largestChunk: Math.max(...jsChunks.map(c => c.transferSize || 0)),
      avgChunkSize: jsChunks.reduce((sum, chunk) => sum + (chunk.transferSize || 0), 0) / jsChunks.length,
      cacheHitRate: jsChunks.filter(c => c.transferSize === 0).length / jsChunks.length
    };

    return metrics;
  }

  getPerformanceReport() {
    const bundleMetrics = this.getBundleMetrics();
    
    const report = {
      timestamp: new Date().toISOString(),
      initialLoad: this.measurements.initialLoad,
      bundleMetrics,
      chunkLoading: this.measurements.chunkLoading,
      routeNavigations: this.measurements.routeNavigations,
      scores: this.calculateScores(bundleMetrics)
    };

    return report;
  }

  calculateScores(bundleMetrics) {
    // Calculate performance scores based on metrics
    const scores = {};
    
    // Bundle size score (smaller is better)
    scores.bundleSize = Math.max(0, 100 - (bundleMetrics.totalJSSize / 1024 / 10)); // Penalty per 10KB
    
    // Chunk count score (optimal range 3-8 chunks)
    const optimalChunks = 5;
    scores.chunkOptimization = Math.max(0, 100 - Math.abs(bundleMetrics.totalChunks - optimalChunks) * 10);
    
    // Cache efficiency score
    scores.cacheEfficiency = bundleMetrics.cacheHitRate * 100;
    
    // Overall score
    scores.overall = (scores.bundleSize + scores.chunkOptimization + scores.cacheEfficiency) / 3;
    
    return scores;
  }

  logReport() {
    const report = this.getPerformanceReport();
    console.log('🚀 CAUSAI Code Split Performance Report:', report);
    
    // Store in localStorage for later analysis
    localStorage.setItem('causai_code_split_performance', JSON.stringify(report));
    
    return report;
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.causaiCodeSplitMonitor = new CodeSplitPerformanceMonitor();
      
      // Log report after page is fully loaded and interactive
      setTimeout(() => {
        window.causaiCodeSplitMonitor.logReport();
      }, 3000);
    }, 1000);
  });
}

export default CodeSplitPerformanceMonitor;
