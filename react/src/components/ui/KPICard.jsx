import { Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FaRupeeSign, 
  FaUsers, 
  FaGamepad, 
  FaChartLine,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const KPICard = ({ 
  title, 
  value, 
  icon, 
  trend = 'neutral',
  description,
  loading = false
}) => {
  const getIcon = () => {
    switch(icon) {
      case 'revenue': return <FaRupeeSign className="text-success" />;
      case 'users': return <FaUsers className="text-primary" />;
      case 'games': return <FaGamepad className="text-warning" />;
      default: return <FaChartLine className="text-info" />;
    }
  };

  const trendConfig = {
    up: { icon: <FaArrowUp className="text-success" />, bg: 'bg-success-light' },
    down: { icon: <FaArrowDown className="text-danger" />, bg: 'bg-danger-light' },
    neutral: { icon: null, bg: 'bg-secondary-light' }
  };

  return (
    <motion.div whileHover={{ scale: 1.03 }}>
      <Card className={`shadow-sm h-100 ${trendConfig[trend].bg}`}>
        <Card.Body className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-muted">{title}</h6>
            {trendConfig[trend].icon && (
              <span className="badge bg-white text-dark">
                {trendConfig[trend].icon}
              </span>
            )}
          </div>
          {loading ? (
            <div className="placeholder-glow">
              <div className="placeholder col-8" style={{ height: '2rem' }}></div>
              <div className="placeholder col-6" style={{ height: '1rem' }}></div>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <div className="me-3 fs-2">
                {getIcon()}
              </div>
              <div>
                <h3 className="mb-0">{value}</h3>
                <small className="text-muted">{description}</small>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default KPICard;