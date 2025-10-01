// import React, { useState, useEffect } from 'react';
// import { Table, Pagination, Spinner, Form } from 'react-bootstrap';

// const GameHistory = () => {
//   const [games, setGames] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [gamesPerPage] = useState(5);
//   const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

//   // Mock API call - replace with actual API call
//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         setLoading(true);
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Mock data - replace with actual API response
//         const mockData = [
//           { id: 1, date: '2025-08-10', game: 'Ludo', status: 'Completed', result: 'Win' },
//           { id: 2, date: '2025-08-09', game: 'Chess', status: 'Completed', result: 'Loss' },
//           { id: 3, date: '2025-08-08', game: 'Ludo', status: 'Completed', result: 'Win' },
//           { id: 4, date: '2025-08-07', game: 'Snakes & Ladders', status: 'Abandoned', result: 'N/A' },
//           { id: 5, date: '2025-08-06', game: 'Chess', status: 'Completed', result: 'Win' },
//           { id: 6, date: '2025-08-05', game: 'Ludo', status: 'Completed', result: 'Loss' },
//           { id: 7, date: '2025-08-04', game: 'Snakes & Ladders', status: 'Completed', result: 'Win' },
//         ];
        
//         setGames(mockData);
//       } catch (error) {
//         console.error('Error fetching game history:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGames();
//   }, []);

//   // Sorting functionality
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const sortedGames = [...games].sort((a, b) => {
//     if (a[sortConfig.key] < b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? -1 : 1;
//     }
//     if (a[sortConfig.key] > b[sortConfig.key]) {
//       return sortConfig.direction === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   // Pagination logic
//   const indexOfLastGame = currentPage * gamesPerPage;
//   const indexOfFirstGame = indexOfLastGame - gamesPerPage;
//   const currentGames = sortedGames.slice(indexOfFirstGame, indexOfLastGame);
//   const totalPages = Math.ceil(games.length / gamesPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Render sort direction indicator
//   const renderSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === 'asc' ? '↑' : '↓';
//   };

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md m-5 p-5">
//       <h2 className="text-2xl font-bold mb-4">Game History</h2>
      
//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//           <p>Loading game history...</p>
//         </div>
//       ) : (
//         <>
//           <Table striped bordered hover responsive className="min-w-full border">
//             <thead>
//               <tr>
//                 <th 
//                   className="border p-2 cursor-pointer"
//                   onClick={() => requestSort('date')}
//                 >
//                   Date {renderSortIcon('date')}
//                 </th>
//                 <th 
//                   className="border p-2 cursor-pointer"
//                   onClick={() => requestSort('game')}
//                 >
//                   Game {renderSortIcon('game')}
//                 </th>
//                 <th 
//                   className="border p-2 cursor-pointer"
//                   onClick={() => requestSort('status')}
//                 >
//                   Status {renderSortIcon('status')}
//                 </th>
//                 <th 
//                   className="border p-2 cursor-pointer"
//                   onClick={() => requestSort('result')}
//                 >
//                   Win/Loss {renderSortIcon('result')}
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentGames.length > 0 ? (
//                 currentGames.map((game) => (
//                   <tr key={game.id}>
//                     <td className="border p-2">{game.date}</td>
//                     <td className="border p-2">{game.game}</td>
//                     <td className="border p-2">{game.status}</td>
//                     <td className={`border p-2 ${
//                       game.result === 'Win' ? 'text-green-500' : 
//                       game.result === 'Loss' ? 'text-red-500' : 'text-gray-500'
//                     }`}>
//                       {game.result}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="text-center py-4">No game history found</td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>

//           {games.length > gamesPerPage && (
//             <div className="flex justify-center mt-4">
//               <Pagination>
//                 <Pagination.Prev 
//                   onClick={() => paginate(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                 />
//                 {[...Array(totalPages).keys()].map(number => (
//                   <Pagination.Item
//                     key={number + 1}
//                     active={number + 1 === currentPage}
//                     onClick={() => paginate(number + 1)}
//                   >
//                     {number + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next 
//                   onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                 />
//               </Pagination>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default GameHistory;