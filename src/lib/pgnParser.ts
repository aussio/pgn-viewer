import { parseGame } from '@mliebelt/pgn-parser';
import type { ParseTree } from '../types/pgn';

/**
 * Parses a single-game PGN string and returns the parsed JSON representation as a ParseTree.
 * Only single-game PGN strings are supported. If the PGN is invalid or a PEG.js SyntaxError is thrown, returns null.
 * @param pgn The PGN string to parse (must contain only one game).
 * @returns The parsed PGN game as a ParseTree, or null if invalid.
 */
export function parsePgn(pgn: string): ParseTree | null {
    try {
        return parseGame(pgn) as ParseTree;
    } catch (err: any) {
        // If the PGN is invalid or a PEG.js SyntaxError is thrown, returns null.
        if (err && err.name === 'SyntaxError') {
            return null;
        }
        throw err;
    }
} 