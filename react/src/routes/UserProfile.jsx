import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MainCard from '../components/Card/MainCard';

const UserProfile = () => {
  const players = [
    {
      id: 'P001',
      name: 'Shashank',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      totalWins: 5,
      loss: 3,
      twoPlayerWins: 2,
      fourPlayerWins: 3,
      currentEarning: 1500,
      currentMoney: 1200,
      winRate: '62.5%',
      referralEarning: 200,
      playerTime: '3h 45m',
      transactionHistory: {
        amountWin: 3000,
        amountLoss: 1500,
        withdrawAmount: 1300
      }
    },
    {
      id: 'P002',
      name: 'Rahul',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      totalWins: 8,
      loss: 2,
      twoPlayerWins: 3,
      fourPlayerWins: 5,
      currentEarning: 2200,
      currentMoney: 1800,
      winRate: '80%',
      referralEarning: 350,
      playerTime: '5h 20m',
      transactionHistory: {
        amountWin: 4000,
        amountLoss: 1000,
        withdrawAmount: 2000
      }
    }
  ];

  return (
    <Row>
      <Col sm={12}>
        <MainCard title="User Profiles" isOption={false}>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Player</th>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Wins</th>
                  <th className="border px-4 py-2">Losses</th>
                  <th className="border px-4 py-2">Win Rate</th>
                  <th className="border px-4 py-2">Current Balance</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="border px-4 py-2">
                      <Link 
                        to={`/user-profile/${player.id}`} 
                        state={{ user: player }}
                        className="flex items-center hover:text-blue-600"
                      >
                        <img 
                          src={player.avatar} 
                          alt={player.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        {player.name}
                      </Link>
                    </td>
                    <td className="border px-4 py-2">{player.id}</td>
                    <td className="border px-4 py-2">{player.totalWins}</td>
                    <td className="border px-4 py-2">{player.loss}</td>
                    <td className="border px-4 py-2">{player.winRate}</td>
                    <td className="border px-4 py-2">₹{player.currentMoney}</td>
                    <td className="border px-4 py-2">
                      <Link
                        to={`/user-profile/${player.id}`}
                        state={{ user: player }}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MainCard>
      </Col>
    </Row>
  );
};

export default UserProfile;