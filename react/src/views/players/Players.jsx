import React from 'react';
import { Card, Table, Badge, Button, Form, Modal, ButtonGroup } from 'react-bootstrap';
import { FaSearch, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Players = () => {
  // --- DATA ---------------------------------------------------------------
  // Keep IDs/names aligned with UserDetails big dummy data
  const playersData = [
    { id: 'P001', name: 'Shashank', status: 'Active', joinDate: '2023-01-15', lastActive: '2023-06-22', totalGames: 132 },
    { id: 'P002', name: 'Amit',     status: 'Active', joinDate: '2023-03-11', lastActive: '2023-06-24', totalGames: 95  },
    { id: 'P003', name: 'Neha',     status: 'Active', joinDate: '2023-02-05', lastActive: '2023-06-23', totalGames: 76  },
    { id: 'P004', name: 'Rahul',    status: 'Active', joinDate: '2023-05-15', lastActive: '2023-06-25', totalGames: 87  },
    { id: 'P005', name: 'Priya',    status: 'Active', joinDate: '2023-04-28', lastActive: '2023-06-24', totalGames: 103 },
  ];

  // --- SEARCH -------------------------------------------------------------
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return playersData;
    return playersData.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [searchTerm, playersData]);

  const getStatusBadge = (status) => (status === 'Active' ? 'success' : 'secondary');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  };

  // --- GLOBAL BOT SETTINGS -----------------------------------------------
  // Persisted for ALL users
  const GLOBAL_BOT_KEY = 'bot:global';
  const defaultGlobalBot = { enabled: false, level: 'LOW' }; // LOW | MEDIUM | HARD

  const [showBotModal, setShowBotModal] = React.useState(false);
  const [botEnabled, setBotEnabled] = React.useState(defaultGlobalBot.enabled);
  const [botLevel, setBotLevel] = React.useState(defaultGlobalBot.level);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(GLOBAL_BOT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed?.enabled === 'boolean') setBotEnabled(parsed.enabled);
        if (parsed?.level) setBotLevel(parsed.level);
      }
    } catch (e) {
      // ignore parse errors; keep defaults
    }
  }, []);

  const persistGlobalBot = async (next) => {
    localStorage.setItem(GLOBAL_BOT_KEY, JSON.stringify(next));
    // Placeholder backend hook — replace with your actual API
    try {
      await fetch('/api/bot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
    } catch (err) {
      console.warn('Failed to sync global BOT settings:', err?.message || err);
    }
  };

  const handleToggleBot = async (nextEnabled) => {
    setBotEnabled(nextEnabled);
    await persistGlobalBot({ enabled: nextEnabled, level: botLevel });
  };

  const handleSelectLevel = async (level) => {
    setBotLevel(level);
    await persistGlobalBot({ enabled: botEnabled, level });
  };

  // --- BOT UI helpers (as per your example) -------------------------------
  const botColors = {
    LOW:    '#0000FF', // brighter blue
    MEDIUM: '#00008B', // dark blue
    HARD:   '#000033', // darkest navy
  };

  const BotLevelButton = ({ level, selected, disabled, onClick }) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: botColors[level],
        borderColor: selected ? '#ffffff' : botColors[level],
        color: '#ffffff',
        fontWeight: 700,
        letterSpacing: '0.5px',
        padding: '10px 18px',
        boxShadow: selected ? '0 0 0 0.2rem rgba(255,255,255,0.25)' : 'none',
        opacity: disabled ? 0.6 : 1,
        borderWidth: selected ? 3 : 1,
        borderRadius: 10,
        minWidth: 110,
      }}
    >
      {level}
    </Button>
  );

  // --- RENDER -------------------------------------------------------------
  return (
    <Card className="shadow-sm" style={{ backgroundColor: '#FDF5E6' }}>
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: '#000000',
          borderBottom: '2px solid #000000'
        }}
      >
        <Card.Title
          as="h4"
          className="mb-0"
          style={{
            color: '#F5F5F5',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}
        >
          <FaUser className="me-2" />
          Players Management
        </Card.Title>

        {/* Search bar + Search button + BOT button (same color as Search) */}
        <div className="d-flex align-items-center">
          <Form.Control
            type="text"
            placeholder="Search by name or ID..."
            className="me-2"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" className="me-2">
            <FaSearch className="me-1" /> Search
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowBotModal(true)}
            title={`BOT is ${botEnabled ? 'ON' : 'OFF'} • Level: ${botLevel}`}
          >
            BOT
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Table
          striped
          bordered
          hover
          responsive
          className="mb-0 text-center align-middle"
          style={{
            backgroundColor: '#FFFAF0',
            fontSize: '1.1rem',
            borderColor: '#000000'
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#000000' }}>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Player ID</th>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Name</th>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Status</th>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Join Date</th>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Last Active</th>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Total Games</th>
              <th className="text-uppercase fw-bold" style={{ color: '#F5F5F5', border: '1px solid #000000' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((player) => (
                <tr key={player.id} style={{ border: '1px solid #000000' }}>
                  <td style={{ border: '1px solid #000000' }}>{player.id}</td>
                  <td className="fw-bold" style={{ border: '1px solid #000000' }}>{player.name}</td>
                  <td style={{ border: '1px solid #000000' }}>
                    <Badge bg={getStatusBadge(player.status)} className="px-3 py-2">
                      {player.status}
                    </Badge>
                  </td>
                  <td style={{ border: '1px solid #000000' }}>{formatDate(player.joinDate)}</td>
                  <td style={{ border: '1px solid #000000' }}>{formatDate(player.lastActive)}</td>
                  <td style={{ border: '1px solid #000000' }}>{player.totalGames}</td>
                  <td style={{ border: '1px solid #000000' }}>
                    <Button
                      as={Link}
                      to={`/user-profile/${player.id}`}
                      state={{ user: player }}
                      variant="outline-primary"
                      size="sm"
                      className="px-3"
                    >
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4" style={{ border: '1px solid #000000' }}>
                  No players found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FDF5E6' }}>
        <small className="text-muted">
          Showing {filteredData.length} of {playersData.length} players
        </small>
        {/* Small status pill for quick glance */}
        <div>
          <Badge bg={botEnabled ? 'success' : 'secondary'} className="me-2">
            BOT: {botEnabled ? 'ON' : 'OFF'}
          </Badge>
          <Badge bg="info">LEVEL: {botLevel}</Badge>
        </div>
      </Card.Footer>

      {/* Global BOT Settings Modal */}
      <Modal show={showBotModal} onHide={() => setShowBotModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>BOT Settings (Global)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            These settings apply <strong>to all users</strong>.
          </p>

          {/* ON/OFF */}
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="global-bot-switch"
              checked={botEnabled}
              onChange={(e) => handleToggleBot(e.target.checked)}
            />
            <label className="form-check-label fw-semibold" htmlFor="global-bot-switch">
              BOT is {botEnabled ? 'ON' : 'OFF'}
            </label>
          </div>

          {/* Levels */}
          <div className="d-flex justify-content-center">
            <ButtonGroup>
              <BotLevelButton
                level="LOW"
                selected={botLevel === 'LOW'}
                disabled={!botEnabled}
                onClick={() => handleSelectLevel('LOW')}
              />
              <BotLevelButton
                level="MEDIUM"
                selected={botLevel === 'MEDIUM'}
                disabled={!botEnabled}
                onClick={() => handleSelectLevel('MEDIUM')}
              />
              <BotLevelButton
                level="HARD"
                selected={botLevel === 'HARD'}
                disabled={!botEnabled}
                onClick={() => handleSelectLevel('HARD')}
              />
            </ButtonGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBotModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Players;
