import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import LeaderboardChart from '../../components/charts/LeaderboardChart';
import { dashboardAPI } from '../../services/apiService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getDashboardData();
        if (response.data.success) {
          setDashboardData(response.data);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center" style={{ color: '#003333' }}>Ludo Game Dashboard</h1>
          </Col>
        </Row>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="text-center" style={{ color: '#003333' }}>Ludo Game Dashboard</h1>
          </Col>
        </Row>
        <Alert variant="danger" className="m-4">
          Error loading dashboard data: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center" style={{ color: '#003333' }}>Ludo Game Dashboard</h1>
        </Col>
      </Row>

      {/* Dashboard Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Total Users</h5>
            </Card.Header>
            <Card.Body>
              <Card.Text className="h2 text-primary">
                {dashboardData?.totalUsers || 0}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
              Registered players
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">Live Players</h5>
            </Card.Header>
            <Card.Body>
              <Card.Text className="h2 text-success">
                {dashboardData?.livePlayers || 0}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
              Currently active
            </Card.Footer>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Total Bid Values</h5>
            </Card.Header>
            <Card.Body>
              <Card.Text className="h2 text-info">
                ₹{dashboardData?.totalBidValues || 0}
              </Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
              Total bids placed
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-4" style={{ color: '#336666' }}>
                <i className="bi bi-trophy-fill me-2"></i>
                Player Leaderboard
              </Card.Title>
              <LeaderboardChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;

