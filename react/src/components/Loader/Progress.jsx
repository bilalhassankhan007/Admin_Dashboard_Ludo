import PropTypes from 'prop-types';
import { useNProgress } from '@tanem/react-nprogress';
import Bar from './Bar';
import Container from './Container';
import Spinner from './Spinner';

const Progress = ({ 
  isAnimating = true, 
  size = 'medium', 
  className = '',
  spinner = true,
  bar = true
}) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating
  });

  return (
    <Container 
      animationDuration={animationDuration}
      isFinished={isFinished}
      size={size}
      className={className}
    >
      {bar && <Bar animationDuration={animationDuration} progress={progress} size={size} />}
      {spinner && <Spinner size={size} />}
    </Container>
  );
};

Progress.propTypes = {
  isAnimating: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  spinner: PropTypes.bool,
  bar: PropTypes.bool
};

export default Progress;