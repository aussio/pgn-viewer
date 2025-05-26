import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useMoveTreeStore } from '../../lib/store';
import { getLastMoveHighlightStyles } from './chessUtils';

const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Chessboard component for displaying a chess position.
 * Highlights the previous move's from/to squares (like chess.com/lichess).
 *
 * @returns {JSX.Element} Interactive chessboard view
 */
const Chessboard: React.FC = () => {
  const currentNode = useMoveTreeStore(state => state.currentNode);
  const fen = currentNode?.fen ? currentNode.fen : defaultFen;
  const customSquareStyles = getLastMoveHighlightStyles(currentNode, defaultFen);

  return (
    <ReactChessboard
      position={fen}
      arePiecesDraggable={false} // For now, disable piece dragging
      boardWidth={500}
      animationDuration={300}
      customSquareStyles={customSquareStyles}
    />
  );
};

export default Chessboard; 