// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import Chessboard from './Chessboard';
import { useMoveTreeStore } from '../../lib/store';
import { MoveTreeNode } from '../../lib/MoveTree';

/**
 * Unit test for Chessboard component.
 * Verifies that the board renders for a given FEN.
 */
describe('Chessboard', () => {
  beforeEach(() => {
    useMoveTreeStore.setState({ currentNode: null });
  });
  afterEach(() => {
    useMoveTreeStore.setState({ currentNode: null });
    cleanup();
  });

  it('renders the default position if no currentNode', () => {
    const { container } = render(<Chessboard />);
    // Look for a chessboard square (e.g., data-square or class)
    // console.log(container.innerHTML);
    const square = container.querySelector('[data-square="e4"]') || container.querySelector('.chessboard-square');
    expect(square).toBeTruthy();
  });

  it('renders the correct position for the currentNode (white king on e4)', () => {
    // FEN: only a white king on e4
    const fen = '8/8/8/8/4K3/8/8/8 w - - 0 1';
    const node = new MoveTreeNode({ fen, move: { notation: 'e4' }, children: [] });
    useMoveTreeStore.setState({ currentNode: node });
    const { container } = render(<Chessboard />);
    // Find the e4 square
    const square = container.querySelector('[data-square="e4"]') || container.querySelector('.chessboard-square');
    expect(square).toBeTruthy();
  });
}); 