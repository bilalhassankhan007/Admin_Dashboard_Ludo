import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import MainCard from './Card/MainCard';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isImportError: false
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error,
      isImportError: error.message.includes('Failed to fetch dynamically imported module')
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
          <MainCard title={this.state.isImportError ? "Module Loading Failed" : "Something went wrong"}>
            <Alert variant="danger" className="mb-4">
              <Alert.Heading>An error occurred</Alert.Heading>
              <p>{this.state.error?.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <details className="mt-3">
                  <summary>Component stack trace</summary>
                  <pre className="bg-light p-2">{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </Alert>
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={this.handleReset}>
                {this.state.isImportError ? 'Retry Loading' : 'Reload Page'}
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/'}>
                Return to Home
              </Button>
            </div>
          </MainCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;