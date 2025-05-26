import { getLastMoveHighlightStyles } from './chessUtils';

describe('getLastMoveHighlightStyles', () => {
  const defaultFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  it('returns empty object for root node', () => {
    const node = { parent: null };
    expect(getLastMoveHighlightStyles(node, defaultFen)).toEqual({});
  });

  it('returns empty object if no move', () => {
    const node = { parent: { fen: defaultFen }, move: null };
    expect(getLastMoveHighlightStyles(node, defaultFen)).toEqual({});
  });

  it('highlights correct squares for a simple move', () => {
    // e2e4 from start position
    const node = {
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      parent: { fen: defaultFen },
      move: { notation: 'e4' },
    };
    const result = getLastMoveHighlightStyles(node, defaultFen);
    expect(result['e2']).toBeDefined();
    expect(result['e4']).toBeDefined();
  });

  it('handles ambiguous moves (e.g., knight move)', () => {
    // After 1. Nf3 from start
    const node = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
      parent: { fen: defaultFen },
      move: { notation: 'Nf3' },
    };
    const result = getLastMoveHighlightStyles(node, defaultFen);
    expect(Object.keys(result).length).toBe(2);
    expect(result['g1']).toBeDefined();
    expect(result['f3']).toBeDefined();
  });

  it('returns empty object if error thrown', () => {
    // Invalid FEN
    const node = {
      fen: 'invalid',
      parent: { fen: 'invalid' },
      move: { notation: 'e4' },
    };
    expect(getLastMoveHighlightStyles(node, defaultFen)).toEqual({});
  });
}); 