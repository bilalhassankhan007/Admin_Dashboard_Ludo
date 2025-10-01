import React from 'react';
import { Alert } from 'react-bootstrap';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Reset error boundary when children change
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="warning" className="my-3">
          <Alert.Heading>Chart Display Issue</Alert.Heading>
          <p>
            There was a problem displaying this chart. This usually happens when 
            the page is navigating away or data is being refreshed.
          </p>
          <div className="mt-2">
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;