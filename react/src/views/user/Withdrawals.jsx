import React from 'react';

const WithdrawalHistory = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-4">Withdrawal History</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">2025-08-01</td>
            <td className="border p-2">₹500</td>
            <td className="border p-2">Completed</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WithdrawalHistory; 
