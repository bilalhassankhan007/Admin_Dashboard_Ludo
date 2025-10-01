import Progress from './Progress';

const Loader = ({ isAnimating = true, size = 'medium', className = '' }) => (
  <Progress isAnimating={isAnimating} size={size} className={className} />
);

export default Loader;