import PropTypes from 'prop-types';

const Bar = ({ 
  animationDuration, 
  progress, 
  size = 'medium'
}) => {
  const heightMap = {
    small: 1,
    medium: 2,
    large: 3
  };

  const shadowSizeMap = {
    small: '0 0 5px #29d, 0 0 2px #29d',
    medium: '0 0 10px #29d, 0 0 5px #29d',
    large: '0 0 15px #29d, 0 0 8px #29d'
  };

  return (
    <div
      style={{
        background: '#29d',
        height: heightMap[size],
        left: 0,
        marginLeft: `${(-1 + progress) * 100}%`,
        position: 'fixed',
        top: 0,
        transition: `margin-left ${animationDuration}ms linear`,
        width: '100%',
        zIndex: 1031
      }}
    >
      <div
        style={{
          boxShadow: shadowSizeMap[size],
          display: 'block',
          height: '100%',
          opacity: 1,
          position: 'absolute',
          right: 0,
          transform: 'rotate(3deg) translate(0px, -4px)',
          width: size === 'large' ? 120 : 100
        }}
      />
    </div>
  );
};

Bar.propTypes = {
  animationDuration: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default Bar;