import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useMoveTreeStore } from '../../lib/store'

const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Chessboard component for displaying a chess position.
 *
 * @returns {JSX.Element} Interactive chessboard view
 */
const Chessboard: React.FC = () => {
  const currentNode = useMoveTreeStore(state => state.currentNode)
  const fen = currentNode?.fen ? currentNode.fen : defaultFen;
  return (
    <ReactChessboard
      position={fen}
      arePiecesDraggable={false} // For now, disable piece dragging
      boardWidth={500}
      animationDuration={300}
    />
  );
};

export default Chessboard; 