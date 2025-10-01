import { Row, Col } from 'react-bootstrap';
import MainCard from '../../components/Card/MainCard';

const Wallet = () => {
  // Sample wallet data
  const walletData = {
    balance: 2500,
    transactions: [
      { id: 1, type: 'deposit', amount: 1000, date: '2023-06-01' },
      { id: 2, type: 'win', amount: 500, date: '2023-06-05' },
      { id: 3, type: 'withdrawal', amount: -300, date: '2023-06-10' },
    ],
    paymentMethods: [
      { id: 1, type: 'PayPal', last4: '4321' },
      { id: 2, type: 'Credit Card', last4: '8765' }
    ]
  };

  return (
    <Row>
      <Col sm={12}>
        <MainCard title="Wallet Balance" isOption={false}>
          <div className="space-y-6">
            {/* Balance Summary */}
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="text-xl font-bold">Current Balance</h3>
              <p className="text-3xl mt-2">₹{walletData.balance.toLocaleString()}</p>
            </div>

            {/* Recent Transactions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Type</th>
                      <th className="border px-4 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.transactions.map(tx => (
                      <tr key={tx.id}>
                        <td className="border px-4 py-2">{tx.date}</td>
                        <td className="border px-4 py-2 capitalize">{tx.type}</td>
                        <td className={`border px-4 py-2 ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {walletData.paymentMethods.map(method => (
                  <div key={method.id} className="border p-4 rounded">
                    <p className="font-medium">{method.type}</p>
                    <p className="text-gray-600">•••• •••• •••• {method.last4}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MainCard>
      </Col>
    </Row>
  );
};

export default Wallet;