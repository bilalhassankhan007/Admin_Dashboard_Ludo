// C:\BILAL Important\Project_Dashboard\react\src\views\auth\forgot-password.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Row, Col, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // fake delay / call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let users = [];
      try {
        const raw = localStorage.getItem('appUsers');
        if (raw) users = JSON.parse(raw);
      } catch {
        localStorage.removeItem('appUsers');
      }

      const exists = users.some((u) => u.email === email);
      if (exists) setSuccess('Password reset instructions have been sent to your email');
      else setError('No account found with this email address');
    } catch {
      setError('Something went wrong. Please try again later.');
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
                <div className="mb-4">
                  <FeatherIcon icon="lock" size="48" className="text-primary mb-3" />
                  <h2 className="f-w-600">Forgot Password</h2>
                  <p className="text-muted mb-0">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                {error && <Alert variant="danger" className="py-2">{error}</Alert>}
                {success && <Alert variant="success" className="py-2">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <FeatherIcon icon="mail" size="18" />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-start-0"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn btn-primary w-100 mb-4 rounded-pill py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FeatherIcon icon="send" size="18" className="me-2" />
                        Send Reset Instructions
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <NavLink to="/auth/login" className="text-decoration-none f-w-500">
                    <FeatherIcon icon="arrow-left" size="16" className="me-1" />
                    Back to Sign in
                  </NavLink>
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
