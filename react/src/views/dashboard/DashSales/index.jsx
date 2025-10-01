import { motion } from 'framer-motion';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { lazy, Suspense, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { authUtils } from '../../../utils/auth';
import ChartErrorBoundary from '../../../components/ChartErrorBoundary';

// Improved lazy loading with retry mechanism for other components
const lazyWithRetry = (componentImport) => {
  return lazy(async () => {
    const MAX_RETRIES = 3;
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        return await componentImport();
      } catch (error) {
        console.error(`Failed to load component (attempt ${retries + 1}):`, error);
        retries++;
        if (retries >= MAX_RETRIES) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
    throw new Error('Max retries reached');
  });
};

// Lazy load components with retry
const AnimatedCards = lazyWithRetry(() => import('../../../views/dashboard/components/AnimatedCards'));
const BootstrapCards = lazyWithRetry(() => import('../../../views/dashboard/components/BootstrapCards'));

// Import chart configs
import { SalesAccountChartData } from './chart/sales-account-chart';
import { SalesCustomerSatisfactionChartData } from './chart/sales-customer-satisfaction-chart';
import { DownloadsOverTimeChartData } from './chart/downloads-over-time-chart';

// Default data to prevent undefined errors
const DEFAULT_FINANCIAL_DATA = {
  totalEarnings: 0,
  netProfit: 0,
  pendingWithdrawals: 0,
  totalLoss: 0
};

const DEFAULT_METRICS = {
  activePlayers: 0,
  totalBidAmount: 0,
  totalRevenue: 0,
  totalDownloads: 0
};

// Enhanced chart options generator
const generateChartOptions = (baseOptions, customOptions = {}) => {
  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        ...(baseOptions.chart?.animations || {})
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          pan: false,
          reset: true
        },
        ...(baseOptions.chart?.toolbar || {})
      }
    },
    noData: {
      text: 'Loading chart data...',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#2c3e50',
        fontSize: '14px'
      }
    },
    ...customOptions
  };
};

export default function DashSales() {
  const [financialData, setFinancialData] = useState(DEFAULT_FINANCIAL_DATA);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(() => ({
    ...SalesAccountChartData,
    series: []
  }));
  const [isAuthenticated, setIsAuthenticated] = useState(authUtils.isAuthenticated());

  // Add authentication check and cleanup
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authUtils.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (!authenticated) {
        // Clear chart data when not authenticated to prevent NaN errors
        setChartData(prev => ({...prev, series: []}));
        setFinancialData(DEFAULT_FINANCIAL_DATA);
        setMetrics(DEFAULT_METRICS);
        setLoading(false);
      }
    };

    checkAuth();
    
    // Listen for auth state changes (logout)
    const handleAuthChange = (event) => {
      checkAuth();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  // Simulate API call to fetch data - only if authenticated
  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock API response
        const mockData = {
          series: [
            {
              name: 'Total Revenue',
              data: [280000, 310000, 260000, 290000, 330000, 300000, 340000, 350000, 320000, 360000, 330000, 390000]
            },
            {
              name: 'Net Profit',
              data: [210000, 240000, 200000, 220000, 250000, 230000, 260000, 270000, 250000, 280000, 260000, 300000]
            },
            {
              name: 'Total Loss',
              data: [70000, 70000, 60000, 70000, 80000, 70000, 80000, 80000, 70000, 80000, 70000, 90000]
            }
          ],
          metrics: {
            activePlayers: 1245,
            totalBidAmount: 1230450,
            totalRevenue: 312000,
            totalDownloads: 48000
          }
        };

        if (isMounted && isAuthenticated) {
          // Update chart data with API response
          setChartData(prev => ({
            ...prev,
            series: mockData.series
          }));

          // Update financial data
          setFinancialData({
            totalEarnings: mockData.series[0].data.reduce((a, b) => a + b, 0) / 12,
            netProfit: mockData.series[1].data.reduce((a, b) => a + b, 0) / 12,
            totalLoss: mockData.series[2].data.reduce((a, b) => a + b, 0) / 12,
            pendingWithdrawals: 150000 // Static value
          });

          // Update metrics
          setMetrics(mockData.metrics);
        }
      } catch (err) {
        console.error('Error fetching financial data:', err);
        if (isMounted) {
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFinancialData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Memoized chart options to prevent unnecessary re-renders
  const customerSatisfactionOptions = useMemo(() => generateChartOptions(
    SalesCustomerSatisfactionChartData?.options,
    {
      dataLabels: {
        formatter: function(val) {
          return parseFloat(val).toFixed(2) + '%';
        }
      }
    }
  ), []);

  const financialPerformanceOptions = useMemo(() => generateChartOptions(
    SalesAccountChartData?.options
  ), []);

  const downloadsOverTimeOptions = useMemo(() => generateChartOptions(
    DownloadsOverTimeChartData?.options
  ), []);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        <Alert variant="danger" className="my-4">
          {error}
          <div className="mt-2">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="dashboard-sales-container"
      style={{ 
        backgroundColor: '#F0FFFF', 
        minHeight: '100vh', 
        padding: '20px' 
      }}
    >
      {/* Show message if not authenticated */}
      {!isAuthenticated && (
        <Alert variant="warning" className="my-4">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>Please log in to view dashboard data.</p>
        </Alert>
      )}

      {/* Loading state */}
      {loading && isAuthenticated && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      )}

      {/* Content when not loading and authenticated */}
      {!loading && isAuthenticated && (
        <>
          {/* Animated Cards Section */}
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4">
                  <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                  Loading metric...
                </Card>
              ))}
            </div>
          }>
            <AnimatedCards metrics={metrics} />
          </Suspense>

          {/* Financial Cards Section */}
          <Row className="mt-4">
            <Suspense fallback={
              <Row>
                {[1, 2, 3, 4].map((i) => (
                  <Col key={i} md={6} lg={3} className="mb-4">
                    <Card className="h-100">
                      <Card.Body className="text-center">
                        <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                        Loading financial data...
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            }>
              <BootstrapCards financialData={financialData} />
            </Suspense>
          </Row>

          {/* Charts Section */}
          <Row className="mt-4">
            {/* Financial Performance Chart */}
            <Col md={8} className="mb-4">
              <ChartErrorBoundary>
                <Card className="chart-card" style={{ 
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: 'none',
                  backgroundColor: '#F0FFF0'
                }}>
                  <Card.Body>
                    <h5 className="card-title mb-3" style={{ 
                      color: '#2c3e50', 
                      fontWeight: '600',
                      fontSize: '1.2rem'
                    }}>
                      FINANCIAL PERFORMANCE
                    </h5>
                    <ReactApexChart
                      key={`financial-chart-${chartData.series.length}`}
                      options={financialPerformanceOptions}
                      series={chartData?.series || []}
                      type="bar"
                      height={350}
                      width="100%"
                    />
                  </Card.Body>
                </Card>
              </ChartErrorBoundary>
            </Col>

            {/* Customer Satisfaction Chart */}
            <Col md={4} className="mb-4">
              <ChartErrorBoundary>
                <Card className="chart-card" style={{ 
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: 'none',
                  backgroundColor: '#FFFFFF'
                }}>
                  <Card.Body>
                    <h5 className="card-title mb-3" style={{ 
                      color: '#2c3e50', 
                      fontWeight: '600',
                      fontSize: '1.2rem'
                    }}>
                      CUSTOMER SATISFACTION
                    </h5>
                    <ReactApexChart
                      key="customer-satisfaction-chart"
                      options={customerSatisfactionOptions}
                      series={SalesCustomerSatisfactionChartData?.series || []}
                      type="pie"
                      height={260}
                      width="100%"
                    />
                  </Card.Body>
                </Card>
              </ChartErrorBoundary>
            </Col>
          </Row>

          {/* Downloads Over Time Chart */}
          <Row className="mt-2 mb-4">
            <Col md={12}>
              <ChartErrorBoundary>
                <Card className="chart-card" style={{ 
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: 'none',
                  backgroundColor: '#F5FFFA'
                }}>
                  <Card.Body>
                    <h5 className="card-title mb-3" style={{ 
                      color: '#000000', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '1.2rem'
                    }}>
                      APPLICATION DOWNLOADS OVER TIME
                    </h5>
                    <ReactApexChart
                      key="downloads-chart"
                      options={downloadsOverTimeOptions}
                      series={DownloadsOverTimeChartData?.series || []}
                      type="line"
                      height={350}
                      width="100%"
                    />
                  </Card.Body>
                </Card>
              </ChartErrorBoundary>
            </Col>
          </Row>
        </>
      )}
    </motion.div>
  );
}