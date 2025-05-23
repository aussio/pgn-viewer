import { parse } from '@mliebelt/pgn-parser';

/**
 * Parses a PGN string and returns the parsed JSON representation.
 * If the PGN is invalid or a PEG.js SyntaxError is thrown, returns an empty array.
 * Only the first game is returned (single-game PGN support).
 * @param {string} pgn - The PGN string to parse.
 * @returns {object[]} Parsed PGN game as a single-element array, or [] if invalid.
 */
export function parsePgn(pgn) {
    try {
        const games = parse(pgn, { startRule: 'games' });
        if (Array.isArray(games) && games.length > 0) {
            return [games[0]];
        }
        return [];
    } catch (err) {
        // If the PGN is invalid or a PEG.js SyntaxError is thrown, returns an empty array.
        if (err && err.name === 'SyntaxError') {
            return [];
        }
        throw err;
    }
} 