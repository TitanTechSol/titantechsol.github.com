import React, { useState, useRef, useEffect } from 'react';

// CAUSAI Enhanced LazyImage Component
// Desktop-first responsive WebP images with progressive loading

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {},
  width,
  height,
  loading = 'lazy',
  onLoad,
  isBackground = false,
  sizes = "(min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const imgRef = useRef();

  // Generate responsive WebP srcset
  const generateSrcSet = (basePath) => {
    if (!basePath) return '';
    
    const baseName = basePath.split('/').pop().split('.')[0];
    
    // If path already points to optimized directory, use the directory structure as-is
    if (basePath.includes('/optimized/')) {
      const pathPrefix = basePath.substring(0, basePath.lastIndexOf('/'));
      if (isBackground) {
        return `${pathPrefix}/${baseName}.webp 1024w, ${pathPrefix}/${baseName}@1.5x.webp 1440w, ${pathPrefix}/${baseName}@2x.webp 1920w`;
      } else {
        return `${pathPrefix}/${baseName}.webp 1x, ${pathPrefix}/${baseName}@1.5x.webp 1.5x, ${pathPrefix}/${baseName}@2x.webp 2x`;
      }
    }
    
    // Legacy path handling for non-optimized paths
    const pathPrefix = basePath.substring(0, basePath.lastIndexOf('/'));
    if (isBackground) {
      return `${pathPrefix}/optimized/${baseName}.webp 1024w, ${pathPrefix}/optimized/${baseName}@1.5x.webp 1440w, ${pathPrefix}/optimized/${baseName}@2x.webp 1920w`;
    } else {
      return `${pathPrefix}/optimized/team/${baseName}.webp 1x, ${pathPrefix}/optimized/team/${baseName}@1.5x.webp 1.5x, ${pathPrefix}/optimized/team/${baseName}@2x.webp 2x`;
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading earlier for better UX
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsBlurred(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsBlurred(false);
  };

  const imageStyle = {
    ...style,
    transition: 'all 0.3s ease-in-out',
    filter: isBlurred && !hasError ? 'blur(5px)' : 'none',
    opacity: isLoaded || hasError ? 1 : 0.7,
    backgroundColor: '#f0f0f0',
    display: 'block',
    width: width || '100%',
    height: height || 'auto'
  };

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        style={{
          ...imageStyle,
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}
        className={className}
        aria-label={`Loading ${alt}`}
      >
        <div style={{ color: '#6c757d', fontSize: '14px' }}>Loading...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div 
        style={{
          ...imageStyle,
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #dee2e6'
        }}
        className={className}
        aria-label={`Failed to load ${alt}`}
      >
        <div style={{ color: '#6c757d', fontSize: '14px' }}>Image unavailable</div>
      </div>
    );
  }

  // Generate WebP src path
  const generateWebPSrc = (basePath) => {
    if (!basePath) return basePath;
    
    // If path already points to optimized directory, use as-is
    if (basePath.includes('/optimized/')) {
      return basePath;
    }
    
    const baseName = basePath.split('/').pop().split('.')[0];
    const pathPrefix = basePath.substring(0, basePath.lastIndexOf('/'));
    
    if (isBackground) {
      return `${pathPrefix}/optimized/${baseName}.webp`;
    } else {
      return `${pathPrefix}/optimized/team/${baseName}.webp`;
    }
  };

  const srcSet = generateSrcSet(src);
  const webpSrc = generateWebPSrc(src);

  return (
    <img
      ref={imgRef}
      src={webpSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onLoad={handleLoad}
      onError={handleError}
      style={imageStyle}
      className={className}
      decoding="async"
    />
  );
};

export default LazyImage;
