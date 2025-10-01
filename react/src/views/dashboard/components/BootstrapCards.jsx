import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  FaRupeeSign, 
  FaArrowUp, 
  FaArrowDown,
  FaMoneyBillWave,
  FaChartLine,
  FaPiggyBank,
  FaHourglassHalf
} from 'react-icons/fa';

const BootstrapCards = ({ 
  financialData = {
    totalEarnings: 0,
    netProfit: 0,
    totalLoss: 0,
    pendingWithdrawals: 0,
    monthlyEarnings: 0,
    monthlyProfit: 0,
    monthlyLoss: 0,
    weeklyEarnings: 0,
    weeklyProfit: 0,
    weeklyLoss: 0
  }, 
  timeRange = 'sinceLaunch' 
}) => {
  // Format currency with Indian Rupee symbol
  const formatCurrency = (amount) => {
    return (
      <span className="d-flex align-items-center">
        <FaRupeeSign className="me-1" />
        {amount?.toLocaleString('en-IN') || '0'}
      </span>
    );
  };

  // Get data based on selected time range
  const getDynamicData = () => {
    const dataMap = {
      monthly: {
        earnings: financialData.monthlyEarnings,
        profit: financialData.monthlyProfit,
        loss: financialData.monthlyLoss
      },
      weekly: {
        earnings: financialData.weeklyEarnings,
        profit: financialData.weeklyProfit,
        loss: financialData.weeklyLoss
      },
      sinceLaunch: {
        earnings: financialData.totalEarnings,
        profit: financialData.netProfit,
        loss: financialData.totalLoss
      }
    };

    const rangeData = dataMap[timeRange] || dataMap.sinceLaunch;

    return {
      totalEarnings: rangeData.earnings || 0,
      netProfit: rangeData.profit || 0,
      totalLoss: rangeData.loss || 0,
      pendingWithdrawals: financialData.pendingWithdrawals || 0
    };
  };

  const dynamicData = getDynamicData();

  // Card styling
  const cardStyle = {
    borderRadius: '12px',
    backgroundColor: '#7FFFD4',
    color: '#000000',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
    minHeight: '180px'
  };

  const iconStyle = {
    fontSize: '24px',
    marginRight: '8px'
  };

  // Time range label
  const getTimeRangeLabel = () => {
    switch(timeRange) {
      case 'monthly': return 'Monthly';
      case 'weekly': return 'Weekly';
      default: return 'Since Launch';
    }
  };

  return (
    <>
      {/* Total Revenue Card */}
      <Col md={6} lg={3} className="mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Card style={cardStyle}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  <FaMoneyBillWave style={iconStyle} />
                  Total Revenue
                </Card.Title>
                <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                  {getTimeRangeLabel()}
                </span>
              </div>
              <Card.Text className="display-6 mb-3" style={{ fontWeight: '700', fontSize: '1.8rem' }}>
                {formatCurrency(dynamicData.totalEarnings)}
              </Card.Text>
              <div className="mt-auto d-flex align-items-center">
                <FaChartLine style={{ fontSize: '20px', marginRight: '8px', color: '#28a745' }} />
                <small style={{ fontSize: '0.85rem' }}>
                  <span className="text-success fw-bold">+12%</span> growth
                </small>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Col>

      {/* Net Profit Card */}
      <Col md={6} lg={3} className="mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Card style={cardStyle}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  <FaPiggyBank style={iconStyle} />
                  Net Profit
                </Card.Title>
                <span className="badge bg-primary" style={{ fontSize: '0.7rem' }}>
                  {getTimeRangeLabel()}
                </span>
              </div>
              <Card.Text className="display-6 mb-3" style={{ fontWeight: '700', fontSize: '1.8rem' }}>
                {formatCurrency(dynamicData.netProfit)}
              </Card.Text>
              <div className="mt-auto d-flex align-items-center">
                <FaArrowUp style={{ fontSize: '20px', marginRight: '8px', color: '#28a745' }} />
                <small style={{ fontSize: '0.85rem' }}>
                  <span className="text-success fw-bold">+8%</span> from last period
                </small>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Col>

      {/* Total Loss Card */}
      <Col md={6} lg={3} className="mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Card style={cardStyle}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  <FaMoneyBillWave style={iconStyle} />
                  Total Loss
                </Card.Title>
                <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>
                  {getTimeRangeLabel()}
                </span>
              </div>
              <Card.Text className="display-6 mb-3" style={{ fontWeight: '700', fontSize: '1.8rem' }}>
                {formatCurrency(dynamicData.totalLoss)}
              </Card.Text>
              <div className="mt-auto d-flex align-items-center">
                <FaArrowDown style={{ fontSize: '20px', marginRight: '8px', color: '#dc3545' }} />
                <small style={{ fontSize: '0.85rem' }}>
                  <span className="text-danger fw-bold">-5%</span> from last period
                </small>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Col>

      {/* Pending Withdrawals Card */}
      <Col md={6} lg={3} className="mb-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Card style={cardStyle}>
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0" style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                  <FaHourglassHalf style={iconStyle} />
                  Pending Withdrawals
                </Card.Title>
                <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                  Processing
                </span>
              </div>
              <Card.Text className="display-6 mb-3" style={{ fontWeight: '700', fontSize: '1.8rem' }}>
                {formatCurrency(dynamicData.pendingWithdrawals)}
              </Card.Text>
              <div className="mt-auto">
                <small style={{ fontSize: '0.85rem' }} className="text-muted">
                  Last processed: Today
                </small>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Col>
    </>
  );
};

BootstrapCards.propTypes = {
  financialData: PropTypes.shape({
    totalEarnings: PropTypes.number,
    netProfit: PropTypes.number,
    totalLoss: PropTypes.number,
    pendingWithdrawals: PropTypes.number,
    monthlyEarnings: PropTypes.number,
    monthlyProfit: PropTypes.number,
    monthlyLoss: PropTypes.number,
    weeklyEarnings: PropTypes.number,
    weeklyProfit: PropTypes.number,
    weeklyLoss: PropTypes.number
  }),
  timeRange: PropTypes.oneOf(['sinceLaunch', 'monthly', 'weekly'])
};

export default BootstrapCards;