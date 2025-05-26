import React from 'react';
import { Chess } from 'chess.js';

/**
 * Returns custom square styles to highlight the previous move's from/to squares.
 * @param currentNode The currently selected move tree node
 * @param defaultFen The default FEN string for the start position
 * @returns Record<string, React.CSSProperties> for use in customSquareStyles
 */
export function getLastMoveHighlightStyles(currentNode: any, defaultFen: string): Record<string, React.CSSProperties> {
  let fromSquare: string | null = null;
  let toSquare: string | null = null;
  if (currentNode && currentNode.parent && currentNode.move?.notation) {
    try {
      const chess = new Chess(currentNode.parent.fen || defaultFen);
      const moves = chess.moves({ verbose: true });
      // Find the move that leads to the current FEN
      const found = moves.find(m => {
        chess.move(m);
        const matches = chess.fen() === currentNode.fen;
        chess.undo();
        return matches;
      });
      if (found) {
        fromSquare = found.from;
        toSquare = found.to;
      }
    } catch {}
  }
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (fromSquare) {
    customSquareStyles[fromSquare] = {
      ...customSquareStyles[fromSquare],
      background: 'rgba(255, 255, 75, 0.5)',
    };
  }
  if (toSquare) {
    customSquareStyles[toSquare] = {
      ...customSquareStyles[toSquare],
      background: 'rgba(255, 255, 75, 0.5)',
    };
  }
  return customSquareStyles;
} 