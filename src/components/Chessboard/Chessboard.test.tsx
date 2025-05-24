// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Chessboard from './Chessboard';

/**
 * Unit test for Chessboard component.
 * Verifies that the board renders for a given FEN.
 */
describe('Chessboard', () => {
  it('renders the chessboard for a given FEN', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const { container } = render(<Chessboard fen={fen} />);
    // The chessboard should render an SVG element
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
}); 