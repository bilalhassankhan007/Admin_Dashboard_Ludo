import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Form, 
  Pagination, 
  Row, 
  Col,
  Dropdown,
  ProgressBar,
  Modal,
  Spinner,
  Alert
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaFilter,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaMoneyBillWave,
  FaUndo,
  FaCrown,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { leaderboardAPI } from '../../services/apiService';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await leaderboardAPI.getLeaderboard();
        if (response.data.success) {
          setLeaderboardData(response.data.leaderboard || []);
        } else {
          setError('Failed to fetch leaderboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const processedData = useMemo(() => {
    let data = [...leaderboardData];
    
    if (filter !== 'all') {
      data = data.filter(player => 
        filter === 'highPerformers' ? player.winRate > 80 :
        filter === 'lowPerformers' ? player.winRate < 50 :
        player.country === filter
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(player =>
        player.first_name.toLowerCase().includes(term) ||
        player.email.toLowerCase().includes(term)
      );
    }
    
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return data;
  }, [leaderboardData, searchTerm, sortConfig, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getRankColor = (rank) => {
    if (rank <= 20) return '#2ecc71';
    if (rank <= 50) return '#f39c12';
    return '#e74c3c';
  };

  const getPerformanceVariant = (performance) => {
    if (performance >= 70) return 'success';
    if (performance >= 50) return 'warning';
    return 'danger';
  };

  const handleViewStats = (player) => {
    setSelectedPlayer(player);
    setShowStats(true);
  };

  const getChartData = (player) => {
    return [
      { name: 'Wins', value: player.twoPlayWin + player.fourPlayWin },
      { name: 'Total Games', value: player.gamesPlayed || (player.twoPlayWin + player.fourPlayWin + Math.floor(Math.random() * 10)) }
    ];
  };

  const COLORS = ['#3498db', '#2ecc71', '#f39c12'];

  const handleRowClick = (id) => {
    setSelectedRow(id === selectedRow ? null : id);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F0FFFF', minHeight: '100vh', padding: '20px' }}>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#F0FFFF', minHeight: '100vh', padding: '20px' }}>
        <Alert variant="danger" className="m-4">
          Error loading leaderboard: {error}
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#F0FFFF', minHeight: '100vh', padding: '20px' }}>
      <Card style={{ borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Card.Header className="d-flex justify-content-between align-items-center" 
          style={{ 
            backgroundColor: '#000000', 
            color: 'white', 
            padding: '15px 25px',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px'
          }}>
          <Card.Title as="h3" className="mb-0" style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            <FaChartLine className="me-2" />
            LEADERBOARD
          </Card.Title>
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant="outline-light" 
              onClick={() => setShowFilters(!showFilters)}
              style={{ fontWeight: 'bold', letterSpacing: '1px' }}
            >
              <FaFilter className="me-1" /> FILTER
            </Button>
            
            <Form.Control
              type="text"
              placeholder="Search players..."
              style={{ 
                width: '250px', 
                fontWeight: 'bold',
                borderRadius: '20px',
                border: '2px solid #3498db',
                padding: '8px 15px'
              }}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </Card.Header>

        {showFilters && (
          <Card.Body className="pt-3 pb-3 border-bottom" style={{ backgroundColor: '#F0FFFF' }}>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 'bold', color: '#2c3e50' }}>PERFORMANCE</Form.Label>
                  <Form.Select 
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ borderRadius: '10px', border: '2px solid #3498db' }}
                  >
                    <option value="all">ALL PLAYERS</option>
                    <option value="highPerformers">HIGH PERFORMERS (80+)</option>
                    <option value="lowPerformers">LOW PERFORMERS (&lt;50)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 'bold', color: '#2c3e50' }}>ITEMS PER PAGE</Form.Label>
                  <Form.Select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ borderRadius: '10px', border: '2px solid #3498db' }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    setFilter('all');
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  style={{ 
                    fontWeight: 'bold', 
                    borderRadius: '10px',
                    border: '2px solid #3498db',
                    color: '#2c3e50'
                  }}
                >
                  <FaUndo className="me-1" /> RESET FILTER
                </Button>
              </Col>
            </Row>
          </Card.Body>
        )}

        <Card.Body style={{ backgroundColor: '#F0FFFF' }}>
          <div className="table-responsive">
            <Table bordered hover className="mb-0" style={{ borderColor: '#3498db' }}>
              <thead>
                <tr style={{ backgroundColor: '#000000' }}>
                  <th 
                    onClick={() => requestSort('rank')} 
                    className="cursor-pointer text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    RANK {sortConfig.key === 'rank' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />
                    )}
                  </th>
                  <th 
                    className="text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    PLAYER NAME
                  </th>
                  <th 
                    className="text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    EMAIL
                  </th>
                  <th 
                    className="text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    WINS
                  </th>
                  <th 
                    onClick={() => requestSort('winRate')} 
                    className="cursor-pointer text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    WIN RATE {sortConfig.key === 'winRate' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />
                    )}
                  </th>
                  <th 
                    className="text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    WALLET
                  </th>
                  <th 
                    onClick={() => requestSort('wallet')} 
                    className="cursor-pointer text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    BALANCE {sortConfig.key === 'wallet' && (
                      sortConfig.direction === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />
                    )}
                  </th>
                  <th 
                    className="text-center"
                    style={{ 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase', 
                      color: 'white',
                      padding: '15px',
                      borderColor: '#3498db'
                    }}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {currentItems.map((player) => {
                  const totalWins = (player.twoPlayWin || 0) + (player.fourPlayWin || 0);
                  const totalGames = totalWins + Math.floor(totalWins * 0.3); // Estimate total games
                  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
                  
                  return (
                    <tr 
                      key={player._id}
                      onClick={() => handleRowClick(player._id)}
                      style={{ 
                        backgroundColor: selectedRow === player._id ? '#00CED1' : '#E0FFFF',
                        fontSize: '16px',
                        cursor: 'pointer',
                        borderColor: '#3498db'
                      }}
                    >
                      <td className="text-center" style={{ borderColor: '#3498db', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center justify-content-center">
                          {player.rank === 1 && <FaCrown className="me-1" style={{ color: '#f1c40f' }} />}
                          <span style={{ 
                            fontWeight: 'bold', 
                            color: getRankColor(player.rank),
                            fontSize: player.rank === 1 ? '18px' : '16px'
                          }}>
                            {player.rank}
                          </span>
                        </div>
                      </td>
                      
                      <td className="text-center" style={{ borderColor: '#3498db', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center justify-content-center">
                          <div>
                            <div className="fw-bold" style={{ color: '#2c3e50' }}>{player.first_name}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="text-center" style={{ borderColor: '#3498db', verticalAlign: 'middle', color: '#2c3e50' }}>
                        {player.email}
                      </td>
                      
                      <td className="text-center" style={{ borderColor: '#3498db', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <span className="fw-bold" style={{ color: '#2ecc71' }}>{totalWins}</span>
                        </div>
                      </td>
                      
                      <td className="text-center" style={{ borderColor: '#3498db', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <span className="fw-bold" style={{ color: '#2c3e50' }}>{winRate}%</span>
                          <ProgressBar 
                            now={winRate} 
                            variant={winRate > 70 ? 'success' : winRate > 50 ? 'warning' : 'danger'}
                            style={{ height: '8px', width: '80px', borderRadius: '10px' }}
                          />
                        </div>
                      </td>
                      
                      <td className="text-center fw-bold" style={{ borderColor: '#3498db', verticalAlign: 'middle', color: '#2c3e50' }}>
                        ₹{player.wallet?.toLocaleString() || '0'}
                      </td>
                      
                      <td className="text-center fw-bold" style={{ borderColor: '#3498db', verticalAlign: 'middle', color: '#2c3e50' }}>
                        ₹{player.wincoin?.toLocaleString() || '0'}
                      </td>
                      
                      <td className="text-center" style={{ borderColor: '#3498db', verticalAlign: 'middle' }}>
                        <Dropdown>
                          <Dropdown.Toggle 
                            variant="outline-primary" 
                            size="sm" 
                            id="dropdown-basic"
                            style={{
                              borderColor: '#3498db',
                              color: '#2c3e50',
                              fontWeight: 'bold',
                              borderRadius: '10px'
                            }}
                          >
                            ACTIONS
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item 
                              onClick={() => handleViewStats(player)}
                              style={{ fontWeight: '500' }}
                            >
                              <FaChartBar className="me-2" /> VIEW STATS
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          
          {processedData.length === 0 && (
            <div className="text-center py-5">
              <h4 style={{ color: '#2c3e50' }}>No players found matching your criteria</h4>
              <Button 
                variant="outline-primary" 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                style={{ 
                  borderRadius: '10px',
                  border: '2px solid #3498db',
                  color: '#2c3e50',
                  fontWeight: 'bold'
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div style={{ color: '#7f8c8d', fontWeight: '500' }}>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, processedData.length)} of {processedData.length} entries
              </div>
              <Pagination className="mb-0">
                <Pagination.First 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1} 
                  style={{ borderColor: '#3498db' }}
                />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1} 
                  style={{ borderColor: '#3498db' }}
                />
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Pagination.Item 
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{ 
                        borderColor: '#3498db',
                        color: pageNum === currentPage ? 'white' : '#2c3e50',
                        backgroundColor: pageNum === currentPage ? '#3498db' : 'transparent'
                      }}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages} 
                  style={{ borderColor: '#3498db' }}
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages} 
                  style={{ borderColor: '#3498db' }}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>

        <Modal show={showStats} onHide={() => setShowStats(false)} size="lg" centered>
          <Modal.Header closeButton style={{ backgroundColor: '#000000', color: 'white' }}>
            <Modal.Title>
              <FaChartBar className="me-2" />
              Player Statistics: {selectedPlayer?.first_name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#F0FFFF' }}>
            {selectedPlayer && (
              <div>
                <Row className="mb-4">
                  <Col md={6}>
                    <h5 className="text-center mb-3" style={{ color: '#2c3e50' }}>
                      <FaMoneyBillWave className="me-2" />
                      Player Details
                    </h5>
                    <Table striped bordered hover>
                      <tbody>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>Rank</td>
                          <td style={{ color: '#2c3e50' }}>{selectedPlayer.rank}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>Name</td>
                          <td style={{ color: '#2c3e50' }}>{selectedPlayer.first_name}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>Email</td>
                          <td style={{ color: '#2c3e50' }}>{selectedPlayer.email}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>Wallet Balance</td>
                          <td style={{ color: '#2c3e50' }}>₹{selectedPlayer.wallet?.toLocaleString() || '0'}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>Win Coins</td>
                          <td style={{ color: '#2c3e50' }}>₹{selectedPlayer.wincoin?.toLocaleString() || '0'}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>2 Player Wins</td>
                          <td style={{ color: '#2c3e50' }}>{selectedPlayer.twoPlayWin || 0}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold" style={{ color: '#2c3e50' }}>4 Player Wins</td>
                          <td style={{ color: '#2c3e50' }}>{selectedPlayer.fourPlayWin || 0}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h5 className="text-center mb-3" style={{ color: '#2c3e50' }}>
                      <FaChartPie className="me-2" />
                      Win Distribution
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: '2 Player Wins', value: selectedPlayer.twoPlayWin || 0 },
                            { name: '4 Player Wins', value: selectedPlayer.fourPlayWin || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell key="cell-0" fill="#3498db" />
                          <Cell key="cell-1" fill="#2ecc71" />
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#000000', 
                            borderColor: '#3498db',
                            color: 'white',
                            borderRadius: '10px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Col>
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#F0FFFF' }}>
            <Button 
              variant="secondary" 
              onClick={() => setShowStats(false)}
              style={{ 
                backgroundColor: '#3498db',
                borderColor: '#3498db',
                borderRadius: '10px',
                fontWeight: 'bold'
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </div>
  );
};

export default Leaderboard;