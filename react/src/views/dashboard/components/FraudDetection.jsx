import { Card, Table, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserSlash } from 'react-icons/fa';

export default function FraudDetection({ fraudAlerts }) {
  const getBadgeVariant = (reason) => {
    switch(reason) {
      case 'Multiple accounts': return 'danger';
      case 'Unusual win pattern': return 'warning';
      case 'Payment fraud': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaShieldAlt className="text-danger me-2" />
            Fraud Detection
          </h5>
          <small className="text-muted">Last 7 days</small>
        </Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Player</th>
                <th>Reason</th>
                <th>Detected</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fraudAlerts?.map((alert, index) => (
                <motion.tr
                  key={alert.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                >
                  <td>{alert.player}</td>
                  <td>
                    <Badge bg={getBadgeVariant(alert.reason)}>
                      {alert.reason}
                    </Badge>
                  </td>
                  <td>
                    {new Date(alert.detected).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger">
                      <FaUserSlash className="me-1" />
                      Block
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </motion.div>
  );
}