// C:\BILAL Important\Project_Dashboard\react\src\layouts\AdminLayout\NavBar\NavRight\index.jsx
// Full component (ready to paste). Uses authUtils for logout + redirects to /auth/login.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ListGroup,
  Dropdown,
  Form,
  Modal,
  Tabs,
  Tab,
  Row,
  Col,
  Button,
  InputGroup,
  Badge,
  Table,
  ProgressBar,
  ButtonGroup
} from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import { authUtils } from '../../../../utils/auth'; // <-- correct relative path with your structure
import avatar2 from 'assets/images/user/avatar-2.jpg';

/* =============================================================================
   LocalStorage keys (swap these to API calls later)
============================================================================= */
const LS_KEYS = {
  PROFILE: 'admin:profile',
  NOTIFS: 'admin:notifications',
  DEVICES: 'admin:devices',
  PASSWORD: 'admin:password',
  USERS: 'admin:users'
};

/* =============================================================================
   Defaults (seed data)
============================================================================= */
const DEFAULT_PROFILE = {
  name: 'Joseph William',
  email: 'joseph@example.com',
  phone: '+1 555-123-4567',
  timezone: 'Asia/Kolkata',
  locale: 'en-IN',
  avatar: '', // dataURL or file marker
  avatarMeta: { fileName: '', mime: '' }
};

const DEFAULT_NOTIFS = {
  inApp: true,
  email: true,
  sms: false,
  whatsapp: false
};

const DEFAULT_DEVICES = [
  { id: 'dev1', name: 'Chrome · Windows', ip: '203.0.113.10', lastActive: '2025-08-10 11:24', current: true },
  { id: 'dev2', name: 'Safari · iPhone', ip: '198.51.100.77', lastActive: '2025-07-28 09:02', current: false }
];

const DEFAULT_USERS = [
  { id: 'u1', name: 'Alice Singh', email: 'alice@company.com', role: 'Super Admin', status: 'Active', lastActive: '2025-08-16 17:20' },
  { id: 'u2', name: 'Vikram Rao',  email: 'vikram@company.com', role: 'Finance',     status: 'Active', lastActive: '2025-08-15 21:03' },
  { id: 'u3', name: 'Neha Patel',  email: 'neha@company.com',   role: 'Support',     status: 'Inactive', lastActive: '2025-08-01 08:41' },
  { id: 'u4', name: 'Rohit Mehra', email: 'rohit@company.com',  role: 'Game Ops',    status: 'Active', lastActive: '2025-08-17 10:10' },
  { id: 'u5', name: 'Zara Khan',   email: 'zara@company.com',   role: 'Read-only',   status: 'Active', lastActive: '2025-08-14 14:55' }
];

// very simple "hash" placeholder (replace with server-side hashing later)
const hashish = (s) => btoa(unescape(encodeURIComponent(s || '')));

const DEFAULT_PASSWORD = {
  // current password is "Admin@123" for demo — rotate to your real backend later
  current: hashish('Admin@123'),
  history: [hashish('Admin@122'), hashish('Admin@121'), hashish('Admin@120')] // last 3
};

/* =============================================================================
   DPI Reading Helpers (JPEG JFIF + PNG pHYs). Best-effort only.
============================================================================= */
async function readFileAsArrayBuffer(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsArrayBuffer(file);
  });
}

function parseJpegDPI(buf) {
  const dv = new DataView(buf);
  if (dv.getUint16(0) !== 0xffd8) return null; // JPEG starts with 0xFFD8
  let offset = 2;
  while (offset < dv.byteLength) {
    const marker = dv.getUint16(offset);
    offset += 2;
    if (marker === 0xffda) break; // start of scan
    const size = dv.getUint16(offset);
    const segStart = offset + 2;
    // APP0 JFIF marker = 0xFFE0
    if (marker === 0xffe0) {
      // 'JFIF\0' at segStart
      if (
        dv.getUint8(segStart) === 0x4a && // J
        dv.getUint8(segStart + 1) === 0x46 && // F
        dv.getUint8(segStart + 2) === 0x49 && // I
        dv.getUint8(segStart + 3) === 0x46 && // F
        dv.getUint8(segStart + 4) === 0x00
      ) {
        const units = dv.getUint8(segStart + 7); // 1 = dpi, 2 = dpcm
        const xDensity = dv.getUint16(segStart + 8);
        if (units === 1) return xDensity; // DPI
        if (units === 2) return Math.round(xDensity * 2.54); // DPCM -> DPI
        return null;
      }
    }
    offset = segStart + size - 2;
  }
  return null;
}

function parsePngDPI(buf) {
  const dv = new DataView(buf);
  // PNG signature
  if (dv.getUint32(0) !== 0x89504e47 || dv.getUint32(4) !== 0x0d0a1a0a) return null;

  let offset = 8;
  while (offset < dv.byteLength) {
    const length = dv.getUint32(offset);
    const type =
      String.fromCharCode(dv.getUint8(offset + 4)) +
      String.fromCharCode(dv.getUint8(offset + 5)) +
      String.fromCharCode(dv.getUint8(offset + 6)) +
      String.fromCharCode(dv.getUint8(offset + 7));
    if (type === 'pHYs') {
      const ppux = dv.getUint32(offset + 8);
      const unit = dv.getUint8(offset + 16); // 1 = meter
      if (unit === 1) {
        const dpi = Math.round(ppux * 0.0254); // pixels per meter to dpi
        return dpi;
      }
      return null;
    }
    offset += 12 + length; // len + type + data + crc
  }
  return null;
}

async function getApproxDPI(file) {
  const mime = file.type;
  try {
    const buf = await readFileAsArrayBuffer(file);
    if (mime === 'image/jpeg' || mime === 'image/jpg') {
      return parseJpegDPI(buf);
    }
    if (mime === 'image/png') {
      return parsePngDPI(buf);
    }
    return null; // PDF or other: not applicable
  } catch {
    return null;
  }
}

/* =============================================================================
   Password Strength helper
============================================================================= */
function scorePassword(pw) {
  let score = 0;
  if (!pw) return 0;
  const rules = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  rules.forEach((r) => {
    if (r.test(pw)) score += 20;
  });
  if (pw.length >= 12) score += 10;
  return Math.min(score, 100);
}

/* =============================================================================
   Main Component
============================================================================= */
export default function NavRight() {
  const navigate = useNavigate();

  // UI state
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('profile');

  // Load or seed localStorage
  const [profile, setProfile] = React.useState(() => {
    const stored = localStorage.getItem(LS_KEYS.PROFILE);
    return stored ? JSON.parse(stored) : DEFAULT_PROFILE;
  });

  const [notifs, setNotifs] = React.useState(() => {
    const stored = localStorage.getItem(LS_KEYS.NOTIFS);
    return stored ? JSON.parse(stored) : DEFAULT_NOTIFS;
  });

  const [devices, setDevices] = React.useState(() => {
    const stored = localStorage.getItem(LS_KEYS.DEVICES);
    return stored ? JSON.parse(stored) : DEFAULT_DEVICES;
  });

  const [pwdState, setPwdState] = React.useState(() => {
    const stored = localStorage.getItem(LS_KEYS.PASSWORD);
    return stored ? JSON.parse(stored) : DEFAULT_PASSWORD;
  });

  const [adminUsers, setAdminUsers] = React.useState(() => {
    const stored = localStorage.getItem(LS_KEYS.USERS);
    return stored ? JSON.parse(stored) : DEFAULT_USERS;
  });

  // Persist when things change
  React.useEffect(() => {
    localStorage.setItem(LS_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  React.useEffect(() => {
    localStorage.setItem(LS_KEYS.NOTIFS, JSON.stringify(notifs));
  }, [notifs]);

  React.useEffect(() => {
    localStorage.setItem(LS_KEYS.DEVICES, JSON.stringify(devices));
  }, [devices]);

  React.useEffect(() => {
    localStorage.setItem(LS_KEYS.PASSWORD, JSON.stringify(pwdState));
  }, [pwdState]);

  React.useEffect(() => {
    localStorage.setItem(LS_KEYS.USERS, JSON.stringify(adminUsers));
  }, [adminUsers]);

  /* =======================================================================
     Profile Image Upload (JPG, JPEG, PDF; ≤ 5 MB; Attempt ~300 DPI hint)
  ======================================================================= */
  const [avatarWarning, setAvatarWarning] = React.useState('');
  const MAX_BYTES = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'application/pdf']; // add 'image/png' if you want

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setAvatarWarning('File is larger than 5 MB. Please choose a smaller file.');
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatarWarning('Only JPG, JPEG or PDF are allowed.');
      return;
    }

    let dpi = null;
    if (file.type.startsWith('image/')) {
      dpi = await getApproxDPI(file);
      if (dpi !== null && dpi < 300) {
        setAvatarWarning(`Image appears to be ~${dpi} DPI. 300 DPI is recommended.`);
      } else {
        setAvatarWarning('');
      }
    } else {
      setAvatarWarning('');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((p) => ({
        ...p,
        avatar: reader.result,
        avatarMeta: { fileName: file.name, mime: file.type }
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setProfile((p) => ({ ...p, avatar: '', avatarMeta: { fileName: '', mime: '' } }));
    setAvatarWarning('');
  };

  /* =======================================================================
     Devices
  ======================================================================= */
  const revokeDevice = (id) => {
    const target = devices.find((d) => d.id === id);
    if (target?.current) {
      alert('Cannot revoke the current active device.');
      return;
    }
    setDevices((arr) => arr.filter((d) => d.id !== id));
    alert('Device revoked.');
  };

  const addDummyDevice = () => {
    const nid = `dev${Math.floor(Math.random() * 9000) + 1000}`;
    const now = new Date();
    setDevices((arr) => [
      ...arr,
      {
        id: nid,
        name: 'Firefox · Mac',
        ip: `203.0.113.${Math.floor(Math.random() * 200) + 10}`,
        lastActive: now.toISOString().slice(0, 16).replace('T', ' '),
        current: false
      }
    ]);
  };

  /* =======================================================================
     Save profile + notifications
  ======================================================================= */
  const saveProfile = () => {
    alert('Profile saved.');
  };

  /* =======================================================================
     Change Password
  ======================================================================= */
  const [pwCurrent, setPwCurrent] = React.useState('');
  const [pwNew, setPwNew] = React.useState('');
  const [pwConfirm, setPwConfirm] = React.useState('');

  const pwScore = scorePassword(pwNew);
  const pwRules = {
    len8: pwNew.length >= 8,
    upper: /[A-Z]/.test(pwNew),
    lower: /[a-z]/.test(pwNew),
    digit: /[0-9]/.test(pwNew),
    special: /[^A-Za-z0-9]/.test(pwNew),
    match: pwNew && pwNew === pwConfirm
  };

  const submitPasswordChange = () => {
    if (hashish(pwCurrent) !== pwdState.current) {
      alert('Current password is incorrect.');
      return;
    }
    if (!(pwRules.len8 && pwRules.upper && pwRules.lower && pwRules.digit && pwRules.special && pwRules.match)) {
      alert('Please satisfy all password rules.');
      return;
    }
    const newHash = hashish(pwNew);
    if (newHash === pwdState.current || pwdState.history.includes(newHash)) {
      alert('New password must be different from the current and last 3 passwords.');
      return;
    }
    const nextHistory = [pwdState.current, ...pwdState.history].slice(0, 3);
    setPwdState({ current: newHash, history: nextHistory });
    setPwCurrent('');
    setPwNew('');
    setPwConfirm('');
    alert('Password updated successfully.');
  };

  /* =======================================================================
     Manage Users
  ======================================================================= */
  const [userSearch, setUserSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('All Roles');
  const [statusFilter, setStatusFilter] = React.useState('All Statuses');

  const filteredAdmins = adminUsers.filter((u) => {
    const hay = `${u.name} ${u.email} ${u.role} ${u.status}`.toLowerCase();
    const okSearch = !userSearch || hay.includes(userSearch.toLowerCase());
    const okRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const okStatus = statusFilter === 'All Statuses' || u.status === statusFilter;
    return okSearch && okRole && okStatus;
  });

  const toggleUserStatus = (id) => {
    setAdminUsers((list) =>
      list.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
  };

  const resetUserPassword = (id) => {
    alert(`Password reset link sent to user ${id}.`);
  };

  const impersonateUser = (id) => {
    const who = adminUsers.find((u) => u.id === id);
    alert(`Impersonating ${who?.name || id} (demo). Make sure to audit this on your backend.`);
  };

  // Invite admin submodal
  const [showInvite, setShowInvite] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('Support');

  const submitInvite = () => {
    if (!inviteEmail.includes('@')) {
      alert('Enter a valid email');
      return;
    }
    const id = `u${Math.floor(Math.random() * 9000) + 1000}`;
    setAdminUsers((list) => [
      ...list,
      {
        id,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Active',
        lastActive: new Date().toISOString().slice(0, 16).replace('T', ' ')
      }
    ]);
    setShowInvite(false);
    setInviteEmail('');
    setInviteRole('Support');
    alert('Invitation sent.');
  };

  /* =======================================================================
     Sign Out (fixed)
  ======================================================================= */
  const [signingOut, setSigningOut] = React.useState(false);

  const handleSignOut = () => {
    if (signingOut) return;
    setSigningOut(true);

    try {
      authUtils.logout(); // clear token + broadcast
    } catch (e) {
      // ignore
    }

    // Small delay for UX feedback, then redirect to login
    setTimeout(() => {
      setSigningOut(false);
      navigate('/auth/login', { replace: true });
    }, 300);
  };

  /* =======================================================================
     UI helpers
  ======================================================================= */
  const ruleBadge = (ok, text) => (
    <Badge bg={ok ? 'success' : 'secondary'} className="me-2 mb-2">
      {ok ? '✓ ' : '• '}
      {text}
    </Badge>
  );

  const avatarSrc =
    profile.avatar && profile.avatarMeta.mime && profile.avatarMeta.mime.startsWith('image/')
      ? profile.avatar
      : avatar2;

  return (
    <ListGroup as="ul" bsPrefix=" " className="list-unstyled">
      {/* Search */}
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown>
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0">
            <i className="material-icons-two-tone">search</i>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown drp-search">
            <Form className="px-3">
              <div className="form-group mb-0 d-flex align-items-center">
                <FeatherIcon icon="search" />
                <Form.Control type="search" className="border-0 shadow-none" placeholder="Search here. . ." />
              </div>
            </Form>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>

      {/* Profile / Admin menu */}
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown className="drp-user">
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0 user-name">
            <img
              src={avatarSrc}
              alt="user"
              className="user-avatar"
              style={{ objectFit: 'cover' }}
            />
            <span>
              <span className="user-name">{profile.name}</span>
              <span className="user-desc">Administrator</span>
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
            <Dropdown.Header className="pro-head">
              <h5 className="text-overflow m-0" />
            </Dropdown.Header>

            {/* Clicking "Profile" opens our Profile Center modal */}
            <button
              type="button"
              className="dropdown-item"
              onClick={() => {
                setActiveTab('profile');
                setShowProfileModal(true);
              }}
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 0 }}
            >
              <FeatherIcon icon="user" className="me-2" /> Profile
            </button>

            <Dropdown.Divider />

            <Link to="/support" className="dropdown-item">
              <FeatherIcon icon="help-circle" className="me-2" /> Support
            </Link>

            {/* Sign out — button instead of link so we can run logic */}
            <button
              type="button"
              className="dropdown-item text-danger"
              onClick={handleSignOut}
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 0 }}
              disabled={signingOut}
            >
              {signingOut ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing out...
                </>
              ) : (
                <>
                  <FeatherIcon icon="log-out" className="me-2" /> Sign out
                </>
              )}
            </button>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>

      {/* ========================== Profile Center Modal ===================== */}
      <Modal
        show={showProfileModal}
        onHide={() => setShowProfileModal(false)}
        size="xl"
        centered
        scrollable
        backdrop="static"
      >
        <Modal.Header closeButton style={{ backgroundColor: '#FFFAFA' }}>
          <Modal.Title>
            <FeatherIcon icon="settings" className="me-2" />
            Profile Center
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#FFFAFA' }}>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'profile')} className="mb-4">
            {/* -----------------------------------------------------------------
                A) MY PROFILE
            ----------------------------------------------------------------- */}
            <Tab eventKey="profile" title="My Profile">
              <Row className="g-4">
                {/* Avatar + Basic Info */}
                <Col md={4}>
                  <div className="p-3 border rounded-4 shadow-sm h-100" style={{ background: 'white' }}>
                    <h5 className="mb-3">
                      <FeatherIcon icon="image" className="me-2" />
                      Profile Picture
                    </h5>
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className="border rounded-3 overflow-hidden mb-2"
                        style={{ width: 140, height: 140, background: '#f4f4f4' }}
                      >
                        {profile.avatar && profile.avatarMeta.mime?.startsWith('image/') ? (
                          <img
                            src={profile.avatar}
                            alt="avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                            <FeatherIcon icon="user" size={48} />
                          </div>
                        )}
                      </div>

                      {/* File input */}
                      <Form.Group controlId="avatarUpload" className="text-center">
                        <Form.Label className="d-block">
                          <Button as="span" variant="outline-primary" className="px-4">
                            <FeatherIcon icon="upload" className="me-2" />
                            Upload (JPG/JPEG/PDF, ≤ 5MB)
                          </Button>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".jpg,.jpeg,application/pdf"
                          onChange={handleAvatarChange}
                          className="d-none"
                        />
                        {avatarWarning && <div className="mt-2 text-warning small">{avatarWarning}</div>}
                        {profile.avatarMeta.fileName && (
                          <div className="mt-2 small text-muted">File: {profile.avatarMeta.fileName}</div>
                        )}
                        {profile.avatar && (
                          <Button variant="outline-danger" size="sm" className="mt-2" onClick={clearAvatar}>
                            <FeatherIcon icon="trash-2" className="me-1" /> Remove
                          </Button>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </Col>

                <Col md={8}>
                  <div className="p-3 border rounded-4 shadow-sm h-100" style={{ background: 'white' }}>
                    <h5 className="mb-3">
                      <FeatherIcon icon="user" className="me-2" />
                      Account Details
                    </h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            placeholder="Your full name"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            placeholder="name@company.com"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone</Form.Label>
                          <Form.Control
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Timezone</Form.Label>
                          <Form.Select
                            value={profile.timezone}
                            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                          >
                            <option>Asia/Kolkata</option>
                            <option>UTC</option>
                            <option>America/New_York</option>
                            <option>Europe/London</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>Locale</Form.Label>
                          <Form.Select
                            value={profile.locale}
                            onChange={(e) => setProfile({ ...profile, locale: e.target.value })}
                          >
                            <option>en-IN</option>
                            <option>en-US</option>
                            <option>hi-IN</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <h5 className="mb-3">
                      <FeatherIcon icon="bell" className="me-2" />
                      Notifications
                    </h5>
                    <div className="d-flex flex-wrap gap-3">
                      <Form.Check
                        type="switch"
                        id="noti-inapp"
                        label="In-app"
                        checked={notifs.inApp}
                        onChange={(e) => setNotifs({ ...notifs, inApp: e.target.checked })}
                      />
                      <Form.Check
                        type="switch"
                        id="noti-email"
                        label="Email"
                        checked={notifs.email}
                        onChange={(e) => setNotifs({ ...notifs, email: e.target.checked })}
                      />
                      <Form.Check
                        type="switch"
                        id="noti-sms"
                        label="SMS"
                        checked={notifs.sms}
                        onChange={(e) => setNotifs({ ...notifs, sms: e.target.checked })}
                      />
                      <Form.Check
                        type="switch"
                        id="noti-wa"
                        label="WhatsApp"
                        checked={notifs.whatsapp}
                        onChange={(e) => setNotifs({ ...notifs, whatsapp: e.target.checked })}
                      />
                    </div>

                    <div className="text-end mt-4">
                      <Button variant="primary" onClick={saveProfile}>
                        <FeatherIcon icon="save" className="me-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Devices */}
              <div className="p-3 border rounded-4 shadow-sm mt-4" style={{ background: 'white' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0">
                    <FeatherIcon icon="cpu" className="me-2" />
                    Recent Logins & Devices
                  </h5>
                  <Button size="sm" variant="outline-secondary" onClick={addDummyDevice}>
                    <FeatherIcon icon="plus" className="me-1" /> Add Dummy
                  </Button>
                </div>
                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>IP</th>
                      <th>Last Active</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td>{d.ip}</td>
                        <td>{d.lastActive}</td>
                        <td>{d.current ? <Badge bg="info">Current</Badge> : <Badge bg="secondary">Other</Badge>}</td>
                        <td>
                          <Button
                            size="sm"
                            variant={d.current ? 'secondary' : 'danger'}
                            disabled={d.current}
                            onClick={() => revokeDevice(d.id)}
                          >
                            <FeatherIcon icon="x-circle" className="me-1" /> Revoke
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>

            {/* -----------------------------------------------------------------
                B) CHANGE PASSWORD
            ----------------------------------------------------------------- */}
            <Tab eventKey="password" title="Change Password">
              <Row className="g-4">
                <Col md={6}>
                  <div className="p-3 border rounded-4 shadow-sm" style={{ background: 'white' }}>
                    <h5 className="mb-3">
                      <FeatherIcon icon="lock" className="me-2" />
                      Update Password
                    </h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
                      <div className="mt-2">
                        <ProgressBar now={pwScore} label={`${pwScore}%`} />
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} />
                    </Form.Group>
                    <div className="mb-3">
                      {ruleBadge(pwRules.len8, '≥ 8 chars')}
                      {ruleBadge(pwRules.upper, 'Uppercase')}
                      {ruleBadge(pwRules.lower, 'Lowercase')}
                      {ruleBadge(pwRules.digit, 'Digit')}
                      {ruleBadge(pwRules.special, 'Special')}
                      {ruleBadge(pwRules.match, 'Matches')}
                    </div>
                    <div className="small text-muted mb-3">Rotation rule: cannot reuse the current or last 3 passwords.</div>
                    <Button variant="primary" onClick={submitPasswordChange}>
                      <FeatherIcon icon="check-circle" className="me-2" />
                      Change Password
                    </Button>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="p-3 border rounded-4 shadow-sm h-100" style={{ background: 'white' }}>
                    <h5 className="mb-3">
                      <FeatherIcon icon="info" className="me-2" />
                      Tips
                    </h5>
                    <ul className="mb-0">
                      <li>Use a passphrase with 12+ characters.</li>
                      <li>Mix upper/lower case, digits, and symbols.</li>
                      <li>Don’t reuse passwords across systems.</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Tab>

            {/* -----------------------------------------------------------------
                C) MANAGE USERS
            ----------------------------------------------------------------- */}
            <Tab eventKey="users" title="Manage Users">
              <div className="p-3 border rounded-4 shadow-sm" style={{ background: 'white' }}>
                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                  <div className="d-flex gap-2">
                    <InputGroup>
                      <InputGroup.Text>
                        <FeatherIcon icon="search" />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search name/email/role"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                    </InputGroup>
                    <Form.Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      style={{ minWidth: 160 }}
                    >
                      <option>All Roles</option>
                      <option>Super Admin</option>
                      <option>Finance</option>
                      <option>Support</option>
                      <option>Game Ops</option>
                      <option>Read-only</option>
                    </Form.Select>
                    <Form.Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ minWidth: 160 }}
                    >
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </Form.Select>
                  </div>
                  <div>
                    <Button variant="success" onClick={() => setShowInvite(true)}>
                      <FeatherIcon icon="user-plus" className="me-2" /> Invite Admin
                    </Button>
                  </div>
                </div>

                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <Badge bg="secondary">{u.role}</Badge>
                        </td>
                        <td>
                          <Badge bg={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge>
                        </td>
                        <td>{u.lastActive}</td>
                        <td>
                          <ButtonGroup>
                            <Button
                              size="sm"
                              variant={u.status === 'Active' ? 'warning' : 'primary'}
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button size="sm" variant="outline-secondary" onClick={() => resetUserPassword(u.id)}>
                              Reset Password
                            </Button>
                            <Button size="sm" variant="outline-dark" onClick={() => impersonateUser(u.id)}>
                              Impersonate
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Invite Admin Modal */}
              <Modal show={showInvite} onHide={() => setShowInvite(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <FeatherIcon icon="user-plus" className="me-2" />
                    Invite Admin
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                      <option>Support</option>
                      <option>Finance</option>
                      <option>Game Ops</option>
                      <option>Read-only</option>
                      <option>Super Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowInvite(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={submitInvite}>
                    Send Invite
                  </Button>
                </Modal.Footer>
              </Modal>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#FFFAFA' }}>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </ListGroup>
  );
}
