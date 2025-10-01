import { Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaRupeeSign, FaChartLine, FaExchangeAlt, FaPiggyBank } from 'react-icons/fa';
import AreaChart from '../charts/AreaChart';

export default function FinancialSummary({ financialData }) {
  const stats = [
    {
      title: "Total Revenue",
      value: `₹${financialData?.totalEarnings.toLocaleString('en-IN')}`,
      icon: <FaRupeeSign className="text-success" />,
      description: "All time earnings"
    },
    {
      title: "Profit Margin",
      value: `${((financialData?.netProfit / financialData?.totalEarnings) * 100 || 0).toFixed(1)}%`,
      icon: <FaChartLine className="text-primary" />,
      description: "Net profit percentage"
    },
    {
      title: "Daily Revenue",
      value: `₹${(financialData?.dailyRevenue[0]?.amount || 0).toLocaleString('en-IN')}`,
      icon: <FaExchangeAlt className="text-info" />,
      description: "Today's earnings"
    },
    {
      title: "Player Winnings",
      value: `₹${(financialData?.totalEarnings - financialData?.netProfit || 0).toLocaleString('en-IN')}`,
      icon: <FaPiggyBank className="text-warning" />,
      description: "Paid to winners"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-4">Financial Summary</h5>
          
          <Row className="g-3 mb-4">
            {stats.map((item, index) => (
              <Col key={index} xs={6} md={3}>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="p-3 border rounded h-100"
                >
                  <div className="d-flex align-items-center mb-2">
                    <div className="me-2 text-muted">
                      {item.icon}
                    </div>
                    <small className="text-muted">{item.title}</small>
                  </div>
                  <h4 className="mb-1">{item.value}</h4>
                  <small className="text-muted">{item.description}</small>
                </motion.div>
              </Col>
            ))}
          </Row>

          <div className="mt-2">
            <AreaChart 
              data={financialData?.dailyRevenue || []} 
              title="30-Day Revenue Trend" 
            />
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}