import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Table,
  Modal,
  Dropdown,
  InputGroup,
  FormControl
} from 'react-bootstrap';
import MainCard from '../../components/Card/MainCard';
import { FaSearch, FaFilter, FaUndo, FaUser, FaFileExcel, FaFileCsv, FaEye } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // For Excel/CSV export

/** Util: DD/MM/YYYY */
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-GB');
};
/** Util: HH:MM (24h) */
const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/** BASE DUMMY USER (others arrive from Players link state and merge) */
const USERS = [
  {
    id: 'P001',
    name: 'Shashank',
    registrationDate: '2023-01-15',
    lastActive: '2023-06-22T18:12:00',
    dailyPlayTime: { today: '1h 35m', yesterday: '2h 10m', weeklyAverage: '1h 45m' },
    playerTime: '98h 12m',
    email: 'shashank@example.com',
    country: 'India',
    contactNumber: '+91 9811111111',
    dob: '1994-11-04',
    accountStatus: 'active',
    totalGamesPlayed: 132,
    totalWins: 71,
    loss: 61,
    currentMoney: 6420,
    currentEarning: 18250,
    referralEarning: 800,
    totalBidsAmount: 78000,
    bidAmountPerDay: 2200,
    twoPlayerWins: 33,
    twoPlayerLoss: 15,
    fourPlayerWins: 38,
    fourPlayerLoss: 46,
    transactions: [
      { id: 'TXN101', type: 'Deposit', amount: 1200, method: 'UPI', date: '2023-06-20', time: '14:30', status: 'Completed' },
      { id: 'TXN102', type: 'Withdrawal', amount: 700, method: 'Bank Transfer', date: '2023-06-21', time: '09:20', status: 'Completed' },
      { id: 'TXN103', type: 'Bonus', amount: 450, method: 'Wallet', date: '2023-06-21', time: '18:02', status: 'Completed' },
      { id: 'TXN104', type: 'Deposit', amount: 3000, method: 'UPI', date: '2023-06-22', time: '10:05', status: 'Completed' },
      { id: 'TXN105', type: 'Withdrawal', amount: 500, method: 'Bank Transfer', date: '2023-06-22', time: '20:10', status: 'Pending' },
      { id: 'TXN106', type: 'Admin Deposit', amount: 400, method: 'UPI', date: '2023-06-23', time: '11:10', status: 'Completed' }
    ],
    withdrawals: [
      { id: 'W001', playerId: 'P001', playerName: 'Shashank', transactionId: 'TXN102', amount: 700, paymentMethod: 'Bank Transfer', date: '2023-06-21', time: '09:20', status: 'Completed' },
      { id: 'W002', playerId: 'P001', playerName: 'Shashank', transactionId: 'TXN105', amount: 500, paymentMethod: 'Bank Transfer', date: '2023-06-22', time: '20:10', status: 'Pending' }
    ],
    games: [
      { sNo: 1, rank: 1, bidAmount: 200, winAmount: 400, lossAmount: 0, finalAmount: 400, status: 'Win', date: '2023-06-20', timeSpent: '32m' },
      { sNo: 2, rank: 3, bidAmount: 300, winAmount: 0, lossAmount: 300, finalAmount: 0, status: 'Loss', date: '2023-06-21', timeSpent: '27m' },
      { sNo: 3, rank: 1, bidAmount: 500, winAmount: 1000, lossAmount: 0, finalAmount: 1000, status: 'Win', date: '2023-06-22', timeSpent: '46m' },
      { sNo: 4, rank: 2, bidAmount: 400, winAmount: 0, lossAmount: 400, finalAmount: 0, status: 'Loss', date: '2023-06-23', timeSpent: '40m' }
    ]
  }
];

// Table styling constants
const centerTableClasses = 'text-center align-middle';
const headerCellStyle = {
  textTransform: 'uppercase',
  fontWeight: 700,
  backgroundColor: '#000000',
  color: '#00FFFF',
  border: '1px solid #000000'
};
const tableCellStyle = { border: '1px solid #000000' };
const tableBackgroundColor = '#F5FFFA';

// KYC localStorage key
const KYC_LS_KEY = 'kyc:requests';

// File helpers
const isImage = (mime) =>
  mime === 'image/jpeg' || mime === 'image/jpg' || mime === 'image/png';
const isPdf = (mime) => mime === 'application/pdf';

// Dummy assets
const dummyImg = (label) =>
  `https://dummyimage.com/800x500/cccccc/000000.jpg&text=${encodeURIComponent(label)}`;
const dummyPdf = () =>
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

// Seed KYC requests for the current user if none exist (persist to localStorage)
const seedKycForUser = (playerId, playerName) => {
  let all = [];
  try {
    const raw = localStorage.getItem(KYC_LS_KEY);
    if (raw) {
      all = JSON.parse(raw);
      if (!Array.isArray(all)) all = [];
    }
  } catch {
    all = [];
  }

  const already = all.some((r) => r.playerId === playerId);
  if (already) return all.filter((r) => r.playerId === playerId);

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const nowTime = formatTime(now);

  const seeded = [
    {
      id: `KYC-${playerId}-1`,
      playerId,
      playerName,
      fatherName: 'Rajesh Kumar',
      dob: '1990-05-20',
      panNumber: 'ABCDE1234F',
      aadharNumber: '1234 5678 9012',
      requestDate: today,
      requestTime: nowTime,
      status: 'Pending',
      decision: null,
      decisionDate: '',
      decisionTime: '',
      docs: {
        aadharFront: { url: dummyImg('Aadhar+Front'), mime: 'image/jpeg' },
        aadharBack: { url: dummyPdf(), mime: 'application/pdf' },
        panCard: { url: dummyImg('PAN+Card'), mime: 'image/jpeg' }
      }
    },
    {
      id: `KYC-${playerId}-2`,
      playerId,
      playerName,
      fatherName: 'Sunil Sharma',
      dob: '1992-11-09',
      panNumber: 'AAAPL1234C',
      aadharNumber: '3456 7890 1234',
      requestDate: '2024-08-01',
      requestTime: '10:15',
      status: 'Completed',
      decision: 'Approve',
      decisionDate: '2024-08-02',
      decisionTime: '12:30',
      docs: {
        aadharFront: { url: dummyImg('Aadhar+Front'), mime: 'image/jpeg' },
        aadharBack: { url: dummyImg('Aadhar+Back'), mime: 'image/jpeg' },
        panCard: { url: dummyPdf(), mime: 'application/pdf' }
      }
    },
    {
      id: `KYC-${playerId}-3`,
      playerId,
      playerName,
      fatherName: 'Mahesh Gupta',
      dob: '1993-03-11',
      panNumber: 'BXYPG5678K',
      aadharNumber: '5678 9012 3456',
      requestDate: '2024-07-15',
      requestTime: '18:05',
      status: 'Rejected',
      decision: 'Reject',
      decisionDate: '2024-07-16',
      decisionTime: '09:50',
      docs: {
        aadharFront: { url: dummyImg('Aadhar+Front'), mime: 'image/jpeg' },
        aadharBack: { url: dummyImg('Aadhar+Back'), mime: 'image/jpeg' },
        panCard: { url: dummyImg('PAN+Card'), mime: 'image/jpeg' }
      }
    }
  ];

  const nextAll = [...all, ...seeded];
  localStorage.setItem(KYC_LS_KEY, JSON.stringify(nextAll));
  return seeded;
};

const UserDetails = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // load by route param or state from Players link
  const idToLoad = state?.user?.id || state?.userId || userId;
  const baseUser = USERS.find((u) => u.id === idToLoad) || USERS[0];
  const user = { ...baseUser, ...(state?.user || {}) }; // shallow merge

  // profile & actions
  const [profilePic, setProfilePic] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showAddCoinsModal, setShowAddCoinsModal] = React.useState(false);
  const [showDeductCoinsModal, setShowDeductCoinsModal] = React.useState(false);
  const [coinsAmount, setCoinsAmount] = React.useState(0);
  const [transactionReason, setTransactionReason] = React.useState('');
  const [currentMoney, setCurrentMoney] = React.useState(user.currentMoney ?? 0);
  const [activeTab, setActiveTab] = React.useState('details');

  // histories
  const [withdrawalHistory, setWithdrawalHistory] = React.useState([...(user.withdrawals || [])]);
  const [gameHistory, setGameHistory] = React.useState([...(user.games || [])]);
  const [transactionHistory, setTransactionHistory] = React.useState([...(user.transactions || [])]);

  // txn filters
  const [txnTypeFilter, setTxnTypeFilter] = React.useState('All Types');
  const [txnMethodFilter, setTxnMethodFilter] = React.useState('All Methods');
  const [txnStatusFilter, setTxnStatusFilter] = React.useState('All Statuses');
  const [txnSearch, setTxnSearch] = React.useState('');
  const [txnDateFrom, setTxnDateFrom] = React.useState('');
  const [txnDateTo, setTxnDateTo] = React.useState('');

  // withdraw filters
  const [paymentFilter, setPaymentFilter] = React.useState('All Methods');
  const [statusFilter, setStatusFilter] = React.useState('All Statuses');
  const [searchTerm, setSearchTerm] = React.useState('');

  // game filters
  const [gameRankFilter, setGameRankFilter] = React.useState('All Ranks');
  const [gameStatusFilter, setGameStatusFilter] = React.useState('All Statuses');
  const [gameDateFrom, setGameDateFrom] = React.useState('');
  const [gameDateTo, setGameDateTo] = React.useState('');
  const [gameSearch, setGameSearch] = React.useState('');

  // KYC state
  const [kycRequests, setKycRequests] = React.useState([]);
  const [kycSearch, setKycSearch] = React.useState('');
  const [kycStatusFilter, setKycStatusFilter] = React.useState('All Statuses'); // Pending | Completed | Rejected | All
  const [kycDecisionFilter, setKycDecisionFilter] = React.useState('All Decisions'); // Approve | Reject | No Decision | All
  const [docsModalOpen, setDocsModalOpen] = React.useState(false);
  const [selectedKyc, setSelectedKyc] = React.useState(null);

  // seed KYC on first load per user
  React.useEffect(() => {
    const seeded = seedKycForUser(user.id, user.name || user.id);
    setKycRequests(seeded);
  }, [user.id, user.name]);

  // persist subset back to localStorage
  const persistKycSubset = (nextSubset) => {
    try {
      const raw = localStorage.getItem(KYC_LS_KEY);
      let all = [];
      if (raw) {
        all = JSON.parse(raw);
        if (!Array.isArray(all)) all = [];
      }
      const others = all.filter((x) => x.playerId !== user.id);
      const merged = [...others, ...nextSubset];
      localStorage.setItem(KYC_LS_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }
  };

  // profile pic upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, JPG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      alert('Profile picture uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  // delete profile
  const handleDeleteProfile = () => setShowDeleteModal(true);
  const confirmDeleteProfile = () => {
    setShowDeleteModal(false);
    alert('Profile deleted successfully');
    navigate('/players');
  };

  // add / deduct coins
  const confirmAddCoins = () => {
    const amt = parseInt(coinsAmount, 10);
    if (!amt || amt <= 0) return alert('Please enter a valid amount');

    const newBalance = currentMoney + amt;
    setCurrentMoney(newBalance);

    const newTransaction = {
      id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Admin Deposit',
      amount: amt,
      method: 'Admin',
      date: new Date().toISOString().split('T')[0],
      time: formatTime(new Date()),
      status: 'Completed',
      reason: transactionReason || 'Admin deposit'
    };

    setTransactionHistory((prev) => [newTransaction, ...prev]);
    setShowAddCoinsModal(false);
    setCoinsAmount(0);
    setTransactionReason('');
    alert(`Successfully added ₹${amt} to user's balance. New balance: ₹${newBalance}`);
  };

  const confirmDeductCoins = () => {
    const amt = parseInt(coinsAmount, 10);
    if (!amt || amt <= 0) return alert('Please enter a valid amount');
    if (amt > currentMoney) return alert('Deduction amount exceeds current balance');

    const newBalance = currentMoney - amt;
    setCurrentMoney(newBalance);

    const newTransaction = {
      id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'Admin Deduction',
      amount: amt,
      method: 'Admin',
      date: new Date().toISOString().split('T')[0],
      time: formatTime(new Date()),
      status: 'Completed',
      reason: transactionReason || 'Admin deduction'
    };

    setTransactionHistory((prev) => [newTransaction, ...prev]);
    setShowDeductCoinsModal(false);
    setCoinsAmount(0);
    setTransactionReason('');
    alert(`Successfully deducted ₹${amt} from user's balance. New balance: ₹${newBalance}`);
  };

  // withdrawal actions
  const handleWithdrawalAction = (id, action) => {
    setWithdrawalHistory((prev) => prev.map((w) => (w.id === id ? { ...w, status: action } : w)));
    alert(`Withdrawal request ${action.toLowerCase()} successfully`);
  };

  // filtered withdrawals
  const filteredWithdrawalHistory = (withdrawalHistory || []).filter((item) => {
    const matchesPayment = paymentFilter === 'All Methods' || item.paymentMethod === paymentFilter;
    const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
    const text = `${item.playerName} ${item.playerId} ${item.transactionId}`.toLowerCase();
    const matchesSearch = !searchTerm || text.includes(searchTerm.toLowerCase());
    return matchesPayment && matchesStatus && matchesSearch;
  });
  const resetWithdrawalFilters = () => {
    setPaymentFilter('All Methods');
    setStatusFilter('All Statuses');
    setSearchTerm('');
  };

  // filtered transactions
  const filteredTransactionHistory = (transactionHistory || []).filter((t) => {
    const matchesType = txnTypeFilter === 'All Types' || t.type === txnTypeFilter;
    const matchesMethod = txnMethodFilter === 'All Methods' || t.method === txnMethodFilter;
    const matchesStatus = txnStatusFilter === 'All Statuses' || t.status === txnStatusFilter;

    let matchesDate = true;
    if (txnDateFrom) matchesDate = matchesDate && new Date(t.date) >= new Date(txnDateFrom);
    if (txnDateTo) matchesDate = matchesDate && new Date(t.date) <= new Date(txnDateTo);

    const hay = `${t.id} ${t.type} ${t.method}`.toLowerCase();
    const matchesSearch = !txnSearch || hay.includes(txnSearch.toLowerCase());

    return matchesType && matchesMethod && matchesStatus && matchesDate && matchesSearch;
  });

  const resetTxnFilters = () => {
    setTxnTypeFilter('All Types');
    setTxnMethodFilter('All Methods');
    setTxnStatusFilter('All Statuses');
    setTxnSearch('');
    setTxnDateFrom('');
    setTxnDateTo('');
  };

  // filtered games
  const filteredGameHistory = (gameHistory || []).filter((g) => {
    const matchesRank = gameRankFilter === 'All Ranks' || g.rank.toString() === gameRankFilter;
    const matchesStatus = gameStatusFilter === 'All Statuses' || g.status === gameStatusFilter;

    let matchesDate = true;
    if (gameDateFrom) matchesDate = matchesDate && new Date(g.date) >= new Date(gameDateFrom);
    if (gameDateTo) matchesDate = matchesDate && new Date(g.date) <= new Date(gameDateTo);

    const hay = `${g.sNo} ${g.rank} ${g.status} ${g.finalAmount}`.toLowerCase();
    const matchesSearch = !gameSearch || hay.includes(gameSearch.toLowerCase());

    return matchesRank && matchesStatus && matchesDate && matchesSearch;
  });

  const resetGameFilters = () => {
    setGameRankFilter('All Ranks');
    setGameStatusFilter('All Statuses');
    setGameDateFrom('');
    setGameDateTo('');
    setGameSearch('');
  };

  // amount cell format
  const renderAmount = (t) => {
    if (t.type === 'Deposit' || t.type === 'Admin Deposit') {
      return <span className="fw-bold text-success">+₹{t.amount}</span>;
    }
    if (t.type === 'Withdrawal' || t.type === 'Admin Deduction') {
      return <span className="fw-bold text-danger">-₹{t.amount}</span>;
    }
    return <span className="fw-bold">₹{t.amount}</span>;
  };

  // export helpers
  const exportToExcel = (data, fileName) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };
  const exportToCSV = (data, fileName) => {
    const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KYC filters + actions
  const filteredKycRequests = (kycRequests || []).filter((k) => {
    const txt = `${k.playerName} ${k.fatherName} ${k.panNumber} ${k.aadharNumber}`.toLowerCase();
    const matchesSearch = !kycSearch || txt.includes(kycSearch.toLowerCase());

    const matchesStatus =
      kycStatusFilter === 'All Statuses' ? true : k.status === kycStatusFilter;

    const decisionLabel = k.decision ? (k.decision === 'Approve' ? 'Approve' : 'Reject') : 'No Decision';
    const matchesDecision =
      kycDecisionFilter === 'All Decisions'
        ? true
        : kycDecisionFilter === decisionLabel;

    return matchesSearch && matchesStatus && matchesDecision;
  });

  const openDocs = (req) => {
    setSelectedKyc(req);
    setDocsModalOpen(true);
  };

  const markKyc = (reqId, action) => {
    // action: 'Approve' | 'Reject'
    setKycRequests((prev) => {
      const next = prev.map((r) => {
        if (r.id !== reqId) return r;
        const now = new Date();
        const nextStatus = action === 'Approve' ? 'Completed' : 'Rejected';
        return {
          ...r,
          status: nextStatus,
          decision: action,
          decisionDate: now.toISOString().split('T')[0],
          decisionTime: formatTime(now)
        };
      });
      persistKycSubset(next);
      // Example backend:
      // fetch(`/api/kyc/${encodeURIComponent(reqId)}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: nextStatus, decision: action })
      // });
      return next;
    });
  };

  const statusBadge = (status) => {
    const bg =
      status === 'Completed' ? 'success' :
      status === 'Pending' ? 'warning' : 'danger';
    return <Badge bg={bg}>{status}</Badge>;
  };

  const violetBtnStyle = { backgroundColor: '#EE82EE', borderColor: '#EE82EE', color: '#000' };

  return (
    <Row style={{ backgroundColor: '#F0F8FF', minHeight: '100vh', padding: '20px' }}>
      <Col sm={12}>
        <MainCard title={`USER DETAILS - ${user.name} (ID: ${user.id})`} isOption={false}>
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-lg">
              {/* Photo */}
              <div className="relative">
                <div
                  className="border border-gray-300 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg"
                  style={{ width: '35mm', height: '45mm', minWidth: '35mm', minHeight: '45mm' }}
                >
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-content-center text-gray-500">
                      <FaUser size={48} />
                      <span className="mt-2">No Photo</span>
                    </div>
                  )}
                </div>
                <Form.Group controlId="profilePic" className="mt-2">
                  <Form.Label className="d-block text-center">
                    <Button variant="outline-primary" size="sm" as="span" className="w-full">
                      UPLOAD PHOTO
                    </Button>
                    <Form.Control
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleProfilePicChange}
                      className="d-none"
                    />
                  </Form.Label>
                  <Form.Text className="text-muted d-block text-center">JPG, PNG, JPEG (max 2MB)</Form.Text>
                </Form.Group>
              </div>

              {/* Meta & Actions */}
              <div className="flex-1 w-full">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between gap-3">
                  <div>
                    <h2 className="h4 fw-bold mb-1">{user.name}</h2>
                    <div className="d-flex align-items-center gap-2">
                      <Badge bg={user.accountStatus === 'active' ? 'success' : 'danger'} className="px-2 py-1">
                        {user.accountStatus?.toUpperCase()}
                      </Badge>
                      <Badge bg="primary" className="px-2 py-1">ID: {user.id}</Badge>
                      <Badge bg="info" className="px-2 py-1">
                        BALANCE: ₹{currentMoney.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {user.registrationDate && (
                      <div className="bg-white px-3 py-1 rounded shadow-sm">
                        <span className="text-muted">JOINED: </span>
                        <span className="fw-medium">{formatDate(user.registrationDate)}</span>
                      </div>
                    )}
                    {user.lastActive && (
                      <div className="bg-white px-3 py-1 rounded shadow-sm">
                        <span className="text-muted">LAST ACTIVE: </span>
                        <span className="fw-medium">{formatDate(user.lastActive)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons row (added KYC REQUEST) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 mt-3">
                  <Button variant="danger" onClick={handleDeleteProfile}>DELETE PROFILE</Button>
                  <Button variant="success" onClick={() => setShowAddCoinsModal(true)}>ADD COINS</Button>
                  <Button variant="warning" onClick={() => setShowDeductCoinsModal(true)}>DEDUCT COINS</Button>
                  <Button variant={activeTab === 'transactions' ? 'dark' : 'info'} onClick={() => setActiveTab('transactions')}>TRANSACTION HISTORY</Button>
                  <Button variant={activeTab === 'withdrawals' ? 'dark' : 'primary'} onClick={() => setActiveTab('withdrawals')}>WITHDRAW REQUEST</Button>
                  <Button variant={activeTab === 'gameHistory' ? 'dark' : 'secondary'} onClick={() => setActiveTab('gameHistory')}>GAME HISTORY</Button>
                  <Button
                    style={violetBtnStyle}
                    variant={activeTab === 'kyc' ? 'dark' : undefined}
                    onClick={() => setActiveTab('kyc')}
                    title="View and decide KYC requests"
                  >
                    KYC REQUEST
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <Row className="g-3 mb-4">
              <Col md={3}>
                <Card className="h-100 shadow-sm" style={{ backgroundColor: '#F0FFF0', border: '1px solid #000000' }}>
                  <Card.Body className="text-center">
                    <h5 className="text-muted mb-2">TOTAL GAMES</h5>
                    <h3 className="fw-bold">{user.totalGamesPlayed || 0}</h3>
                    <div className="d-flex justify-content-around mt-2">
                      <div>
                        <small className="text-muted">WINS</small>
                        <p className="mb-0 text-success fw-bold">{user.totalWins || 0}</p>
                      </div>
                      <div>
                        <small className="text-muted">LOSS</small>
                        <p className="mb-0 text-danger fw-bold">{user.loss || 0}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card className="h-100 shadow-sm" style={{ backgroundColor: '#F0FFF0', border: '1px solid #000000' }}>
                  <Card.Body className="text-center">
                    <h5 className="text-muted mb-2">TWO PLAYERS TOTAL GAMES</h5>
                    <h3 className="fw-bold">{(user.twoPlayerWins || 0) + (user.twoPlayerLoss || 0)}</h3>
                    <div className="d-flex justify-content-around mt-2">
                      <div>
                        <small className="text-muted">WINS</small>
                        <p className="mb-0 text-success fw-bold">{user.twoPlayerWins || 0}</p>
                      </div>
                      <div>
                        <small className="text-muted">LOSS</small>
                        <p className="mb-0 text-danger fw-bold">{user.twoPlayerLoss || 0}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card className="h-100 shadow-sm" style={{ backgroundColor: '#F0FFF0', border: '1px solid #000000' }}>
                  <Card.Body className="text-center">
                    <h5 className="text-muted mb-2">FOUR PLAYERS TOTAL GAMES</h5>
                    <h3 className="fw-bold">{(user.fourPlayerWins || 0) + (user.fourPlayerLoss || 0)}</h3>
                    <div className="d-flex justify-content-around mt-2">
                      <div>
                        <small className="text-muted">WINS</small>
                        <p className="mb-0 text-success fw-bold">{user.fourPlayerWins || 0}</p>
                      </div>
                      <div>
                        <small className="text-muted">LOSS</small>
                        <p className="mb-0 text-danger fw-bold">{user.fourPlayerLoss || 0}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card className="h-100 shadow-sm" style={{ backgroundColor: '#F0FFF0', border: '1px solid #000000' }}>
                  <Card.Body className="text-center">
                    <h5 className="text-muted mb-2">TOTAL BIDS</h5>
                    <h3 className="fw-bold">₹{(user.totalBidsAmount || 0).toLocaleString()}</h3>
                    <div className="d-flex justify-content-around mt-2">
                      <div>
                        <small className="text-muted">2 PLAYER BID</small>
                        <p className="mb-0 text-primary fw-bold">{user.twoPlayerWins || 0}</p>
                      </div>
                      <div>
                        <small className="text-muted">4 PLAYER</small>
                        <p className="mb-0 text-primary fw-bold">{user.fourPlayerWins || 0}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* TRANSACTION HISTORY */}
            {activeTab === 'transactions' && (
              <Card className="shadow-sm" style={{ border: '1px solid #000000' }}>
                <Card.Header className="fw-semibold" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                  TRANSACTION HISTORY
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={3}>
                      <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <FormControl
                          placeholder="Search (TXN ID / type / method)"
                          value={txnSearch}
                          onChange={(e) => setTxnSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={txnTypeFilter} onChange={(e) => setTxnTypeFilter(e.target.value)}>
                        <option>All Types</option>
                        <option>Deposit</option>
                        <option>Withdrawal</option>
                        <option>Bonus</option>
                        <option>Admin Deposit</option>
                        <option>Admin Deduction</option>
                        <option>Game Win</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={txnMethodFilter} onChange={(e) => setTxnMethodFilter(e.target.value)}>
                        <option>All Methods</option>
                        <option>UPI</option>
                        <option>Wallet</option>
                        <option>Bank Transfer</option>
                        <option>In-Game</option>
                        <option>Admin</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={txnStatusFilter} onChange={(e) => setTxnStatusFilter(e.target.value)}>
                        <option>All Statuses</option>
                        <option>Completed</option>
                        <option>Pending</option>
                        <option>Failed</option>
                        <option>Rejected</option>
                      </Form.Select>
                    </Col>
                    <Col md={3} className="d-flex gap-2">
                      <Form.Control type="date" value={txnDateFrom} onChange={(e) => setTxnDateFrom(e.target.value)} />
                      <Form.Control type="date" value={txnDateTo} onChange={(e) => setTxnDateTo(e.target.value)} />
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between mb-3">
                    <Button variant="outline-secondary" onClick={resetTxnFilters}>
                      <FaUndo /> Reset Filters
                    </Button>
                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => exportToExcel(filteredTransactionHistory, `transactions_${user.id}`)}
                      >
                        <FaFileExcel /> Export Excel
                      </Button>
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => exportToCSV(filteredTransactionHistory, `transactions_${user.id}`)}
                      >
                        <FaFileCsv /> Export CSV
                      </Button>
                    </div>
                  </div>

                  <Table striped bordered hover responsive className={centerTableClasses} style={{ backgroundColor: tableBackgroundColor }}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>TXN ID</th>
                        <th style={headerCellStyle}>TYPE</th>
                        <th style={headerCellStyle}>AMOUNT</th>
                        <th style={headerCellStyle}>METHOD</th>
                        <th style={headerCellStyle}>DATE</th>
                        <th style={headerCellStyle}>TIME</th>
                        <th style={headerCellStyle}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactionHistory.map((t) => (
                        <tr key={t.id}>
                          <td style={tableCellStyle}>{t.id}</td>
                          <td style={tableCellStyle}>{t.type.toUpperCase()}</td>
                          <td style={tableCellStyle}>{renderAmount(t)}</td>
                          <td style={tableCellStyle}>{t.method}</td>
                          <td style={tableCellStyle}>{formatDate(t.date)}</td>
                          <td style={tableCellStyle}>{t.time}</td>
                          <td style={tableCellStyle}>
                            <Badge
                              bg={
                                t.status === 'Completed' ? 'success' :
                                t.status === 'Pending' ? 'warning' : 'danger'
                              }
                            >
                              {t.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {/* WITHDRAW REQUEST */}
            {activeTab === 'withdrawals' && (
              <Card className="shadow-sm" style={{ border: '1px solid #000000' }}>
                <Card.Header className="fw-semibold" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                  WITHDRAW REQUEST
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <FormControl
                          placeholder="Search (name / player / TXN)"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={4}>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">
                          <FaFilter /> Payment Method: {paymentFilter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setPaymentFilter('All Methods')}>All Methods</Dropdown.Item>
                          <Dropdown.Item onClick={() => setPaymentFilter('UPI')}>UPI</Dropdown.Item>
                          <Dropdown.Item onClick={() => setPaymentFilter('Bank Transfer')}>Bank Transfer</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col md={4}>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">
                          <FaFilter /> Status: {statusFilter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setStatusFilter('All Statuses')}>All Statuses</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatusFilter('Pending')}>Pending</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatusFilter('Completed')}>Completed</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatusFilter('Rejected')}>Rejected</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between mb-3">
                    <Button variant="outline-secondary" onClick={resetWithdrawalFilters}>
                      <FaUndo /> Reset Filters
                    </Button>
                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => exportToExcel(filteredWithdrawalHistory, `withdrawals_${user.id}`)}
                      >
                        <FaFileExcel /> Export Excel
                      </Button>
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => exportToCSV(filteredWithdrawalHistory, `withdrawals_${user.id}`)}
                      >
                        <FaFileCsv /> Export CSV
                      </Button>
                    </div>
                  </div>

                  <Table striped bordered hover responsive className={centerTableClasses} style={{ backgroundColor: tableBackgroundColor }}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>ID</th>
                        <th style={headerCellStyle}>PLAYER</th>
                        <th style={headerCellStyle}>TXN ID</th>
                        <th style={headerCellStyle}>AMOUNT</th>
                        <th style={headerCellStyle}>METHOD</th>
                        <th style={headerCellStyle}>DATE</th>
                        <th style={headerCellStyle}>TIME</th>
                        <th style={headerCellStyle}>STATUS</th>
                        <th style={headerCellStyle}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWithdrawalHistory.map((w) => (
                        <tr key={w.id}>
                          <td style={tableCellStyle}>{w.id}</td>
                          <td style={tableCellStyle}>{w.playerName}</td>
                          <td style={tableCellStyle}>{w.transactionId}</td>
                          <td style={tableCellStyle} className="fw-bold">₹{w.amount}</td>
                          <td style={tableCellStyle}>{w.paymentMethod}</td>
                          <td style={tableCellStyle}>{formatDate(w.date)}</td>
                          <td style={tableCellStyle}>{w.time}</td>
                          <td style={tableCellStyle}>
                            <Badge
                              bg={
                                w.status === 'Completed' ? 'success' :
                                w.status === 'Pending' ? 'warning' : 'danger'
                              }
                            >
                              {w.status}
                            </Badge>
                          </td>
                          <td style={tableCellStyle}>
                            {w.status === 'Pending' && (
                              <div className="d-flex gap-2 justify-content-center">
                                <Button size="sm" variant="success" onClick={() => handleWithdrawalAction(w.id, 'Completed')}>Approve</Button>
                                <Button size="sm" variant="danger" onClick={() => handleWithdrawalAction(w.id, 'Rejected')}>Reject</Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {/* GAME HISTORY */}
            {activeTab === 'gameHistory' && (
              <Card className="shadow-sm" style={{ border: '1px solid #000000' }}>
                <Card.Header className="fw-semibold" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                  GAME HISTORY
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={3}>
                      <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <FormControl
                          placeholder="Search (Rank/Status/Amount)"
                          value={gameSearch}
                          onChange={(e) => setGameSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={gameRankFilter} onChange={(e) => setGameRankFilter(e.target.value)}>
                        <option>All Ranks</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select value={gameStatusFilter} onChange={(e) => setGameStatusFilter(e.target.value)}>
                        <option>All Statuses</option>
                        <option>Win</option>
                        <option>Loss</option>
                      </Form.Select>
                    </Col>
                    <Col md={3} className="d-flex gap-2">
                      <Form.Control type="date" value={gameDateFrom} onChange={(e) => setGameDateFrom(e.target.value)} />
                      <Form.Control type="date" value={gameDateTo} onChange={(e) => setGameDateTo(e.target.value)} />
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-between mb-3">
                    <Button variant="outline-secondary" onClick={resetGameFilters}>
                      <FaUndo /> Reset Filters
                    </Button>
                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => exportToExcel(filteredGameHistory, `games_${user.id}`)}
                      >
                        <FaFileExcel /> Export Excel
                      </Button>
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => exportToCSV(filteredGameHistory, `games_${user.id}`)}
                      >
                        <FaFileCsv /> Export CSV
                      </Button>
                    </div>
                  </div>

                  <Table striped bordered hover responsive className={centerTableClasses} style={{ backgroundColor: tableBackgroundColor }}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>#</th>
                        <th style={headerCellStyle}>RANK</th>
                        <th style={headerCellStyle}>BID AMOUNT</th>
                        <th style={headerCellStyle}>WIN AMOUNT</th>
                        <th style={headerCellStyle}>LOSS AMOUNT</th>
                        <th style={headerCellStyle}>FINAL AMOUNT</th>
                        <th style={headerCellStyle}>STATUS</th>
                        <th style={headerCellStyle}>DATE</th>
                        <th style={headerCellStyle}>TIME SPENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGameHistory.map((g) => (
                        <tr key={g.sNo}>
                          <td style={tableCellStyle}>{g.sNo}</td>
                          <td style={tableCellStyle}>{g.rank}</td>
                          <td style={tableCellStyle} className="fw-bold">₹{g.bidAmount}</td>
                          <td style={tableCellStyle} className="text-success fw-bold">₹{g.winAmount}</td>
                          <td style={tableCellStyle} className="text-danger fw-bold">₹{g.lossAmount}</td>
                          <td style={tableCellStyle} className="fw-bold">₹{g.finalAmount}</td>
                          <td style={tableCellStyle}>
                            <Badge bg={g.status === 'Win' ? 'success' : 'danger'}>{g.status}</Badge>
                          </td>
                          <td style={tableCellStyle}>{formatDate(g.date)}</td>
                          <td style={tableCellStyle}>{g.timeSpent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {/* KYC REQUEST (with separate DOCUMENTS column) */}
            {activeTab === 'kyc' && (
              <Card className="shadow-sm" style={{ border: '1px solid #000000' }}>
                <Card.Header className="fw-semibold" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                  KYC REQUEST
                </Card.Header>
                <Card.Body>
                  <Row className="g-3 mb-3">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <FormControl
                          placeholder="Search (Name / Father / PAN / Aadhar)"
                          value={kycSearch}
                          onChange={(e) => setKycSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={4}>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">
                          <FaFilter /> Status: {kycStatusFilter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setKycStatusFilter('All Statuses')}>All Statuses</Dropdown.Item>
                          <Dropdown.Item onClick={() => setKycStatusFilter('Pending')}>Pending</Dropdown.Item>
                          <Dropdown.Item onClick={() => setKycStatusFilter('Completed')}>Completed</Dropdown.Item>
                          <Dropdown.Item onClick={() => setKycStatusFilter('Rejected')}>Rejected</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col md={4}>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary">
                          <FaFilter /> Decision: {kycDecisionFilter}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setKycDecisionFilter('All Decisions')}>All Decisions</Dropdown.Item>
                          <Dropdown.Item onClick={() => setKycDecisionFilter('Approve')}>Approve</Dropdown.Item>
                          <Dropdown.Item onClick={() => setKycDecisionFilter('Reject')}>Reject</Dropdown.Item>
                          <Dropdown.Item onClick={() => setKycDecisionFilter('No Decision')}>No Decision</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between mb-3">
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setKycSearch('');
                        setKycStatusFilter('All Statuses');
                        setKycDecisionFilter('All Decisions');
                      }}
                    >
                      <FaUndo /> Reset Filters
                    </Button>
                    <div className="d-flex gap-2">
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => {
                          // flatten docs for export
                          const flat = filteredKycRequests.map((k) => ({
                            id: k.id,
                            playerId: k.playerId,
                            playerName: k.playerName,
                            fatherName: k.fatherName,
                            dob: k.dob,
                            panNumber: k.panNumber,
                            aadharNumber: k.aadharNumber,
                            requestDate: k.requestDate,
                            requestTime: k.requestTime,
                            status: k.status,
                            decision: k.decision || '',
                            decisionDate: k.decisionDate || '',
                            decisionTime: k.decisionTime || '',
                            aadharFrontUrl: k.docs?.aadharFront?.url || '',
                            aadharBackUrl: k.docs?.aadharBack?.url || '',
                            panCardUrl: k.docs?.panCard?.url || ''
                          }));
                          exportToExcel(flat, `kyc_${user.id}`);
                        }}
                      >
                        <FaFileExcel /> Export Excel
                      </Button>
                      <Button
                        variant="warning"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                        onClick={() => {
                          const flat = filteredKycRequests.map((k) => ({
                            id: k.id,
                            playerId: k.playerId,
                            playerName: k.playerName,
                            fatherName: k.fatherName,
                            dob: k.dob,
                            panNumber: k.panNumber,
                            aadharNumber: k.aadharNumber,
                            requestDate: k.requestDate,
                            requestTime: k.requestTime,
                            status: k.status,
                            decision: k.decision || '',
                            decisionDate: k.decisionDate || '',
                            decisionTime: k.decisionTime || '',
                            aadharFrontUrl: k.docs?.aadharFront?.url || '',
                            aadharBackUrl: k.docs?.aadharBack?.url || '',
                            panCardUrl: k.docs?.panCard?.url || ''
                          }));
                          exportToCSV(flat, `kyc_${user.id}`);
                        }}
                      >
                        <FaFileCsv /> Export CSV
                      </Button>
                    </div>
                  </div>

                  <Table striped bordered hover responsive className={centerTableClasses} style={{ backgroundColor: tableBackgroundColor }}>
                    <thead>
                      <tr>
                        <th style={headerCellStyle}>REQUEST ID</th>
                        <th style={headerCellStyle}>PLAYER</th>
                        <th style={headerCellStyle}>FATHER NAME</th>
                        <th style={headerCellStyle}>DOB</th>
                        <th style={headerCellStyle}>PAN CARD NUMBER</th>
                        <th style={headerCellStyle}>AADHAR CARD NUMBER</th>
                        <th style={headerCellStyle}>REQUEST DATE</th>
                        <th style={headerCellStyle}>REQUEST TIME</th>
                        <th style={headerCellStyle}>DOCUMENTS</th>
                        <th style={headerCellStyle}>STATUS</th>
                        <th style={headerCellStyle}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKycRequests.length > 0 ? (
                        filteredKycRequests.map((k) => (
                          <tr key={k.id}>
                            <td style={tableCellStyle}>{k.id}</td>
                            <td style={tableCellStyle}>{k.playerName}</td>
                            <td style={tableCellStyle}>{k.fatherName}</td>
                            <td style={tableCellStyle}>{formatDate(k.dob)}</td>
                            <td style={tableCellStyle}>{k.panNumber}</td>
                            <td style={tableCellStyle}>{k.aadharNumber}</td>
                            <td style={tableCellStyle}>{formatDate(k.requestDate)}</td>
                            <td style={tableCellStyle}>{k.requestTime}</td>
                            <td style={tableCellStyle}>
                              <Button size="sm" variant="secondary" onClick={() => openDocs(k)}>
                                <FaEye /> View
                              </Button>
                            </td>
                            <td style={tableCellStyle}>{statusBadge(k.status)}</td>
                            <td style={tableCellStyle}>
                              <div className="d-flex gap-2 justify-content-center">
                                <Button
                                  size="sm"
                                  variant="success"
                                  disabled={k.status === 'Completed'}
                                  onClick={() => markKyc(k.id, 'Approve')}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  disabled={k.status === 'Rejected'}
                                  onClick={() => markKyc(k.id, 'Reject')}
                                >
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={11} style={tableCellStyle} className="py-4">
                            No KYC requests found for this user.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </div>
        </MainCard>
      </Col>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>CONFIRM DELETE</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="text-center">Are you sure you want to delete this profile?</p>
          <p className="text-center text-danger">This action cannot be undone!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>CANCEL</Button>
          <Button variant="danger" onClick={confirmDeleteProfile}>DELETE PROFILE</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Coins Modal */}
      <Modal show={showAddCoinsModal} onHide={() => setShowAddCoinsModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>ADD COINS</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>AMOUNT TO ADD (₹)</Form.Label>
            <Form.Control
              type="number"
              value={coinsAmount}
              onChange={(e) => setCoinsAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>REASON (OPTIONAL)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={transactionReason}
              onChange={(e) => setTransactionReason(e.target.value)}
              placeholder="Enter reason for adding coins"
            />
          </Form.Group>
          <div className="mt-3 p-2 bg-light rounded">
            <p className="mb-1">Current Balance: ₹{currentMoney.toLocaleString()}</p>
            <p className="mb-0 fw-bold">
              New Balance: ₹{(currentMoney + (parseInt(coinsAmount || '0', 10) || 0)).toLocaleString()}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCoinsModal(false)}>CANCEL</Button>
          <Button variant="success" onClick={confirmAddCoins}>ADD COINS</Button>
        </Modal.Footer>
      </Modal>

      {/* Deduct Coins Modal */}
      <Modal show={showDeductCoinsModal} onHide={() => setShowDeductCoinsModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>DEDUCT COINS</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>AMOUNT TO DEDUCT (₹)</Form.Label>
            <Form.Control
              type="number"
              value={coinsAmount}
              onChange={(e) => setCoinsAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              max={currentMoney}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>REASON (OPTIONAL)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={transactionReason}
              onChange={(e) => setTransactionReason(e.target.value)}
              placeholder="Enter reason for deducting coins"
            />
          </Form.Group>
          <div className="mt-3 p-2 bg-light rounded">
            <p className="mb-1">Current Balance: ₹{currentMoney.toLocaleString()}</p>
            <p className="mb-0 fw-bold">
              New Balance: ₹{(currentMoney - (parseInt(coinsAmount || '0', 10) || 0)).toLocaleString()}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeductCoinsModal(false)}>CANCEL</Button>
          <Button variant="warning" onClick={confirmDeductCoins}>DEDUCT COINS</Button>
        </Modal.Footer>
      </Modal>

      {/* KYC Documents Modal */}
      <Modal show={docsModalOpen} onHide={() => setDocsModalOpen(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            KYC Documents {selectedKyc ? `— ${selectedKyc.playerName} (${selectedKyc.id})` : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedKyc ? (
            <Row className="g-3">
              {/* Aadhar Front */}
              <Col md={4}>
                <Card className="h-100" style={{ border: '1px solid #000000' }}>
                  <Card.Header className="text-center" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                    AADHAR FRONT
                  </Card.Header>
                  <Card.Body className="p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: tableBackgroundColor }}>
                    {selectedKyc.docs?.aadharFront?.url ? (
                      isImage(selectedKyc.docs.aadharFront.mime) ? (
                        <img
                          src={selectedKyc.docs.aadharFront.url}
                          alt="Aadhar Front"
                          style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }}
                        />
                      ) : isPdf(selectedKyc.docs.aadharFront.mime) ? (
                        <embed
                          src={selectedKyc.docs.aadharFront.url}
                          type="application/pdf"
                          width="100%"
                          height="320px"
                        />
                      ) : (
                        <div className="text-muted">Unsupported format</div>
                      )
                    ) : (
                      <div className="text-muted">Not provided</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Aadhar Back */}
              <Col md={4}>
                <Card className="h-100" style={{ border: '1px solid #000000' }}>
                  <Card.Header className="text-center" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                    AADHAR BACK
                  </Card.Header>
                  <Card.Body className="p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: tableBackgroundColor }}>
                    {selectedKyc.docs?.aadharBack?.url ? (
                      isImage(selectedKyc.docs.aadharBack.mime) ? (
                        <img
                          src={selectedKyc.docs.aadharBack.url}
                          alt="Aadhar Back"
                          style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }}
                        />
                      ) : isPdf(selectedKyc.docs.aadharBack.mime) ? (
                        <embed
                          src={selectedKyc.docs.aadharBack.url}
                          type="application/pdf"
                          width="100%"
                          height="320px"
                        />
                      ) : (
                        <div className="text-muted">Unsupported format</div>
                      )
                    ) : (
                      <div className="text-muted">Not provided</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* PAN Card */}
              <Col md={4}>
                <Card className="h-100" style={{ border: '1px solid #000000' }}>
                  <Card.Header className="text-center" style={{ ...headerCellStyle, backgroundColor: '#00BFFF' }}>
                    PAN CARD
                  </Card.Header>
                  <Card.Body className="p-2 d-flex align-items-center justify-content-center" style={{ backgroundColor: tableBackgroundColor }}>
                    {selectedKyc.docs?.panCard?.url ? (
                      isImage(selectedKyc.docs.panCard.mime) ? (
                        <img
                          src={selectedKyc.docs.panCard.url}
                          alt="PAN Card"
                          style={{ maxWidth: '100%', maxHeight: 320, objectFit: 'contain' }}
                        />
                      ) : isPdf(selectedKyc.docs.panCard.mime) ? (
                        <embed
                          src={selectedKyc.docs.panCard.url}
                          type="application/pdf"
                          width="100%"
                          height="320px"
                        />
                      ) : (
                        <div className="text-muted">Unsupported format</div>
                      )
                    ) : (
                      <div className="text-muted">Not provided</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <div className="text-center text-muted">No request selected.</div>
          )}
          <div className="mt-3 small text-muted">
            Allowed formats: JPG, JPEG, PDF • Max size: 5 MB (enforced by your uploader on the app side)
          </div>
        </Modal.Body>
        <Modal.Footer>
          {selectedKyc && (
            <div className="me-auto">
              Current Status:&nbsp;{statusBadge(selectedKyc.status)}&nbsp;
              {selectedKyc.decision ? `• Decision: ${selectedKyc.decision}` : '• Decision: —'}
            </div>
          )}
          <Button variant="secondary" onClick={() => setDocsModalOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
};

export default UserDetails;
