// C:\BILAL Important\Project_Dashboard\react\src\components\ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spinner, Container } from 'react-bootstrap';
import { authUtils } from '../utils/auth';

// Wrap ONLY private layouts/pages with this component.
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      // Send to login and remember where the user came from
      navigate('/auth/login', { replace: true, state: { from: location.pathname } });
    } else {
      setChecking(false);
    }
  }, [navigate, location]);

  if (checking) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Checking authentication...</span>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
