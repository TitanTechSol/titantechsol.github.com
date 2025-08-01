import React, { useState, useRef, useEffect } from 'react';

// CAUSAI Enhanced LazyImage Component
// Desktop-first responsive WebP images with progressive loading

const LazyImage = ({ 
  src, 
  webpSrc,
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
    const pathPrefix = basePath.substring(0, basePath.lastIndexOf('/'));
    
    if (isBackground) {
      return `${pathPrefix}/optimized/${baseName}.webp 1024w, ${pathPrefix}/optimized/${baseName}@1.5x.webp 1440w, ${pathPrefix}/optimized/${baseName}@2x.webp 1920w`;
    } else {
      return `${pathPrefix}/optimized/team/${baseName}.webp 200w, ${pathPrefix}/optimized/team/${baseName}@1.5x.webp 300w, ${pathPrefix}/optimized/team/${baseName}@2x.webp 400w`;
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
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
    ...style
  };

  return (
    <div ref={imgRef} className={className} style={{ position: 'relative', ...style }}>
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      )}
      
      {isInView && !hasError && (
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            style={imageStyle}
          />
        </picture>
      )}
      
      {hasError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666',
          width: '100%',
          height: '100%',
          minHeight: '100px'
        }}>
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default LazyImage;
