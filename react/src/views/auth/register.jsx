// C:\BILAL Important\Project_Dashboard\react\src\views\auth\register.jsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, InputGroup, Form, Alert } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { authAPI } from '../../services/apiService';

export default function SignUp1() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    else if (formData.first_name.length < 3) newErrors.first_name = 'First name must be at least 3 characters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        first_name: formData.first_name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message || 'Account created successfully! You can now sign in.');
        try {
          sessionStorage.setItem('registrationSuccess', 'Account created successfully! You can now sign in.');
        } catch {}
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 1200);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || error.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless shadow-lg">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body py-5 px-4 px-sm-5">
                <h2 className="mb-3 f-w-600 text-primary">Create Account</h2>
                <p className="text-muted mb-4">Get started with your free account</p>

                {errors.submit && <Alert variant="danger" className="py-2">{errors.submit}</Alert>}
                {successMessage && <Alert variant="success" className="py-2">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FeatherIcon icon="user" size="18" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        isInvalid={!!errors.first_name}
                        className="border-start-0"
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="text-start">
                      {errors.first_name}
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <Form.Group className="mb-4">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FeatherIcon icon="lock" size="18" />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        className="border-start-0"
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid" className="text-start">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn btn-primary w-100 mb-4 rounded-pill py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <FeatherIcon icon="user-plus" size="18" className="me-2" />
                        Sign up
                      </>
                    )}
                  </Button>
                </Form>

                <p className="mb-0 text-muted mt-4">
                  Already have an account?{' '}
                  <NavLink to="/auth/login" className="f-w-500 text-decoration-none">
                    Sign in
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
