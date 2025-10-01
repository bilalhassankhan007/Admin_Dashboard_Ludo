import { Card, Table, Form, Button, Row, Col, Badge, Dropdown, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { FaFilter, FaSearch, FaSort, FaSortUp, FaSortDown, FaUndo, FaFileDownload, FaFileExcel, FaCheck } from 'react-icons/fa';
import { BsFiletypeCsv, BsExclamationTriangle } from 'react-icons/bs';

export default function TransactionHistory() {
  // Sample transaction data
  const sampleTransactions = [
    { id: 'TXN1001', date: '2023-05-15', time: '14:30', amount: 1500, type: 'Deposit', status: 'Completed', method: 'UPI', reference: 'REF789456', player: 'James Bond' },
    { id: 'TXN1002', date: '2023-05-14', time: '11:45', amount: 500, type: 'Withdrawal', status: 'Pending', method: 'Bank Transfer', reference: 'REF123456', player: 'Kim Jong' },
    { id: 'TXN1003', date: '2023-05-12', time: '09:15', amount: 2000, type: 'Deposit', status: 'Completed', method: 'Wallet', reference: 'REF654321', player: 'Mamta Ji' },
    { id: 'TXN1004', date: '2023-05-10', time: '16:20', amount: 1000, type: 'Withdrawal', status: 'Completed', method: 'Bank Transfer', reference: 'REF987654', player: 'Eminem' },
  ];

  // State management
  const [transactions] = useState(sampleTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    type: 'All',
    status: 'All',
    method: 'All'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Format date to DD-MM-YYYY
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    return (
      (txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.player.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
      (filters.type === 'All' || txn.type === filters.type) &&
      (filters.status === 'All' || txn.status === filters.status) &&
      (filters.method === 'All' || txn.method === filters.method)
  )});

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Failed': return 'danger';
      case 'Rejected': return 'secondary';
      default: return 'primary';
    }
  };

  // Type badge color
  const getTypeBadge = (type) => {
    switch (type) {
      case 'Deposit': return 'success';
      case 'Withdrawal': return 'danger';
      case 'Bonus': return 'info';
      default: return 'primary';
    }
  };

  // Export to CSV with success/error handling
  const exportToCSV = () => {
    try {
      const headers = [
        'Transaction ID', 'Date', 'Time', 'Amount (₹)', 
        'Type', 'Player Names', 'Method', 'Reference', 'Status'
      ];
      
      const data = sortedTransactions.map(txn => [
        txn.id,
        formatDate(txn.date),
        txn.time,
        txn.type === 'Deposit' ? `+${txn.amount}` : `-${txn.amount}`,
        txn.type,
        txn.player,
        txn.method,
        txn.reference,
        txn.status
      ]);
      
      let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + data.map(row => row.join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `transactions_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success modal
      setModalMessage('CSV file downloaded successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      setModalMessage('Failed to download CSV file. Please try again.');
      setShowErrorModal(true);
    }
  };

  // Export to Excel with success/error handling
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(sortedTransactions.map(txn => ({
        'Transaction ID': txn.id,
        'Date': formatDate(txn.date),
        'Time': txn.time,
        'Amount (₹)': txn.type === 'Deposit' ? txn.amount : -txn.amount,
        'Type': txn.type,
        'Player Names': txn.player,
        'Method': txn.method,
        'Reference': txn.reference,
        'Status': txn.status
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      XLSX.writeFile(workbook, `transactions_${new Date().toISOString().slice(0,10)}.xlsx`);
      
      // Show success modal
      setModalMessage('Excel file downloaded successfully!');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      setModalMessage('Failed to download Excel file. Please try again.');
      setShowErrorModal(true);
    }
  };

  // Handle search button click
  const handleSearchClick = () => {
    setIsSearchClicked(!isSearchClicked);
    // Your search logic here (already handled by the filteredTransactions)
  };

  // Handle row selection
  const handleRowClick = (id) => {
    setSelectedRow(id === selectedRow ? null : id);
  };

  return (
    <div style={{ 
      backgroundColor: '#FFFACD', 
      minHeight: '100vh', 
      padding: '20px'
    }}>
      {/* Success Modal */}
      <Modal 
        show={showSuccessModal} 
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton style={{ borderBottom: '2px solid #00FF00' }}>
          <Modal.Title className="d-flex align-items-center">
            <FaCheck className="me-2" style={{ color: '#00FF00' }} />
            Success
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p style={{ fontSize: '1.1rem' }}>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={() => setShowSuccessModal(false)}
            style={{ backgroundColor: '#00FF00', borderColor: '#00FF00' }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal 
        show={showErrorModal} 
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton style={{ borderBottom: '2px solid #FF0000' }}>
          <Modal.Title className="d-flex align-items-center">
            <BsExclamationTriangle className="me-2" style={{ color: '#FF0000' }} />
            Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p style={{ fontSize: '1.1rem' }}>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="danger" 
            onClick={() => setShowErrorModal(false)}
            style={{ backgroundColor: '#FF0000', borderColor: '#FF0000' }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Card className="border-0 shadow-sm" style={{ backgroundColor: '#FFFACD' }}>
        {/* Header Section with Gradient Background */}
        <Card.Header 
          className="py-4"
          style={{ 
            background: 'linear-gradient(to right, #212121, #424242)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid #000000',
            color: 'white'
          }}
        >
          <Card.Title 
            as="h3" 
            className="mb-0 fw-bold" 
            style={{ 
              marginLeft: '30px',
              fontSize: '1.5rem',
              color: 'white'
            }}
          >
            TRANSACTION HISTORY
          </Card.Title>
          
          <div className="d-flex align-items-center" style={{ marginRight: '30px' }}>
            <Form.Control
              type="text"
              placeholder="Search by ID, Reference or Player"
              className="me-2 rounded-pill"
              style={{ 
                width: '300px', 
                fontSize: '1rem',
                backgroundColor: '#424242',
                color: 'white',
                border: '1px solid #616161'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant={isSearchClicked ? 'warning' : 'dark'}
              className="rounded-pill me-2"
              style={{ 
                backgroundColor: isSearchClicked ? '#FFFF00' : '#424242',
                color: isSearchClicked ? '#000000' : 'white',
                fontWeight: 'bold',
                border: '1px solid #616161'
              }}
              onClick={handleSearchClick}
            >
              <FaSearch className="me-1" /> SEARCH
            </Button>
            
            {/* Export Dropdown */}
            <Dropdown>
              <Dropdown.Toggle 
                variant="dark" 
                className="rounded-pill"
                style={{ 
                  backgroundColor: '#424242', 
                  color: 'white',
                  borderColor: '#616161',
                  fontWeight: 'bold'
                }}
              >
                <FaFileDownload className="me-1" /> EXPORT
              </Dropdown.Toggle>
              <Dropdown.Menu 
                className="shadow-sm"
                style={{ 
                  border: '1px solid #000000',
                  backgroundColor: '#424242'
                }}
              >
                <Dropdown.Item 
                  onClick={exportToExcel}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    color: 'white',
                    ':hover': {
                      backgroundColor: '#616161'
                    }
                  }}
                  className="hover-effect"
                >
                  <div 
                    className="d-flex align-items-center"
                    style={{ padding: '8px' }}
                  >
                    <FaFileExcel className="me-2" style={{ color: '#1d6f42', fontSize: '1.2rem' }} />
                    <span>Excel (.xlsx)</span>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={exportToCSV}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                  className="hover-effect"
                >
                  <div 
                    className="d-flex align-items-center"
                    style={{ padding: '8px' }}
                  >
                    <BsFiletypeCsv className="me-2" style={{ color: '#239120', fontSize: '1.2rem' }} />
                    <span>CSV (.csv)</span>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Header>
        
        <Card.Body className="p-4" style={{ backgroundColor: '#FFFACD' }}>
          {/* Filters Section */}
          <Row className="mb-4 g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold" style={{ color: '#000000', fontSize: '1.1rem' }}>TRANSACTION TYPE</Form.Label>
                <Form.Select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="rounded-pill shadow-sm"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#000000',
                    border: '1px solid #000000',
                    fontSize: '1rem'
                  }}
                >
                  <option value="All" className="fw-bold">ALL TYPES</option>
                  <option value="Deposit">DEPOSIT</option>
                  <option value="Withdrawal">WITHDRAWAL</option>
                  <option value="Bonus">BONUS</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold" style={{ color: '#000000', fontSize: '1.1rem' }}>STATUS</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="rounded-pill shadow-sm"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#000000',
                    border: '1px solid #000000',
                    fontSize: '1rem'
                  }}
                >
                  <option value="All" className="fw-bold">ALL STATUSES</option>
                  <option value="Completed">COMPLETED</option>
                  <option value="Pending">PENDING</option>
                  <option value="Failed">FAILED</option>
                  <option value="Rejected">REJECTED</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-bold" style={{ color: '#000000', fontSize: '1.1rem' }}>PAYMENT METHOD</Form.Label>
                <Form.Select
                  value={filters.method}
                  onChange={(e) => setFilters({...filters, method: e.target.value})}
                  className="rounded-pill shadow-sm"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    color: '#000000',
                    border: '1px solid #000000',
                    fontSize: '1rem'
                  }}
                >
                  <option value="All" className="fw-bold">ALL METHODS</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">BANK TRANSFER</option>
                  <option value="Wallet">WALLET</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                className="rounded-pill shadow-sm w-100"
                onClick={() => {
                  setFilters({ type: 'All', status: 'All', method: 'All' });
                  setSearchTerm('');
                }}
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: '#000000',
                  border: '1px solid #000000',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                <FaUndo className="me-1" /> RESET FILTERS
              </Button>
            </Col>
          </Row>

          {/* Transaction Table */}
          <div className="table-responsive rounded-3" style={{ 
            backgroundColor: '#FFFACD',
            border: '2px solid #000000'
          }}>
            <Table bordered hover className="mb-0" style={{ 
              backgroundColor: '#FFFACD',
              fontSize: '1.05rem'
            }}>
              <thead>
                <tr>
                  <th 
                    onClick={() => requestSort('id')} 
                    className="cursor-pointer text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      ID
                      {sortConfig.key === 'id' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      ) : <FaSort className="ms-1" style={{ color: '#ffffff' }} />}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('date')} 
                    className="cursor-pointer text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      DATE & TIME
                      {sortConfig.key === 'date' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      ) : <FaSort className="ms-1" style={{ color: '#ffffff' }} />}
                    </div>
                  </th>
                  <th 
                    onClick={() => requestSort('amount')} 
                    className="cursor-pointer text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      AMOUNT (₹)
                      {sortConfig.key === 'amount' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      ) : <FaSort className="ms-1" style={{ color: '#ffffff' }} />}
                    </div>
                  </th>
                  <th 
                    className="text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    TYPE
                  </th>
                  <th 
                    className="text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    PLAYER NAMES
                  </th>
                  <th 
                    className="text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    METHOD
                  </th>
                  <th 
                    className="text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    REFERENCE
                  </th>
                  <th 
                    className="text-center text-uppercase fw-bold align-middle"
                    style={{ 
                      backgroundColor: '#000000', 
                      color: '#ffffff',
                      border: '1px solid #000000',
                      padding: '12px'
                    }}
                  >
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((txn) => (
                    <tr 
                      key={txn.id} 
                      style={{ 
                        backgroundColor: txn.id === selectedRow ? '#D3D3D3' : '#FFFACD',
                        borderBottom: '1px solid #000000',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleRowClick(txn.id)}
                    >
                      <td 
                        className="text-center align-middle fw-medium" 
                        style={{ 
                          color: '#000000',
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        {txn.id}
                      </td>
                      <td 
                        className="text-center align-middle" 
                        style={{ 
                          color: '#000000',
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        <div>{formatDate(txn.date)}</div>
                        <div className="small">{txn.time}</div>
                      </td>
                      <td 
                        className={`text-center align-middle fw-bold ${txn.type === 'Deposit' ? 'text-success' : 'text-danger'}`}
                        style={{ 
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        {txn.type === 'Deposit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td 
                        className="text-center align-middle"
                        style={{ 
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        <Badge bg={getTypeBadge(txn.type)} className="px-3 py-2 fs-6">
                          {txn.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td 
                        className="text-center align-middle fw-medium" 
                        style={{ 
                          color: '#000000',
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        {txn.player}
                      </td>
                      <td 
                        className="text-center align-middle" 
                        style={{ 
                          color: '#000000',
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        {txn.method}
                      </td>
                      <td 
                        className="text-center align-middle" 
                        style={{ 
                          color: '#000000',
                          padding: '12px',
                          borderRight: '1px solid #000000'
                        }}
                      >
                        {txn.reference}
                      </td>
                      <td 
                        className="text-center align-middle"
                        style={{ padding: '12px' }}
                      >
                        <Badge bg={getStatusBadge(txn.status)} className="px-3 py-2 fs-6">
                          {txn.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan="8" 
                      className="text-center py-4" 
                      style={{ 
                        color: '#000000',
                        borderRight: '1px solid #000000'
                      }}
                    >
                      <div className="py-3">
                        <i className="bi bi-exclamation-circle fs-1"></i>
                        <p className="mt-2 fs-5">No transactions found matching your criteria</p>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="mt-2 rounded-pill"
                          onClick={() => {
                            setFilters({ type: 'All', status: 'All', method: 'All' });
                            setSearchTerm('');
                          }}
                          style={{ 
                            backgroundColor: '#ffffff', 
                            color: '#000000',
                            border: '1px solid #000000',
                            fontWeight: 'bold'
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div 
            className="d-flex justify-content-between align-items-center mt-4" 
            style={{ 
              color: '#000000',
              fontSize: '1.1rem'
            }}
          >
            <div>
              Showing <span className="fw-bold">{sortedTransactions.length}</span> of{' '}
              <span className="fw-bold">{transactions.length}</span> entries
            </div>
            <div className="d-flex">
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="rounded-pill me-2" 
                disabled
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: '#000000',
                  border: '1px solid #000000',
                  fontWeight: 'bold'
                }}
              >
                Previous
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="rounded-pill"
                style={{ 
                  backgroundColor: '#ffffff', 
                  color: '#000000',
                  border: '1px solid #000000',
                  fontWeight: 'bold'
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}