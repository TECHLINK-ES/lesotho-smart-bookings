import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title text-error">Something went wrong</h2>
            </div>
            <div className="alert alert-error">
              <p>An unexpected error occurred. Please refresh the page and try again.</p>
              <details style={{ marginTop: '1rem' }}>
                <summary>Error details</summary>
                <pre style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;