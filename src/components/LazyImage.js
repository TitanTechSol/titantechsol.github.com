import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  webpSrc, 
  alt, 
  className, 
  style,
  width,
  height,
  loading = 'lazy',
  onLoad,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiNhYWEiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

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
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
  };

  const imageStyle = {
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
