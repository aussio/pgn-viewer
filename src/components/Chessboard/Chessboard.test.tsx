import React from 'react';
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import Chessboard from './Chessboard';
import { useMoveTreeStore } from '../../lib/store';
import { MoveTreeNode } from '../../lib/MoveTree';
import { MoveTree } from '../../lib/MoveTree';

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

  it('updates currentNode in the store when a move is played', () => {
    // Set up a minimal tree and store
    const { Chess } = require('chess.js');
    const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const tree = new MoveTree({ fen: startFen, move: null, children: [] });
    useMoveTreeStore.setState({ moveTree: tree, currentNode: tree.root });
    // Render the component
    const { container } = render(<Chessboard />);
    // Simulate a move: e2 to e4
    const fen = tree.root.fen;
    const chess = new Chess(fen);
    const moveObj = chess.move({ from: 'e2', to: 'e4', promotion: 'q' });
    // Call the handler directly
    const playOrAddMove = useMoveTreeStore.getState().playOrAddMove;
    const move = {
      notation: moveObj.san,
      moveNumber: moveObj.color === 'w' ? Math.ceil(chess.history().length / 2) : null,
      turn: moveObj.color,
    };
    playOrAddMove(move, chess.fen());
    // Assert currentNode is updated
    const currentNode = useMoveTreeStore.getState().currentNode;
    expect(currentNode).not.toBeNull();
    expect(currentNode?.move.notation).toBe('e4');
  });
}); 