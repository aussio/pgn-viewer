import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';

/**
 * Chessboard component for displaying a chess position.
 *
 * @param {object} props - Component props
 * @param {string} props.fen - FEN string representing the current board position
 * @returns {JSX.Element} Interactive chessboard view
 */
const Chessboard: React.FC<{ fen: string }> = ({ fen }) => {
  return (
    <ReactChessboard
      position={fen}
      arePiecesDraggable={false} // For now, disable piece dragging
      boardWidth={400}
    />
  );
};

export default Chessboard; 