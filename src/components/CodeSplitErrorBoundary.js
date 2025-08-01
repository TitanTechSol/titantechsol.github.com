// CAUSAI Enhanced: Error Boundary for Code Splitting Failures
import React from 'react';

class CodeSplitErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log to console for development
    console.error('Code split loading error:', error, errorInfo);

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: this.state.retryCount + 1
      });
      
      // Force page reload as last resort
      if (this.state.retryCount === 2) {
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent } = this.props;

      // If custom fallback component provided, use it
      if (FallbackComponent) {
        return <FallbackComponent onRetry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '2rem auto',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          color: '#856404'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#856404' }}>
            🚧 Content Loading Issue
          </h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            We're having trouble loading this section. This might be due to a slow 
            network connection or a temporary issue.
          </p>
          
          {this.state.retryCount < 3 ? (
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginRight: '1rem'
              }}
            >
              {this.state.retryCount === 2 ? 'Reload Page' : 'Try Again'}
            </button>
          ) : (
            <p style={{ color: '#dc3545', fontSize: '14px' }}>
              If this issue persists, please refresh the page or contact support.
            </p>
          )}

          <button
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Go Back
          </button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ 
              marginTop: '1.5rem', 
              textAlign: 'left', 
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '4px'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                fontSize: '12px', 
                overflow: 'auto', 
                marginTop: '0.5rem',
                color: '#dc3545'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom fallback components for specific scenarios
export const NetworkErrorFallback = ({ onRetry }) => (
  <div style={{
    padding: '3rem 2rem',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '2rem'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📡</div>
    <h3 style={{ marginBottom: '1rem' }}>Connection Issue</h3>
    <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
      Unable to load content. Please check your internet connection.
    </p>
    <button onClick={onRetry} style={{
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '4px',
      cursor: 'pointer'
    }}>
      Retry
    </button>
  </div>
);

export const ComponentErrorFallback = ({ onRetry, componentName }) => (
  <div style={{
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '8px',
    margin: '1rem 0'
  }}>
    <h4 style={{ marginBottom: '1rem' }}>⚠️ {componentName} Unavailable</h4>
    <p style={{ marginBottom: '1rem', fontSize: '14px' }}>
      This component couldn't be loaded right now.
    </p>
    <button onClick={onRetry} style={{
      backgroundColor: '#ffc107',
      color: '#212529',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px'
    }}>
      Try Again
    </button>
  </div>
);

export default CodeSplitErrorBoundary;
