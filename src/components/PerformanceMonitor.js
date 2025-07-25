import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Web Vitals monitoring
    const observePerformance = () => {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
          // Send to analytics if needed
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
            // Send to analytics if needed
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              console.log('CLS:', entry.value);
              // Send to analytics if needed
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // Navigation timing
      if ('performance' in window && 'timing' in performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log('Page Load Time:', loadTime + 'ms');
            console.log('DOM Content Loaded:', domContentLoaded + 'ms');
            
            // Log slow performance
            if (loadTime > 3000) {
              console.warn('Page load time exceeded 3 seconds:', loadTime + 'ms');
            }
          }, 0);
        });
      }
    };

    observePerformance();
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
