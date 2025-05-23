import type { ParseTree as LibParseTree } from '@mliebelt/pgn-parser';
import type { PgnMove as LibPgnMove } from '@mliebelt/pgn-types';

// Real-world types matching actual output
export type PgnMove = Omit<LibPgnMove, 'moveNumber'> & {
  moveNumber: number | null;
};

export type ParseTree = Omit<LibParseTree, 'moves'> & {
  moves: PgnMove[];
}; 