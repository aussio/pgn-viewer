import { describe, it, expect } from 'vitest';

// --- Copied from MoveTreeFlow.jsx ---
const pieceMap: Record<string, string> = {
  K: 'K', Q: 'Q', R: 'R', B: 'B', N: 'N', P: 'P',
};

function getPieceType(notation: string | null): string {
  if (!notation) return 'P'; // Default to pawn
  const first = notation[0];
  return pieceMap[first] ? first : 'P';
}

function getToSquare(notation: string | null): string {
  if (!notation) return '';
  const match = notation.match(/[a-h][1-8]$/);
  return match ? match[0] : '';
}
// --- End copy ---

describe('getPieceType', () => {
  it('returns correct piece for standard notations', () => {
    expect(getPieceType('Nf3')).toBe('N');
    expect(getPieceType('Qxe5')).toBe('Q');
    expect(getPieceType('Bb5')).toBe('B');
    expect(getPieceType('Rd1')).toBe('R');
    expect(getPieceType('Kd2')).toBe('K');
    expect(getPieceType('e4')).toBe('P'); // pawn move
    expect(getPieceType('exd5')).toBe('P'); // pawn capture
    expect(getPieceType('')).toBe('P');
    expect(getPieceType(null)).toBe('P');
  });
});

describe('getToSquare', () => {
  it('extracts the correct destination square from notation', () => {
    expect(getToSquare('Nf3')).toBe('f3');
    expect(getToSquare('Qxe5')).toBe('e5');
    expect(getToSquare('Bb5')).toBe('b5');
    expect(getToSquare('Rd1')).toBe('d1');
    expect(getToSquare('Kd2')).toBe('d2');
    expect(getToSquare('e4')).toBe('e4');
    expect(getToSquare('exd5')).toBe('d5');
    expect(getToSquare('')).toBe('');
    expect(getToSquare(null)).toBe('');
  });
  it('returns empty string for invalid notation', () => {
    expect(getToSquare('O-O')).toBe('');
    expect(getToSquare('O-O-O')).toBe('');
    expect(getToSquare('invalid')).toBe('');
  });
}); 