// import { useState } from 'react';
// import { Row, Col, Modal, Form, Button, Table, Badge, Tabs, Input, Select, message } from 'antd';
// import { Link } from 'react-router-dom';
// import { 
//   SearchOutlined, 
//   DeleteOutlined, 
//   PlusOutlined, 
//   MinusOutlined, 
//   HistoryOutlined,
//   AndroidOutlined,
//   AppleOutlined,
//   DesktopOutlined
// } from '@ant-design/icons';
// import MainCard from '../../components/Card/MainCard';

// const { TabPane } = Tabs;
// const { Option } = Select;

// const UserProfile = () => {
//   // State management
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [showAddCoinsModal, setShowAddCoinsModal] = useState(false);
//   const [showDeductCoinsModal, setShowDeductCoinsModal] = useState(false);
//   const [coinsAmount, setCoinsAmount] = useState(0);
//   const [transactionReason, setTransactionReason] = useState('');
//   const [currentPlayer, setCurrentPlayer] = useState(null);
//   const playersPerPage = 10;

//   // Comprehensive dummy data
//   const [players, setPlayers] = useState([
//     {
//       id: 'P001',
//       name: 'Shashank Kumar',
//       email: 'shashank@example.com',
//       status: 'active',
//       country: 'India',
//       deviceType: 'Android',
//       contactNumber: '+91 9876543210',
//       registrationDate: '2023-01-15',
//       totalGamesPlayed: 25,
//       totalWins: 16,
//       loss: 9,
//       twoPlayerWins: 7,
//       fourPlayerWins: 9,
//       currentEarning: 1500,
//       currentMoney: 1200,
//       bidAmount: 500,
//       winRate: '64%',
//       referralEarning: 200,
//       playerTime: '3h 45m',
//       dailyPlayTime: {
//         today: '1h 30m',
//         yesterday: '2h 15m',
//         weeklyAverage: '2h 45m'
//       },
//       lastActive: '2023-06-20T14:30:00Z',
//       transactionHistory: [
//         {
//           id: 'T001',
//           date: '2023-06-20T10:30:00Z',
//           type: 'deposit',
//           amount: 1000,
//           method: 'UPI',
//           status: 'completed',
//           description: 'Initial deposit'
//         },
//         {
//           id: 'T002',
//           date: '2023-06-20T11:45:00Z',
//           type: 'game',
//           amount: -200,
//           status: 'completed',
//           description: 'Ludo game entry fee'
//         },
//         {
//           id: 'T003',
//           date: '2023-06-20T12:30:00Z',
//           type: 'win',
//           amount: 500,
//           status: 'completed',
//           description: 'Won 2-player Ludo match'
//         }
//       ],
//       gameStatistics: {
//         highestWin: 1200,
//         biggestLoss: 600,
//         favoriteGame: 'Ludo',
//         lastPlayed: '2023-06-20T12:45:00Z'
//       }
//     },
//     {
//       id: 'P002',
//       name: 'Priya Sharma',
//       email: 'priya@example.com',
//       status: 'active',
//       country: 'India',
//       deviceType: 'iOS',
//       contactNumber: '+91 8765432109',
//       registrationDate: '2023-02-10',
//       totalGamesPlayed: 42,
//       totalWins: 28,
//       loss: 14,
//       twoPlayerWins: 12,
//       fourPlayerWins: 16,
//       currentEarning: 3200,
//       currentMoney: 2500,
//       bidAmount: 1200,
//       winRate: '67%',
//       referralEarning: 450,
//       playerTime: '5h 20m',
//       dailyPlayTime: {
//         today: '2h 10m',
//         yesterday: '1h 45m',
//         weeklyAverage: '3h 10m'
//       },
//       lastActive: '2023-06-20T16:45:00Z',
//       transactionHistory: [
//         {
//           id: 'T004',
//           date: '2023-06-19T09:15:00Z',
//           type: 'deposit',
//           amount: 2000,
//           method: 'Bank Transfer',
//           status: 'completed',
//           description: 'Account funding'
//         },
//         {
//           id: 'T005',
//           date: '2023-06-19T14:30:00Z',
//           type: 'game',
//           amount: -500,
//           status: 'completed',
//           description: '4-player Ludo tournament'
//         },
//         {
//           id: 'T006',
//           date: '2023-06-20T15:00:00Z',
//           type: 'win',
//           amount: 1200,
//           status: 'completed',
//           description: 'Won tournament'
//         }
//       ],
//       gameStatistics: {
//         highestWin: 1800,
//         biggestLoss: 800,
//         favoriteGame: 'Ludo',
//         lastPlayed: '2023-06-20T15:20:00Z'
//       }
//     },
//     // Add 8 more players with similar structure
//     {
//       id: 'P003',
//       name: 'Rahul Verma',
//       email: 'rahul@example.com',
//       status: 'suspended',
//       country: 'India',
//       deviceType: 'Android',
//       contactNumber: '+91 7654321098',
//       registrationDate: '2023-03-05',
//       totalGamesPlayed: 18,
//       totalWins: 10,
//       loss: 8,
//       twoPlayerWins: 5,
//       fourPlayerWins: 5,
//       currentEarning: 800,
//       currentMoney: 600,
//       bidAmount: 300,
//       winRate: '56%',
//       referralEarning: 100,
//       playerTime: '2h 30m',
//       dailyPlayTime: {
//         today: '45m',
//         yesterday: '1h 15m',
//         weeklyAverage: '1h 50m'
//       },
//       lastActive: '2023-06-19T11:20:00Z',
//       transactionHistory: [
//         {
//           id: 'T007',
//           date: '2023-06-18T10:00:00Z',
//           type: 'deposit',
//           amount: 1000,
//           method: 'Paytm',
//           status: 'completed',
//           description: 'Mobile wallet deposit'
//         },
//         {
//           id: 'T008',
//           date: '2023-06-19T10:30:00Z',
//           type: 'game',
//           amount: -300,
//           status: 'completed',
//           description: 'Ludo game entry'
//         }
//       ],
//       gameStatistics: {
//         highestWin: 600,
//         biggestLoss: 300,
//         favoriteGame: 'Ludo',
//         lastPlayed: '2023-06-19T10:30:00Z'
//       }
//     },
//     // ... add 7 more players following the same pattern
//   ]);

//   // Filter players based on search term
//   const filteredPlayers = players.filter(player =>
//     player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     player.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const indexOfLastPlayer = currentPage * playersPerPage;
//   const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
//   const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);
//   const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return '-';
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   // Edit functionality
//   const handleEditClick = (player) => {
//     setCurrentPlayer({...player});
//     setShowEditModal(true);
//   };

//   const handleSaveChanges = () => {
//     setPlayers(players.map(p => 
//       p.id === currentPlayer.id ? currentPlayer : p
//     ));
//     setShowEditModal(false);
//     message.success('Player details updated successfully');
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentPlayer(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // View details functionality
//   const handleViewDetails = (player) => {
//     setCurrentPlayer(player);
//     setShowDetailsModal(true);
//   };

//   // Admin actions
//   const togglePlayerStatus = (playerId) => {
//     setPlayers(players.map(p => 
//       p.id === playerId ? { 
//         ...p, 
//         status: p.status === 'active' ? 'suspended' : 'active' 
//       } : p
//     ));
//     message.info(`Player status updated`);
//   };

//   const handleDeleteAccount = (playerId) => {
//     Modal.confirm({
//       title: 'Confirm Account Deletion',
//       content: 'Are you sure you want to delete this player account? This action cannot be undone.',
//       okText: 'Delete',
//       okType: 'danger',
//       cancelText: 'Cancel',
//       onOk() {
//         setPlayers(players.filter(p => p.id !== playerId));
//         message.success('Player account deleted successfully');
//       }
//     });
//   };

//   const handleAddCoins = (player) => {
//     setCurrentPlayer(player);
//     setShowAddCoinsModal(true);
//   };

//   const handleDeductCoins = (player) => {
//     setCurrentPlayer(player);
//     setShowDeductCoinsModal(true);
//   };

//   const confirmAddCoins = () => {
//     if (coinsAmount <= 0) {
//       message.error('Please enter a valid amount');
//       return;
//     }
    
//     const newTransaction = {
//       id: `T${Date.now()}`,
//       date: new Date().toISOString(),
//       type: 'admin_add',
//       amount: +coinsAmount,
//       status: 'completed',
//       description: transactionReason || 'Admin added coins'
//     };

//     setPlayers(players.map(p => 
//       p.id === currentPlayer.id ? { 
//         ...p, 
//         currentMoney: p.currentMoney + +coinsAmount,
//         transactionHistory: [newTransaction, ...p.transactionHistory]
//       } : p
//     ));
    
//     setShowAddCoinsModal(false);
//     setCoinsAmount(0);
//     setTransactionReason('');
//     message.success(`${coinsAmount} coins added to player account`);
//   };

//   const confirmDeductCoins = () => {
//     if (coinsAmount <= 0) {
//       message.error('Please enter a valid amount');
//       return;
//     }
    
//     if (coinsAmount > currentPlayer.currentMoney) {
//       message.error('Deduction amount exceeds player balance');
//       return;
//     }

//     const newTransaction = {
//       id: `T${Date.now()}`,
//       date: new Date().toISOString(),
//       type: 'admin_deduct',
//       amount: -coinsAmount,
//       status: 'completed',
//       description: transactionReason || 'Admin deducted coins'
//     };

//     setPlayers(players.map(p => 
//       p.id === currentPlayer.id ? { 
//         ...p, 
//         currentMoney: p.currentMoney - +coinsAmount,
//         transactionHistory: [newTransaction, ...p.transactionHistory]
//       } : p
//     ));
    
//     setShowDeductCoinsModal(false);
//     setCoinsAmount(0);
//     setTransactionReason('');
//     message.success(`${coinsAmount} coins deducted from player account`);
//   };

//   const getDeviceIcon = (deviceType) => {
//     switch(deviceType) {
//       case 'Android':
//         return <AndroidOutlined style={{ color: '#3DDC84' }} />;
//       case 'iOS':
//         return <AppleOutlined style={{ color: '#000000' }} />;
//       default:
//         return <DesktopOutlined />;
//     }
//   };

//   const transactionTypeColor = (type) => {
//     switch(type) {
//       case 'deposit':
//       case 'win':
//       case 'admin_add':
//         return 'green';
//       case 'withdrawal':
//       case 'game':
//       case 'admin_deduct':
//         return 'red';
//       default:
//         return 'blue';
//     }
//   };

//   return (
//     <Row>
//       <Col sm={12}>
//         <MainCard title="User Profiles" isOption={false}>
//           {/* Search Bar */}
//           <div className="mb-4">
//             <Input
//               placeholder="Search by name or ID..."
//               prefix={<SearchOutlined />}
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               allowClear
//             />
//           </div>

//           {/* Players Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full border border-gray-300">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="border px-4 py-2">Player</th>
//                   <th className="border px-4 py-2">ID</th>
//                   <th className="border px-4 py-2">Device</th>
//                   <th className="border px-4 py-2">Status</th>
//                   <th className="border px-4 py-2">Balance</th>
//                   <th className="border px-4 py-2">Bid Amount</th>
//                   <th className="border px-4 py-2">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentPlayers.length > 0 ? (
//                   currentPlayers.map((player) => (
//                     <tr key={player.id} className={player.status === 'suspended' ? 'bg-red-50' : ''}>
//                       <td className="border px-4 py-2">
//                         <button
//                           onClick={() => handleViewDetails(player)}
//                           className="text-blue-600 hover:text-blue-800 hover:underline"
//                         >
//                           {player.name}
//                         </button>
//                       </td>
//                       <td className="border px-4 py-2">{player.id}</td>
//                       <td className="border px-4 py-2 text-center">
//                         {getDeviceIcon(player.deviceType)}
//                       </td>
//                       <td className="border px-4 py-2">
//                         <span className={`px-2 py-1 rounded-full text-xs ${
//                           player.status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
//                         }`}>
//                           {player.status}
//                         </span>
//                       </td>
//                       <td className="border px-4 py-2">₹{player.currentMoney}</td>
//                       <td className="border px-4 py-2">₹{player.bidAmount}</td>
//                       <td className="border px-4 py-2">
//                         <div className="flex flex-wrap gap-2">
//                           <button
//                             onClick={() => handleEditClick(player)}
//                             className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 text-sm"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => togglePlayerStatus(player.id)}
//                             className={`px-3 py-1 rounded text-sm ${
//                               player.status === 'active' 
//                                 ? 'bg-red-100 text-red-800 hover:bg-red-200' 
//                                 : 'bg-green-100 text-green-800 hover:bg-green-200'
//                             }`}
//                           >
//                             {player.status === 'active' ? 'Suspend' : 'Activate'}
//                           </button>
//                           <button
//                             onClick={() => handleAddCoins(player)}
//                             className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm"
//                           >
//                             <PlusOutlined /> Add
//                           </button>
//                           <button
//                             onClick={() => handleDeductCoins(player)}
//                             className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
//                           >
//                             <MinusOutlined /> Deduct
//                           </button>
//                           <button
//                             onClick={() => handleDeleteAccount(player.id)}
//                             className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
//                           >
//                             <DeleteOutlined /> Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="border px-4 py-6 text-center text-gray-500">
//                       No players found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {filteredPlayers.length > playersPerPage && (
//             <div className="flex justify-center mt-4">
//               <nav className="inline-flex rounded-md shadow">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Previous
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                   <button
//                     key={number}
//                     onClick={() => setCurrentPage(number)}
//                     className={`px-3 py-1 border-t border-b border-gray-300 ${
//                       currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
//                     }`}
//                   >
//                     {number}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           )}

//           {/* Edit Player Modal */}
//           <Modal 
//             title={`Edit Player: ${currentPlayer?.name || ''}`} 
//             visible={showEditModal} 
//             onCancel={() => setShowEditModal(false)}
//             footer={[
//               <Button key="back" onClick={() => setShowEditModal(false)}>
//                 Cancel
//               </Button>,
//               <Button key="submit" type="primary" onClick={handleSaveChanges}>
//                 Save Changes
//               </Button>,
//             ]}
//             width={800}
//           >
//             {currentPlayer && (
//               <Form layout="vertical">
//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item label="Player Name">
//                       <Input
//                         name="name"
//                         value={currentPlayer.name}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item label="Email">
//                       <Input
//                         name="email"
//                         value={currentPlayer.email}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item label="Contact Number">
//                       <Input
//                         name="contactNumber"
//                         value={currentPlayer.contactNumber}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item label="Device Type">
//                       <Select
//                         value={currentPlayer.deviceType}
//                         onChange={(value) => setCurrentPlayer({...currentPlayer, deviceType: value})}
//                       >
//                         <Option value="Android">Android</Option>
//                         <Option value="iOS">iOS</Option>
//                         <Option value="Web">Web</Option>
//                       </Select>
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <Row gutter={16}>
//                   <Col span={12}>
//                     <Form.Item label="Status">
//                       <Select
//                         value={currentPlayer.status}
//                         onChange={(value) => setCurrentPlayer({...currentPlayer, status: value})}
//                       >
//                         <Option value="active">Active</Option>
//                         <Option value="suspended">Suspended</Option>
//                       </Select>
//                     </Form.Item>
//                   </Col>
//                   <Col span={12}>
//                     <Form.Item label="Bid Amount">
//                       <Input
//                         type="number"
//                         name="bidAmount"
//                         value={currentPlayer.bidAmount}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                 </Row>

//                 <h3 className="font-bold mt-4 mb-2">Financial Information</h3>
//                 <Row gutter={16}>
//                   <Col span={8}>
//                     <Form.Item label="Current Balance">
//                       <Input
//                         type="number"
//                         name="currentMoney"
//                         value={currentPlayer.currentMoney}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={8}>
//                     <Form.Item label="Total Earnings">
//                       <Input
//                         type="number"
//                         name="currentEarning"
//                         value={currentPlayer.currentEarning}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                   <Col span={8}>
//                     <Form.Item label="Referral Earnings">
//                       <Input
//                         type="number"
//                         name="referralEarning"
//                         value={currentPlayer.referralEarning}
//                         onChange={handleInputChange}
//                       />
//                     </Form.Item>
//                   </Col>
//                 </Row>
//               </Form>
//             )}
//           </Modal>

//           {/* Player Details Modal */}
//           <Modal 
//             title={`Player Details: ${currentPlayer?.name || ''}`} 
//             visible={showDetailsModal} 
//             onCancel={() => setShowDetailsModal(false)}
//             footer={null}
//             width={1000}
//           >
//             {currentPlayer && (
//               <Tabs defaultActiveKey="1">
//                 <TabPane tab="Overview" key="1">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-gray-50 p-4 rounded">
//                       <h3 className="font-bold mb-3">Basic Information</h3>
//                       <div className="space-y-2">
//                         <p><strong>Player ID:</strong> {currentPlayer.id}</p>
//                         <p><strong>Name:</strong> {currentPlayer.name}</p>
//                         <p><strong>Email:</strong> {currentPlayer.email}</p>
//                         <p><strong>Contact:</strong> {currentPlayer.contactNumber}</p>
//                         <p><strong>Country:</strong> {currentPlayer.country}</p>
//                         <p><strong>Device:</strong> {currentPlayer.deviceType} {getDeviceIcon(currentPlayer.deviceType)}</p>
//                         <p><strong>Status:</strong> 
//                           <Badge
//                             status={currentPlayer.status === 'active' ? 'success' : 'error'}
//                             text={currentPlayer.status}
//                             className="ml-2"
//                           />
//                         </p>
//                         <p><strong>Registered:</strong> {formatDate(currentPlayer.registrationDate)}</p>
//                         <p><strong>Last Active:</strong> {formatDate(currentPlayer.lastActive)}</p>
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded">
//                       <h3 className="font-bold mb-3">Game Statistics</h3>
//                       <div className="space-y-2">
//                         <p><strong>Total Games Played:</strong> {currentPlayer.totalGamesPlayed}</p>
//                         <p><strong>Total Wins:</strong> {currentPlayer.totalWins}</p>
//                         <p><strong>Total Losses:</strong> {currentPlayer.loss}</p>
//                         <p><strong>Win Rate:</strong> 
//                           <Badge
//                             count={currentPlayer.winRate}
//                             style={{ 
//                               backgroundColor: parseInt(currentPlayer.winRate) > 50 ? '#52c41a' : '#f5222d',
//                               marginLeft: '8px'
//                             }}
//                           />
//                         </p>
//                         <p><strong>2 Player Wins:</strong> {currentPlayer.twoPlayerWins}</p>
//                         <p><strong>4 Player Wins:</strong> {currentPlayer.fourPlayerWins}</p>
//                         <p><strong>Favorite Game:</strong> {currentPlayer.gameStatistics.favoriteGame}</p>
//                         <p><strong>Last Played:</strong> {formatDate(currentPlayer.gameStatistics.lastPlayed)}</p>
//                         <p><strong>Bid Amount:</strong> ₹{currentPlayer.bidAmount}</p>
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded">
//                       <h3 className="font-bold mb-3">Financial Information</h3>
//                       <div className="space-y-2">
//                         <p><strong>Current Balance:</strong> ₹{currentPlayer.currentMoney}</p>
//                         <p><strong>Total Earnings:</strong> ₹{currentPlayer.currentEarning}</p>
//                         <p><strong>Referral Earnings:</strong> ₹{currentPlayer.referralEarning}</p>
//                         <p><strong>Highest Win:</strong> ₹{currentPlayer.gameStatistics.highestWin}</p>
//                         <p><strong>Biggest Loss:</strong> ₹{currentPlayer.gameStatistics.biggestLoss}</p>
//                       </div>
//                     </div>

//                     <div className="bg-gray-50 p-4 rounded">
//                       <h3 className="font-bold mb-3">Activity Information</h3>
//                       <div className="space-y-2">
//                         <p><strong>Today's Play Time:</strong> {currentPlayer.dailyPlayTime.today}</p>
//                         <p><strong>Yesterday's Play Time:</strong> {currentPlayer.dailyPlayTime.yesterday}</p>
//                         <p><strong>Weekly Average Play Time:</strong> {currentPlayer.dailyPlayTime.weeklyAverage}</p>
//                         <p><strong>Total Play Time:</strong> {currentPlayer.playerTime}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </TabPane>

//                 <TabPane tab="Transaction History" key="2">
//                   <Table
//                     columns={[
//                       {
//                         title: 'Date',
//                         dataIndex: 'date',
//                         key: 'date',
//                         render: (date) => formatDate(date)
//                       },
//                       {
//                         title: 'Type',
//                         dataIndex: 'type',
//                         key: 'type',
//                         render: (type) => (
//                           <Tag color={transactionTypeColor(type)}>
//                             {type.toUpperCase()}
//                           </Tag>
//                         )
//                       },
//                       {
//                         title: 'Amount',
//                         dataIndex: 'amount',
//                         key: 'amount',
//                         render: (amount) => (
//                           <span style={{ color: amount >= 0 ? 'green' : 'red' }}>
//                             {amount >= 0 ? '+' : ''}{amount}
//                           </span>
//                         )
//                       },
//                       {
//                         title: 'Method',
//                         dataIndex: 'method',
//                         key: 'method',
//                         render: (method) => method || '-'
//                       },
//                       {
//                         title: 'Status',
//                         dataIndex: 'status',
//                         key: 'status',
//                         render: (status) => (
//                           <Badge
//                             status={
//                               status === 'completed' ? 'success' : 
//                               status === 'failed' ? 'error' : 'processing'
//                             }
//                             text={status}
//                           />
//                         )
//                       },
//                       {
//                         title: 'Description',
//                         dataIndex: 'description',
//                         key: 'description'
//                       }
//                     ]}
//                     dataSource={currentPlayer.transactionHistory}
//                     pagination={{ pageSize: 5 }}
//                     rowKey="id"
//                   />
//                 </TabPane>
//               </Tabs>
//             )}
//           </Modal>

//           {/* Add Coins Modal */}
//           <Modal
//             title={`Add Coins to ${currentPlayer?.name || ''}`}
//             visible={showAddCoinsModal}
//             onCancel={() => {
//               setShowAddCoinsModal(false);
//               setCoinsAmount(0);
//               setTransactionReason('');
//             }}
//             onOk={confirmAddCoins}
//           >
//             <Form layout="vertical">
//               <Form.Item label="Amount to Add">
//                 <Input
//                   type="number"
//                   value={coinsAmount}
//                   onChange={(e) => setCoinsAmount(e.target.value)}
//                   placeholder="Enter amount"
//                 />
//               </Form.Item>
//               <Form.Item label="Reason (Optional)">
//                 <Input.TextArea
//                   value={transactionReason}
//                   onChange={(e) => setTransactionReason(e.target.value)}
//                   placeholder="Enter reason for adding coins"
//                   rows={3}
//                 />
//               </Form.Item>
//             </Form>
//           </Modal>

//           {/* Deduct Coins Modal */}
//           <Modal
//             title={`Deduct Coins from ${currentPlayer?.name || ''}`}
//             visible={showDeductCoinsModal}
//             onCancel={() => {
//               setShowDeductCoinsModal(false);
//               setCoinsAmount(0);
//               setTransactionReason('');
//             }}
//             onOk={confirmDeductCoins}
//           >
//             <Form layout="vertical">
//               <Form.Item label="Amount to Deduct">
//                 <Input
//                   type="number"
//                   value={coinsAmount}
//                   onChange={(e) => setCoinsAmount(e.target.value)}
//                   placeholder="Enter amount"
//                 />
//               </Form.Item>
//               <Form.Item label="Current Balance">
//                 <Input
//                   value={currentPlayer?.currentMoney || 0}
//                   disabled
//                 />
//               </Form.Item>
//               <Form.Item label="Reason (Optional)">
//                 <Input.TextArea
//                   value={transactionReason}
//                   onChange={(e) => setTransactionReason(e.target.value)}
//                   placeholder="Enter reason for deducting coins"
//                   rows={3}
//                 />
//               </Form.Item>
//             </Form>
//           </Modal>
//         </MainCard>
//       </Col>
//     </Row>
//   );
// };

// export default UserProfile;