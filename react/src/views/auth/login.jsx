// C:\BILAL Important\Project_Dashboard\react\src\views\auth\login.jsx
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Card, Row, Col, Button, Form, InputGroup, Alert, Toast, ToastContainer } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { authAPI } from '../../services/apiService';
import { authUtils } from '../../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  // If already authed, bounce to dashboard immediately
  useEffect(() => {
    try {
      if (authUtils.isAuthenticated()) {
        // In a basename router, '/dashboard' is still correct;
        // we also compute a fully-qualified fallback target to be extra safe.
        const base = import.meta.env.VITE_APP_BASE_NAME || '';
        const target = base ? `${base.replace(/\/$/, '')}/dashboard` : '/dashboard';
        navigate('/dashboard', { replace: true });
        // Hard fallback if something blocks SPA navigation (rare)
        setTimeout(() => {
          if (!/\/dashboard$/.test(window.location.pathname)) {
            window.location.replace(target);
          }
        }, 50);
      } else {
        authUtils.logout();
      }
    } catch {
      authUtils.logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Show success message if redirected from Register
  useEffect(() => {
    try {
      const registrationSuccess = sessionStorage.getItem('registrationSuccess');
      if (registrationSuccess) {
        setSuccessMessage(registrationSuccess);
        setShowSuccessToast(true);
        sessionStorage.removeItem('registrationSuccess');
      }
    } catch {
      /* no-op */
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');

    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login({ email: formData.email, password: formData.password });

      // If backend returns success (often { success: true, token: '...' })
      if (response?.data?.success !== false) {
        const tokenish =
          response?.data?.token ||
          response?.data?.accessToken ||
          response?.data?.jwt ||
          response?.data?.authToken ||
          response?.data?.idToken ||
          response?.data?.data?.token ||
          response?.data?.data?.accessToken ||
          response?.data?.result?.token;

        if (!tokenish) {
          throw new Error('Login succeeded but no token found in response.');
        }

        authUtils.setAuthData(tokenish, formData.email, formData.remember);

        // Preferred SPA navigation
        navigate('/dashboard', { replace: true });

        // Extra-safe fallback in case a basename/router quirk blocks SPA navigation
        const base = import.meta.env.VITE_APP_BASE_NAME || '';
        const target = base ? `${base.replace(/\/$/, '')}/dashboard` : '/dashboard';
        setTimeout(() => {
          if (!/\/dashboard$/.test(window.location.pathname)) {
            window.location.replace(target);
          }
        }, 50);
      } else {
        throw new Error(response?.data?.message || 'Login failed');
      }
    } catch (error) {
      setAuthError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1055 }}>
        <Toast onClose={() => setShowSuccessToast(false)} show={showSuccessToast} delay={5000} autohide bg="success">
          <Toast.Header>
            <FeatherIcon icon="check-circle" className="text-success me-2" />
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{successMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="auth-content text-center">
        <Card className="borderless shadow-lg">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body py-5 px-4 px-sm-5">
                <h2 className="mb-3 f-w-600 text-primary">Welcome Back</h2>
                <p className="text-muted mb-4">Sign in to continue to your account</p>

                {authError && <Alert variant="danger" className="py-2">{authError}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FeatherIcon icon="mail" size="18" />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        className="border-start-0"
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="text-start">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FeatherIcon icon="lock" size="18" />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        className="border-start-0"
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="text-start">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      label="Remember me"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="text-muted"
                    />
                    <NavLink to="/auth/forgot-password" className="text-primary f-w-500 text-decoration-none">
                      Forgot password?
                    </NavLink>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn btn-primary w-100 mb-4 rounded-pill py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FeatherIcon icon="log-in" size="18" className="me-2" />
                        Sign in
                      </>
                    )}
                  </Button>
                </Form>

                <p className="mb-0 text-muted mt-4">
                  Don't have an account?{' '}
                  <NavLink to="/auth/register" className="f-w-500 text-decoration-none">
                    Sign up
                  </NavLink>
                </p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
