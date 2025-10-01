import React from 'react';
import { Link } from 'react-router-dom';

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">Player Name</th>
            <th className="p-3">Coins</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-t" key={user.id}>
              <td className="p-3">
                <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">
                  {user.name}
                </Link>
              </td>
              <td className="p-3">{user.coins}</td>
              <td className="p-3">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
