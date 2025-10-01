// src/components/data/useDashboardData.js
import { useState, useEffect, useMemo } from 'react';
import {
  generateMockData,
  generateFinancialData,
  generateFraudData,
  generateWithdrawalData,
  generateVersionStats,
  calculatePlayerStats,
  calculateFinancialData,
  calculateWinLossData,
  calculateBidDistribution,
  getTopPlayers,
  segmentPlayers,
  getPlatformDistribution,
  getDailyMetrics
} from '../../utils/dashboardUtils';
import { filterDataByDateRange, filterByPlayer, filterByAmount } from '../../utils/filters';

export const useDashboardData = (dateRange, filters = {}) => {
  const [loading, setLoading] = useState(true);
  const { players, matches } = useMemo(() => generateMockData(), []);
  const [allData, setAllData] = useState({
    players,
    matches,
    financialData: generateFinancialData(),
    fraudData: generateFraudData(),
    withdrawals: generateWithdrawalData(),
    versionStats: generateVersionStats()
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [dateRange, filters]);

  const filteredData = useMemo(() => {
    const { player, amountRange, date } = filters;
    let filteredMatches = [...allData.matches];

    filteredMatches = filterDataByDateRange(filteredMatches, dateRange);
    if (player) filteredMatches = filterByPlayer(filteredMatches, player);
    if (amountRange) filteredMatches = filterByAmount(filteredMatches, amountRange[0], amountRange[1]);
    if (date) filteredMatches = filteredMatches.filter((match) => new Date(match.date).toDateString() === new Date(date).toDateString());

    const playerStats = calculatePlayerStats(filteredMatches, allData.players);

    return {
      playerStats,
      matchHistory: filteredMatches,
      financialData: calculateFinancialData(filteredMatches),
      winLossData: calculateWinLossData(filteredMatches),
      bidDistribution: calculateBidDistribution(filteredMatches),
      topPlayers: getTopPlayers(playerStats),
      fraudAlerts: allData.fraudData,
      pendingWithdrawals: allData.withdrawals,
      versionStats: allData.versionStats,
      playerSegments: segmentPlayers(playerStats),
      platformData: getPlatformDistribution(allData.players),
      dailyMetrics: getDailyMetrics(filteredMatches)
    };
  }, [allData, dateRange, filters]);

  return {
    ...filteredData,
    loading,
    refreshData: () => {
      setLoading(true);
      setTimeout(() => {
        const newData = generateMockData();
        setAllData({
          players: newData.players,
          matches: newData.matches,
          financialData: generateFinancialData(),
          fraudData: generateFraudData(),
          withdrawals: generateWithdrawalData(),
          versionStats: generateVersionStats()
        });
        setLoading(false);
      }, 1000);
    }
  };
};
