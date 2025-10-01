import { useState } from 'react';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import MainCard from '../components/Card/MainCard';

const Withdrawl = () => {
  // Initial player data with withdrawal requests
  const initialPlayersData = [
    { 
      id: 'P001', 
      name: 'Shashank', 
      wins: 5, 
      loss: 3, 
      twoPlayerWins: 2, 
      fourPlayerWins: 3, 
      winningMoney: 1500, 
      walletMoney: 1200, 
      requestedAmount: 1000,
      winRate: '62.5%', 
      referralEarning: 200,
      status: 'pending'
    },
    { 
      id: 'P002', 
      name: 'Amit', 
      wins: 3, 
      loss: 2, 
      twoPlayerWins: 1, 
      fourPlayerWins: 2, 
      winningMoney: 800, 
      walletMoney: 600,
      requestedAmount: 500,
      winRate: '60%', 
      referralEarning: 100,
      status: 'pending'
    },
    { 
      id: 'P003', 
      name: 'Neha', 
      wins: 7, 
      loss: 1, 
      twoPlayerWins: 3, 
      fourPlayerWins: 4, 
      winningMoney: 2500, 
      walletMoney: 2000,
      requestedAmount: 1500,
      winRate: '87.5%', 
      referralEarning: 300,
      status: 'pending'
    },
    { 
      id: 'P004', 
      name: 'Rahul', 
      wins: 2, 
      loss: 5, 
      twoPlayerWins: 1, 
      fourPlayerWins: 1, 
      winningMoney: 500, 
      walletMoney: 300,
      requestedAmount: 200,
      winRate: '28.6%', 
      referralEarning: 50,
      status: 'pending'
    }
  ];

  const [playersData, setPlayersData] = useState(initialPlayersData);

  const handleApprove = (playerId) => {
    setPlayersData(prevData => 
      prevData.map(player => 
        player.id === playerId 
          ? { ...player, status: 'approved', walletMoney: player.walletMoney - player.requestedAmount } 
          : player
      )
    );
    // Here you would typically also make an API call to update the backend
    console.log(`Approved withdrawal for player ${playerId}`);
  };

  const handleReject = (playerId) => {
    setPlayersData(prevData => 
      prevData.map(player => 
        player.id === playerId 
          ? { ...player, status: 'rejected' } 
          : player
      )
    );
    // Here you would typically also make an API call to update the backend
    console.log(`Rejected withdrawal for player ${playerId}`);
  };

  return (
    <Row>
      <Col sm={12}>
        {/* <MainCard title="Withdrawal Requests" isOption={false}>
          <Row className="gy-4">
            <Col md={12}>
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold mb-4">Players Withdrawal Requests</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr className="p-3 color-block bg-blue-100">
                        <th className="border px-4 py-2">S.No</th>
                        <th className="border px-4 py-2">Player ID</th>
                        <th className="border px-4 py-2">Player Name</th>
                        <th className="border px-4 py-2">Total Wins</th>
                        <th className="border px-4 py-2">Total Loss</th>
                        <th className="border px-4 py-2">2 Player Win</th>
                        <th className="border px-4 py-2">4 Players Win</th>
                        <th className="border px-4 py-2">Winning Money</th>
                        <th className="border px-4 py-2">Wallet Money</th>
                        <th className="border px-4 py-2">Requested Amount</th>
                        <th className="border px-4 py-2">Win Rate</th>
                        <th className="border px-4 py-2">Referral Earning</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playersData.map((player, index) => (
                        <tr key={player.id} className="text-center hover:bg-gray-50">
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{player.id}</td>
                          <td className="border px-4 py-2 font-medium">{player.name}</td>
                          <td className="border px-4 py-2 text-green-600">{player.wins}</td>
                          <td className="border px-4 py-2 text-red-600">{player.loss}</td>
                          <td className="border px-4 py-2">{player.twoPlayerWins}</td>
                          <td className="border px-4 py-2">{player.fourPlayerWins}</td>
                          <td className="border px-4 py-2 font-medium">₹{player.winningMoney}</td>
                          <td className="border px-4 py-2 font-medium">₹{player.walletMoney}</td>
                          <td className="border px-4 py-2 font-bold text-blue-600">₹{player.requestedAmount}</td>
                          <td className="border px-4 py-2">{player.winRate}</td>
                          <td className="border px-4 py-2">₹{player.referralEarning}</td>
                          <td className="border px-4 py-2">
                            <Badge 
                              bg={
                                player.status === 'approved' ? 'success' : 
                                player.status === 'rejected' ? 'danger' : 'warning'
                              }
                            >
                              {player.status}
                            </Badge>
                          </td>
                          <td className="border px-4 py-2">
                            <div className="flex justify-center gap-2">
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleApprove(player.id)}
                                disabled={player.status !== 'pending'}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm"
                                onClick={() => handleReject(player.id)}
                                disabled={player.status !== 'pending'}
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        </MainCard> */}
      </Col>
    </Row>
  );
};

export default Withdrawl;