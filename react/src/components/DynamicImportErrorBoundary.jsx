import { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import MainCard from './Card/MainCard';

export default class DynamicImportErrorBoundary extends Component {
  state = { hasError: false, moduleError: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, moduleError: error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, moduleError: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
          <MainCard title="Module Loading Failed">
            <Alert variant="danger" className="mb-4">
              <Alert.Heading>Failed to load module</Alert.Heading>
              <p className="mb-3">{this.state.moduleError?.message}</p>
              <p>This might be a temporary network issue.</p>
            </Alert>
            <Button 
              variant="primary" 
              onClick={this.handleRetry}
              className="me-2"
            >
              Retry Loading
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </MainCard>
        </div>
      );
    }

    return this.props.children;
  }
}