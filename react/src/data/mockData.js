// Sample mock data structure
const MockData = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' }
    // ... more users
  ],
  transactions: [
    { id: 1, userId: 1, amount: 100, date: '2023-01-01', status: 'completed' }
    // ... more transactions
  ]
  // ... other data entities
};

export const generateMockData = (count = 50) => {
  // Function to generate dynamic mock data
  return {
    users: Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: i % 3 === 0 ? 'admin' : 'user'
    }))
    // ... other generated data
  };
};

export default MockData;
