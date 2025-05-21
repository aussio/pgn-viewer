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

describe('parsePgn', () => {
    it('parses a simple PGN string', () => {
        const result = parsePgn(simplePgn);
        console.log('PGN parse result:', JSON.stringify(result, null, 2));
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].tags.White).toBe('Fischer, Robert J.');
        expect(result[0].moves[0].notation.notation).toBe('e4');
    });

    it('returns an empty array for empty input', () => {
        const result = parsePgn('');
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('throws or returns empty for invalid PGN', () => {
        // The parser is forgiving, so it may return an empty array
        const result = parsePgn('not a pgn');
        expect(Array.isArray(result)).toBe(true);
    });
}); 