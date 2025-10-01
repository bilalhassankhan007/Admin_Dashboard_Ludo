import React from 'react';
import { Card, Row, Col, Image, Tab, Nav } from 'react-bootstrap';

const PlayerProfile = () => {
  const player = {
    id: 'P001',
    name: 'Shashank',
    avatar: '/path/to/avatar.jpg',
    wins: 15,
    losses: 5,
    winRate: '75%',
    totalEarnings: 1200,
    joinDate: '2023-01-15'
  };

  return (
    <div className="player-profile">
      <Card>
        <Card.Body>
          <Row className="align-items-center mb-4">
            <Col md={2}>
              <Image src={player.avatar} roundedCircle width={120} />
            </Col>
            <Col md={10}>
              <h2>{player.name}</h2>
              <p className="text-muted">Player ID: {player.id}</p>
            </Col>
          </Row>

          <Tab.Container defaultActiveKey="overview">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="overview">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="stats">Statistics</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="history">Game History</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="p-3">
              <Tab.Pane eventKey="overview">
                <Row>
                  <Col md={6}>
                    <p><strong>Total Wins:</strong> {player.wins}</p>
                    <p><strong>Total Losses:</strong> {player.losses}</p>
                    <p><strong>Win Rate:</strong> {player.winRate}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Total Earnings:</strong> ${player.totalEarnings}</p>
                    <p><strong>Member Since:</strong> {player.joinDate}</p>
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="stats">
                {/* Statistics content */}
              </Tab.Pane>
              <Tab.Pane eventKey="history">
                {/* Game history content */}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PlayerProfile;