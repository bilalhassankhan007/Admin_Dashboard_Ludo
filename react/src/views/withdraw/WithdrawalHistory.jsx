// // src/views/withdraw/WithdrawalHistory.jsx
// import React from 'react';
// import { motion } from 'framer-motion';

// const formatDate = (dateStr) => {
//   const options = { day: '2-digit', month: 'short', year: 'numeric' };
//   return new Date(dateStr).toLocaleDateString('en-GB', options).replace(',', '');
// };

// const withdrawals = [
//   { id: 'WD001', amount: 2500, date: '2025-08-05', status: 'Approved' },
//   { id: 'WD002', amount: 1000, date: '2025-08-06', status: 'Pending' },
//   { id: 'WD003', amount: 1500, date: '2025-08-07', status: 'Rejected' },
// ];

// const WithdrawalHistory = () => {
//   return (
//     <motion.div
//       className="p-6"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Withdrawal History</h2>

//       <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-blue-600 text-white">
//               <th className="py-3 px-5 text-left text-sm font-semibold uppercase tracking-wider border-b border-blue-700">
//                 Player ID
//               </th>
//               <th className="py-3 px-5 text-left text-sm font-semibold uppercase tracking-wider border-b border-blue-700">
//                 Amount
//               </th>
//               <th className="py-3 px-5 text-left text-sm font-semibold uppercase tracking-wider border-b border-blue-700">
//                 Date
//               </th>
//               <th className="py-3 px-5 text-left text-sm font-semibold uppercase tracking-wider border-b border-blue-700">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {withdrawals.map((withdraw) => (
//               <tr key={withdraw.id} className="hover:bg-gray-50 transition-colors">
//                 <td className="py-4 px-5 text-sm text-gray-700">
//                   {withdraw.id}
//                 </td>
//                 <td className="py-4 px-5 text-sm text-gray-700">
//                   ₹{withdraw.amount.toLocaleString()}
//                 </td>
//                 <td className="py-4 px-5 text-sm text-gray-700">
//                   {formatDate(withdraw.date)}
//                 </td>
//                 <td className="py-4 px-5">
//                   <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                     withdraw.status === 'Approved' ? 'bg-green-100 text-green-800' :
//                     withdraw.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {withdraw.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </motion.div>
//   );
// };

// export default WithdrawalHistory;