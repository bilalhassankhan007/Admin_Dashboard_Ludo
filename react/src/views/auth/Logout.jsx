import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Card, Alert } from 'react-bootstrap';
import { authUtils } from '../../utils/auth';

/**
 * Logout component that handles user logout
 * This ensures proper cleanup and redirect
 */
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      console.log('=== LOGOUT PAGE DEBUG ===');
      
      // Clear all authentication data
      const logoutSuccess = authUtils.logout();
      
      if (logoutSuccess) {
        // Additional cleanup if needed
        try {
          // Clear any React state if stored in context
          if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
            // Reset React devtools if present
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__.helpers = {};
          }
        } catch (error) {
          console.log('Cleanup error:', error);
        }
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          console.log('Redirecting to login page...');
          navigate('/auth/login', { replace: true });
        }, 1000);
      } else {
        // If logout failed, redirect immediately
        console.error('Logout failed, forcing redirect...');
        window.location.href = '/auth/login';
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="text-center p-4" style={{ width: '300px' }}>
        <Card.Body>
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Logging out...</h5>
          <p className="text-muted">Please wait while we securely log you out.</p>
          <Alert variant="info" className="mt-3">
            <small>Clearing authentication data and redirecting to login.</small>
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Logout;