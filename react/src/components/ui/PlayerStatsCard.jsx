import { Card, ProgressBar, Stack } from 'react-bootstrap';
import { motion } from 'framer-motion';

const PlayerStatsCard = ({ 
  player,
  matchesPlayed,
  winRate,
  totalEarnings,
  favoriteGame = 'Ludo',
  loading = false
}) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card className="shadow-sm h-100">
        <Card.Body>
          <Card.Title className="mb-4">
            {loading ? (
              <div className="placeholder placeholder-lg col-6"></div>
            ) : (
              `Player: ${player}`
            )}
          </Card.Title>
          
          {loading ? (
            <div className="placeholder-glow">
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-3">
                  <div className="placeholder col-12 mb-1"></div>
                  <div className="placeholder col-8"></div>
                </div>
              ))}
            </div>
          ) : (
            <Stack gap={3}>
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Matches Played</span>
                  <span>{matchesPlayed}</span>
                </div>
                <ProgressBar now={matchesPlayed % 100} />
              </div>
              
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Win Rate</span>
                  <span>{winRate}%</span>
                </div>
                <ProgressBar variant="success" now={winRate} />
              </div>
              
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Total Earnings</span>
                  <span>₹{totalEarnings.toLocaleString('en-IN')}</span>
                </div>
                <ProgressBar variant="warning" now={(totalEarnings / 10000) % 100} />
              </div>
              
              <div className="mt-2">
                <small className="text-muted">Favorite Game: {favoriteGame}</small>
              </div>
            </Stack>
          )}
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default PlayerStatsCard;