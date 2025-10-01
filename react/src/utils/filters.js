// src/utils/filters.js
export const filterDataByDateRange = (data, range) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return data;
  }

  return data.filter((item) => new Date(item.date) >= startDate);
};

export const filterByPlayer = (data, playerName) =>
  data.filter(
    (item) =>
      item.players.some((player) => player.toLowerCase().includes(playerName.toLowerCase())) ||
      item.winner.toLowerCase().includes(playerName.toLowerCase())
  );

export const filterByAmount = (data, min, max) => data.filter((item) => item.bidAmount >= min && item.bidAmount <= max);
