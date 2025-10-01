// react-bootstrap
import { Row, Col } from 'react-bootstrap';

// project imports
import MainCard from '../../../components/Card/MainCard';

// -----------------------|| BASIC TYPOGRAPHY ||-----------------------//

export default function BasicColor() {
  const playersData = [
    { id: 'P001', name: 'Shashank', wins: 5 },
    { id: 'P002', name: 'Amit', wins: 3 },
    { id: 'P003', name: 'Neha', wins: 7 },
    { id: 'P004', name: 'Rahul', wins: 2 }
  ];
  return (
    <Row>
      <Col sm={12}>
        <MainCard title="Players Details" isOption={false}>
          <Row className="gy-4">
            <Col md={4}>
              <div className="">
                <h2 className="text-xl font-bold mb-4">Players  Details </h2>
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="p-3 color-block bg-blue-100">
                      <th className="border px-4 py-2">#</th>
                      <th className="border px-4 py-2">Player ID</th>
                      <th className="border px-4 py-2">Player Name</th>
                      <th className="border px-4 py-2">Total Wins</th>
                      <th className="border px-4 py-2">Loss</th>
                      <th className="border px-4 py-2">2 Player Win</th>
                      <th className="border px-4 py-2">4 Player Win</th>
                      <th className="border px-4 py-2">Current Earning</th>
                      <th className="border px-4 py-2">Current Money</th>
                      <th className="border px-4 py-2">Win Rate</th>
                      <th className="border px-4 py-2">Referral Earning</th>
                      {/* <th className="border px-4 py-2"></th>
                      <th className="border px-4 py-2">Wins</th>
                      <th className="border px-4 py-2">Wins</th>
                      <th className="border px-4 py-2">Wins</th>
                      <th className="border px-4 py-2">Wins</th>
                      <th className="border px-4 py-2">Wins</th>
                      <th className="border px-4 py-2">Wins</th>
                      <th className="border px-4 py-2">Wins</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {playersData.map((player, index) => (
                      <tr key={player.id} className="text-center">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{player.id}</td>
                        <td className="border px-4 py-2">{player.name}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        {/* <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td>
                        <td className="border px-4 py-2">{player.wins}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </MainCard>
      </Col>

    </Row>
  );
}
