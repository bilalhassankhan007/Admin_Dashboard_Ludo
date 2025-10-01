// src/utils/dashboardUtils.js
const INDIAN_NAMES = [
  'Aarav',
  'Vihaan',
  'Advait',
  'Dhruv',
  'Kabir',
  'Ananya',
  'Diya',
  'Aaradhya',
  'Ishaan',
  'Reyansh',
  'Kavya',
  'Parth',
  'Arjun',
  'Ayaan',
  'Myra'
];

const GAME_TYPES = ['Classic', 'Quick', 'Tournament', 'Cash', 'Team', 'Royal'];

export const generateMockData = () => {
  const players = Array.from({ length: 150 }, (_, i) => ({
    id: `PL${1000 + i}`,
    name: `${INDIAN_NAMES[i % INDIAN_NAMES.length]}${Math.floor(i / INDIAN_NAMES.length) || ''}`,
    device: Math.random() > 0.7 ? 'iOS' : 'Android',
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)),
    walletBalance: Math.floor(Math.random() * 10000) + 500,
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'][Math.floor(Math.random() * 5)]
  }));

  const matches = Array.from({ length: 500 }, () => {
    const playerCount = Math.random() > 0.8 ? 4 : 2;
    const playersInMatch = [];
    for (let i = 0; i < playerCount; i++) {
      playersInMatch.push(players[Math.floor(Math.random() * players.length)].name);
    }

    const bidAmount = [10, 20, 50, 100, 200, 500][Math.floor(Math.random() * 6)];
    return {
      id: `MT${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      players: playersInMatch,
      winner: playersInMatch[Math.floor(Math.random() * playerCount)],
      bidAmount,
      gameType: GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)],
      duration: Math.floor(Math.random() * 20) + 5
    };
  });

  return { players, matches };
};

export const generateFinancialData = () => ({
  totalEarnings: Math.floor(Math.random() * 500000) + 100000,
  pendingWithdrawals: Math.floor(Math.random() * 50000) + 10000,
  netProfit: Math.floor(Math.random() * 300000) + 50000,
  dailyRevenue: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
    amount: Math.floor(Math.random() * 20000) + 5000
  }))
});

export const generateFraudData = () =>
  Array.from({ length: 5 }, (_, i) => ({
    id: `F${100 + i}`,
    player: `Player ${Math.floor(Math.random() * 100) + 1}`,
    reason: ['Multiple accounts', 'Unusual win pattern', 'Payment fraud'][Math.floor(Math.random() * 3)],
    detected: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  }));

export const generateWithdrawalData = () =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `W${200 + i}`,
    player: `Player ${Math.floor(Math.random() * 100) + 1}`,
    amount: Math.floor(Math.random() * 5000) + 500,
    method: ['Bank Transfer', 'UPI', 'Paytm'][Math.floor(Math.random() * 3)],
    status: ['Pending', 'Processing', 'Completed'][Math.floor(Math.random() * 3)]
  }));

export const generateVersionStats = () => ({
  currentVersion: '1.5.2',
  crashes: Math.floor(Math.random() * 50),
  activePlayers: Math.floor(Math.random() * 5000) + 10000,
  avgSession: `${(Math.random() * 5 + 5).toFixed(1)} mins`
});

export const calculatePlayerStats = (matches, players) =>
  players.map((player) => {
    const playerMatches = matches.filter((m) => m.players.includes(player.name));
    const wins = playerMatches.filter((m) => m.winner === player.name).length;

    return {
      ...player,
      totalMatches: playerMatches.length,
      wins,
      losses: playerMatches.length - wins,
      winRate: playerMatches.length > 0 ? Math.round((wins / playerMatches.length) * 100) : 0,
      totalEarnings: playerMatches.reduce((sum, match) => (match.winner === player.name ? sum + match.bidAmount : sum), 0),
      avgBid:
        playerMatches.length > 0 ? Math.round(playerMatches.reduce((sum, match) => sum + match.bidAmount, 0) / playerMatches.length) : 0
    };
  });

export const calculateFinancialData = (matches) => {
  const totalEarnings = matches.reduce((sum, match) => sum + match.bidAmount, 0);
  const dailyRevenue = matches.reduce((acc, match) => {
    const dateStr = new Date(match.date).toISOString().split('T')[0];
    acc[dateStr] = (acc[dateStr] || 0) + match.bidAmount;
    return acc;
  }, {});

  return {
    totalEarnings,
    dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount }))
  };
};

export const calculateWinLossData = (matches) => {
  const dailyData = matches.reduce((acc, match) => {
    const dateStr = new Date(match.date).toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = { wins: 0, losses: 0 };
    if (match.players.length === 2) {
      acc[dateStr].wins++;
      acc[dateStr].losses++;
    }
    return acc;
  }, {});

  return {
    wins: Object.entries(dailyData).map(([date, { wins }]) => ({ date, value: wins })),
    losses: Object.entries(dailyData).map(([date, { losses }]) => ({ date, value: losses }))
  };
};

export const calculateBidDistribution = (matches) => {
  const ranges = [
    { min: 0, max: 100, count: 0 },
    { min: 101, max: 500, count: 0 },
    { min: 501, max: 1000, count: 0 },
    { min: 1001, max: Infinity, count: 0 }
  ];

  matches.forEach((match) => {
    const range = ranges.find((r) => match.bidAmount >= r.min && match.bidAmount <= r.max);
    if (range) range.count++;
  });

  return ranges.map((range) => ({
    range: range.max === Infinity ? `${range.min}+` : `${range.min}-${range.max}`,
    count: range.count
  }));
};

export const getTopPlayers = (playerStats) => [...playerStats].sort((a, b) => b.totalEarnings - a.totalEarnings).slice(0, 10);

export const segmentPlayers = (playerStats) => [
  {
    name: 'High Rollers',
    count: playerStats.filter((p) => p.avgBid > 500).length,
    criteria: 'Bid > ₹500'
  },
  {
    name: 'Frequent Players',
    count: playerStats.filter((p) => p.totalMatches > 20).length,
    criteria: '>20 games'
  }
];

export const getPlatformDistribution = (players) => {
  const androidCount = players.filter((p) => p.device === 'Android').length;
  const iosCount = players.filter((p) => p.device === 'iOS').length;
  const total = players.length;

  return [
    { platform: 'Android', share: `${Math.round((androidCount / total) * 100)}%` },
    { platform: 'iOS', share: `${Math.round((iosCount / total) * 100)}%` }
  ];
};

export const getDailyMetrics = (matches) => {
  const uniquePlayers = new Set();
  matches.forEach((match) => match.players.forEach((player) => uniquePlayers.add(player)));

  return {
    newPlayers: Math.floor(Math.random() * 50) + 50,
    totalMatches: matches.length,
    totalBidAmount: matches.reduce((sum, match) => sum + match.bidAmount, 0),
    activePlayers: uniquePlayers.size
  };
};
