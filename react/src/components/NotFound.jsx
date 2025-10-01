import MainCard from './Card/MainCard';
import { Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
      <MainCard title="Page Not Found">
        <div className="text-center">
          <h1>404</h1>
          <p className="my-3">The page you're looking for doesn't exist.</p>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
        </div>
      </MainCard>
    </div>
  );
};

export default NotFound;