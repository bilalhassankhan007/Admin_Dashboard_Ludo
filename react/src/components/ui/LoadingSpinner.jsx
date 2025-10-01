import { Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading dashboard data...', size = 'lg' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center p-5"
    >
      <Spinner 
        animation="border" 
        role="status" 
        variant="primary"
        size={size}
        className="mb-3"
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <p className="text-muted">{message}</p>
    </motion.div>
  );
};

export default LoadingSpinner;