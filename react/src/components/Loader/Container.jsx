import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

const Container = ({ 
  animationDuration, 
  children, 
  isFinished, 
  size = 'medium', 
  className = '' 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const spinnerPosition = {
        small: 10,
        medium: 15,
        large: 20
      }[size];
      
      containerRef.current.style.setProperty('--spinner-position', `${spinnerPosition}px`);
    }
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`nprogress-container ${className}`}
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: 'none',
        transition: `opacity ${animationDuration}ms linear`,
        '--spinner-size': size === 'small' ? '16px' : size === 'large' ? '32px' : '24px'
      }}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  animationDuration: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  isFinished: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default Container;