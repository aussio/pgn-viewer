import React from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useMoveTreeStore } from '../../lib/store';
import { getLastMoveHighlightStyles } from './chessUtils';
import { Chess } from 'chess.js';

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
  const playOrAddMove = useMoveTreeStore(state => state.playOrAddMove);

  /**
   * Handle a move played on the board. If valid, call playOrAddMove with move and new FEN.
   */
  const onPieceDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    const chess = new Chess(fen);
    const moveObj = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (!moveObj) return false;
    // Prepare move object for MoveTree (notation, moveNumber, turn, etc.)
    const moveNumber = moveObj.color === 'w' ? Math.ceil(chess.history().length / 2) : null;
    const move = {
      notation: moveObj.san,
      moveNumber,
      turn: moveObj.color,
    };
    playOrAddMove(move, chess.fen());
    return true;
  };

  return (
    <ReactChessboard
      position={fen}
      arePiecesDraggable={true}
      boardWidth={500}
      animationDuration={300}
      customSquareStyles={customSquareStyles}
      onPieceDrop={onPieceDrop}
    />
  );
};

export default Chessboard; 