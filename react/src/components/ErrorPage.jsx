import { useRouteError } from 'react-router-dom';
import MainCard from './Card/MainCard';
import { Button } from 'react-bootstrap';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
      <MainCard title="Route Error">
        <div className="text-center">
          <h1>Oops!</h1>
          <p className="text-danger my-3">
            {error.statusText || error.message}
          </p>
          <Button 
            variant="primary" 
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </div>
      </MainCard>
    </div>
  );
};

export default ErrorPage;