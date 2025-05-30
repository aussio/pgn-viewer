import React, { useState, useMemo } from 'react';
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
  const playOrAddMove = useMoveTreeStore(state => state.playOrAddMove);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  // Compute legal moves for the selected square
  const legalMoves: any[] = useMemo(() => {
    if (!selectedSquare) return [];
    try {
      const chess = new Chess(fen);
      return chess.moves({ square: selectedSquare as any, verbose: true }) as any[];
    } catch {
      return [];
    }
  }, [fen, selectedSquare]);

  // Highlight last move and legal move dots
  const lastMoveStyles = getLastMoveHighlightStyles(currentNode, defaultFen);
  const legalMoveDotStyles: Record<string, React.CSSProperties> = {};
  if (selectedSquare) {
    for (const move of legalMoves) {
      legalMoveDotStyles[move.to] = {
        background: 'radial-gradient(circle, #888 20%, transparent 22%)',
      };
    }
    // Optionally highlight the selected square
    legalMoveDotStyles[selectedSquare] = {
      ...legalMoveDotStyles[selectedSquare],
      background: 'rgba(30, 144, 255, 0.2)',
    };
  }
  const customSquareStyles = { ...lastMoveStyles, ...legalMoveDotStyles };

  /**
   * Handle a move played on the board. If valid, call playOrAddMove with move and new FEN.
   */
  const onPieceDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    const chess = new Chess(fen);
    const moveObj = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (!moveObj) return false;
    const moveNumber = moveObj.color === 'w' ? Math.ceil(chess.history().length / 2) : null;
    const move = {
      notation: moveObj.san,
      moveNumber,
      turn: moveObj.color,
    };
    playOrAddMove(move, chess.fen());
    setSelectedSquare(null);
    return true;
  };

  /**
   * Handle square click: select piece or move if legal.
   */
  const onSquareClick = (square: string) => {
    if (selectedSquare && selectedSquare !== square) {
      // Try to move if this is a legal destination
      const move = legalMoves.find(m => m.to === square);
      if (move) {
        onPieceDrop(selectedSquare, square, move.piece);
        return;
      }
    }
    // Select or deselect the square
    setSelectedSquare(sq => (sq === square ? null : square));
  };

  return (
    <ReactChessboard
      position={fen}
      arePiecesDraggable={true}
      boardWidth={500}
      animationDuration={300}
      customSquareStyles={customSquareStyles}
      onPieceDrop={onPieceDrop}
      onSquareClick={onSquareClick}
    />
  );
};

export default Chessboard; 