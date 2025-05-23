import { describe, it, expect } from 'vitest';
import { parsePgn } from './pgnParser';

const simplePgn = `
[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 1/2-1/2
`;

const pgnWithVariation = `
[Event "Variation Test"]
[Site "Test"]
[Date "2023.01.01"]
[White "White"]
[Black "Black"]
[Result "*"]

1. e4 (1. d4 d5 2. c4) e5 2. Nf3 Nc6 3. Bb5 a6 *
`;

describe('parsePgn', () => {
    it('parses a simple PGN string', () => {
        const result = parsePgn(simplePgn)!;
        expect(result.tags!.White).toBe('Fischer, Robert J.');
        expect(result.moves[0].notation.notation).toBe('e4');
    });

    it('parses a PGN with a root-level variation', () => {
        const result = parsePgn(pgnWithVariation)!;
        const moves = result.moves;
        // Mainline first move
        expect(moves[0].notation.notation).toBe('e4');
        // Variation on first move
        expect(Array.isArray(moves[0].variations)).toBe(true);
        expect(moves[0].variations.length).toBe(1);
        const variation = moves[0].variations[0];
        expect(variation[0].notation.notation).toBe('d4');
        expect(variation[1].notation.notation).toBe('d5');
        expect(variation[2].notation.notation).toBe('c4');
        // Mainline continues
        expect(moves[1].notation.notation).toBe('e5');
    });

    it('returns null for empty input', () => {
        const result = parsePgn('');
        expect(result).toBeNull();
    });

    it('returns null for invalid PGN', () => {
        const result = parsePgn('not a pgn');
        expect(result).toBeNull();
    });
}); 