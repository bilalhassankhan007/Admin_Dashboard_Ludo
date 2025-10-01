import React, { useState } from 'react';
import { Row, Col, Button, ButtonGroup, Alert } from 'react-bootstrap';
import { useDashboardData } from '../../data/useDashboardData';
import DataTable from '../../components/ui/DataTable';
import KPICard from '../../components/ui/KPICard';
import PlayerStatsCard from '../../components/ui/PlayerStatsCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { FaSync, FaCalendarAlt } from 'react-icons/fa';


const DashboardPage = () => {
  const [dateRange, setDateRange] = useState('week');
  const { 
    playerStats,
    dailyMetrics,
    financialData,
    loading,
    error,
    refreshData
  } = useDashboardData(dateRange);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <Alert variant="danger" className="m-4">
      Error loading dashboard data: {error.message}
    </Alert>
  );

  return (
    <div className="dashboard-container p-4">
      {/* Header with Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ludo Game Dashboard</h2>
        <div className="d-flex gap-3">
          <ButtonGroup size="sm">
            <Button 
              variant={dateRange === 'day' ? 'primary' : 'outline-secondary'}
              onClick={() => setDateRange('day')}
            >
              Today
            </Button>
            <Button 
              variant={dateRange === 'week' ? 'primary' : 'outline-secondary'}
              onClick={() => setDateRange('week')}
            >
              This Week
            </Button>
            <Button 
              variant={dateRange === 'month' ? 'primary' : 'outline-secondary'}
              onClick={() => setDateRange('month')}
            >
              This Month
            </Button>
          </ButtonGroup>
          
          <Button 
            variant="outline-primary" 
            onClick={refreshData}
            disabled={loading}
          >
            <FaSync className={loading ? 'spin' : ''} /> 
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <KPICard
            title="Active Players"
            value={dailyMetrics.activePlayers}
            icon="users"
            trend="up"
            description={`${dateRange}ly active`}
          />
        </Col>
        <Col md={6} lg={3}>
          <KPICard
            title="Total Revenue"
            value={`₹${financialData.totalEarnings.toLocaleString('en-IN')}`}
            icon="revenue"
            trend={financialData.netProfit > 0 ? 'up' : 'down'}
            description={`${dateRange}ly earnings`}
          />
        </Col>
        <Col md={6} lg={3}>
          <KPICard
            title="Games Played"
            value={dailyMetrics.totalMatches}
            icon="games"
            trend="up"
            description={`${dateRange}ly matches`}
          />
        </Col>
        <Col md={6} lg={3}>
          <KPICard
            title="Avg. Session"
            value={playerStats.avgSession || '25 mins'}
            icon="chart"
            trend="steady"
            description="Player engagement"
          />
        </Col>
      </Row>

      {/* Player Stats Section */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <PlayerStatsCard
            player={playerStats.topPlayers[0]?.name || 'Top Player'}
            matchesPlayed={playerStats.topPlayers[0]?.totalMatches || 0}
            winRate={playerStats.topPlayers[0]?.winRate || 0}
            totalEarnings={playerStats.topPlayers[0]?.totalEarnings || 0}
          />
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Top Players</h5>
                <small className="text-muted">
                  <FaCalendarAlt className="me-1" />
                  {dateRange}ly performance
                </small>
              </div>
              <DataTable
                data={playerStats.topPlayers.slice(0, 5)}
                columns={[
                  { field: 'name', header: 'Player' },
                  { field: 'winRate', header: 'Win Rate', format: (value) => `${value}%` },
                  { field: 'totalEarnings', header: 'Earnings', format: (value) => `₹${value.toLocaleString('en-IN')}` }
                ]}
                keyField="id"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;