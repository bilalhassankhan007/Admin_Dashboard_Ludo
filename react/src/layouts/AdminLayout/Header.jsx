// C:\BILAL Important\Project_Dashboard\react\src\layouts\AdminLayout\Header.jsx
import { Navbar, Nav, Container, Dropdown, Image } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { authUtils } from '../../utils/auth';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authUtils.logout();
    navigate('/auth/login', { replace: true });
  };

  const userEmail = authUtils.getUserEmail() || 'Admin';

  return (
    <Navbar expand="lg" className="navbar-sticky">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/dashboard">
          <h4 className="mb-0 text-primary">Ludo Admin Dashboard</h4>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FeatherIcon icon="menu" />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/dashboard">
              <FeatherIcon icon="grid" size="18" className="me-2" />
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/leaderboard">
              <FeatherIcon icon="award" size="18" className="me-2" />
              Leaderboard
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="user-dropdown" className="text-decoration-none">
                <div className="d-flex align-items-center">
                  <div className="me-2 d-none d-md-block">
                    <div className="text-end">
                      <div className="fw-semibold">{userEmail}</div>
                      <small className="text-muted">Administrator</small>
                    </div>
                  </div>
                  <Image
                    src="https://via.placeholder.com/40"
                    roundedCircle
                    width="40"
                    height="40"
                    className="border"
                  />
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/profile">
                  <FeatherIcon icon="user" size="18" className="me-2" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/settings">
                  <FeatherIcon icon="settings" size="18" className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger" style={{ cursor: 'pointer' }}>
                  <FeatherIcon icon="log-out" size="18" className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
