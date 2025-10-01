import { Card, Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaRupeeSign, FaCheck, FaTimes, FaClock } from 'react-icons/fa';

export default function WithdrawalManager({ withdrawals }) {
  const statusVariant = {
    'Pending': 'warning',
    'Processing': 'primary',
    'Completed': 'success'
  };

  const statusIcon = {
    'Pending': <FaClock className="me-1" />,
    'Processing': <FaClock className="me-1" />,
    'Completed': <FaCheck className="me-1" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-sm">
        <Card.Header className="bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Withdrawal Requests</h5>
          <div>
            <ButtonGroup size="sm">
              <Button variant="outline-primary">All</Button>
              <Button variant="outline-primary">Pending</Button>
              <Button variant="outline-primary">Completed</Button>
            </ButtonGroup>
          </div>
        </Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Player</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals?.map((withdrawal) => (
                <motion.tr
                  key={withdrawal.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                >
                  <td>{withdrawal.player}</td>
                  <td>
                    <FaRupeeSign className="me-1" />
                    {withdrawal.amount.toLocaleString('en-IN')}
                  </td>
                  <td>{withdrawal.method}</td>
                  <td>
                    <Badge bg={statusVariant[withdrawal.status]}>
                      {statusIcon[withdrawal.status]}
                      {withdrawal.status}
                    </Badge>
                  </td>
                  <td>
                    {withdrawal.status === 'Pending' && (
                      <>
                        <Button size="sm" variant="success" className="me-2">
                          <FaCheck /> Approve
                        </Button>
                        <Button size="sm" variant="danger">
                          <FaTimes /> Reject
                        </Button>
                      </>
                    )}
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