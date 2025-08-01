// CAUSAI Performance Monitor for Image Optimization
// Tracks LCP improvements and image loading metrics

class ImagePerformanceMonitor {
  constructor() {
    this.metrics = {
      imagesLoaded: 0,
      totalImageSize: 0,
      webpSupported: this.checkWebPSupport(),
      lcpElement: null,
      lcpTime: null,
      imageLoadTimes: []
    };
    
    this.init();
  }

  init() {
    // Monitor LCP (Largest Contentful Paint)
    this.observeLCP();
    
    // Monitor image loading
    this.observeImageLoading();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => this.reportMetrics(), 2000);
    });
  }

  checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.metrics.lcpTime = lastEntry.startTime;
      this.metrics.lcpElement = lastEntry.element;
      
      // Check if LCP element is an image
      if (lastEntry.element && lastEntry.element.tagName === 'IMG') {
        console.log('🎯 CAUSAI: LCP element is an image:', {
          src: lastEntry.element.src,
          time: Math.round(lastEntry.startTime),
          element: lastEntry.element
        });
      }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  observeImageLoading() {
    // Monitor all images on the page
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const startTime = performance.now();
      
      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        this.metrics.imageLoadTimes.push({
          index,
          src: img.src,
          loadTime: Math.round(loadTime),
          isWebP: img.src.includes('.webp'),
          size: this.getImageSize(img)
        });
        
        this.metrics.imagesLoaded++;
      });
      
      img.addEventListener('error', () => {
        console.warn('🚨 CAUSAI: Image failed to load:', img.src);
      });
    });
  }

  getImageSize(img) {
    // Estimate file size based on dimensions and format
    const area = img.naturalWidth * img.naturalHeight;
    const isWebP = img.src.includes('.webp');
    // Rough estimation: WebP is ~30% smaller than JPEG
    return isWebP ? area * 0.7 : area;
  }

  reportMetrics() {
    const report = {
      timestamp: new Date().toISOString(),
      lcp: this.metrics.lcpTime ? Math.round(this.metrics.lcpTime) : null,
      imagesLoaded: this.metrics.imagesLoaded,
      webpSupported: this.metrics.webpSupported,
      averageImageLoadTime: this.getAverageLoadTime(),
      webpUsage: this.getWebPUsage(),
      performanceGrade: this.calculateGrade()
    };

    console.log('📊 CAUSAI Image Performance Report:', report);
    
    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'image_performance', {
        'lcp_time': report.lcp,
        'images_loaded': report.imagesLoaded,
        'webp_usage': report.webpUsage,
        'performance_grade': report.performanceGrade
      });
    }
    
    // Store in localStorage for debugging
    localStorage.setItem('causai_image_performance', JSON.stringify(report));
    
    return report;
  }

  getAverageLoadTime() {
    if (this.metrics.imageLoadTimes.length === 0) return 0;
    const total = this.metrics.imageLoadTimes.reduce((sum, img) => sum + img.loadTime, 0);
    return Math.round(total / this.metrics.imageLoadTimes.length);
  }

  getWebPUsage() {
    if (this.metrics.imageLoadTimes.length === 0) return 0;
    const webpImages = this.metrics.imageLoadTimes.filter(img => img.isWebP).length;
    return Math.round((webpImages / this.metrics.imageLoadTimes.length) * 100);
  }

  calculateGrade() {
    let score = 100;
    
    // LCP penalty (should be under 2.5s)
    if (this.metrics.lcpTime > 2500) score -= 30;
    else if (this.metrics.lcpTime > 1500) score -= 15;
    
    // WebP usage bonus
    const webpUsage = this.getWebPUsage();
    if (webpUsage > 80) score += 10;
    else if (webpUsage < 50) score -= 20;
    
    // Average load time penalty
    const avgLoadTime = this.getAverageLoadTime();
    if (avgLoadTime > 1000) score -= 20;
    else if (avgLoadTime > 500) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  // Public method to get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      averageLoadTime: this.getAverageLoadTime(),
      webpUsage: this.getWebPUsage(),
      grade: this.calculateGrade()
    };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.causaiImageMonitor = new ImagePerformanceMonitor();
  });
} else {
  window.causaiImageMonitor = new ImagePerformanceMonitor();
}

export default ImagePerformanceMonitor;
