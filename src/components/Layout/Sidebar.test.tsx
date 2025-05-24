// @vitest-environment jsdom
import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Sidebar from './Sidebar';
import { useMoveTreeStore } from '../../lib/store';
import { MoveTree } from '../../lib/MoveTree';

describe('Sidebar', () => {
  beforeEach(() => {
    useMoveTreeStore.setState({ moveTree: null });
  });
  afterEach(() => {
    useMoveTreeStore.setState({ moveTree: null });
    cleanup();
  });

  it('renders nothing if no moveTree', () => {
    render(<Sidebar />);
    expect(screen.queryByTestId('sidebar')).toBeNull();
  });

  it('renders main line and variations', () => {
    // Minimal move tree: root -> e4 (main), d4 (variation)
    const tree = new MoveTree({
      fen: 'start',
      move: null,
      children: [
        { fen: 'fen1', move: { notation: 'e4' }, children: [] },
        { fen: 'fen2', move: { notation: 'd4' }, children: [] },
      ],
    });
    useMoveTreeStore.setState({ moveTree: tree });
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(within(sidebar).getByText(/Chapters/)).toBeTruthy();
    expect(within(sidebar).getByText(/Main Line: e4/)).toBeTruthy();
    expect(within(sidebar).getByText(/Variation 1: d4/)).toBeTruthy();
  });

  it('renders main line only if no variations', () => {
    const tree = new MoveTree({
      fen: 'start',
      move: null,
      children: [
        { fen: 'fen1', move: { notation: 'e4' }, children: [] },
      ],
    });
    useMoveTreeStore.setState({ moveTree: tree });
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(within(sidebar).getByText(/Main Line: e4/)).toBeTruthy();
    expect(within(sidebar).queryByText(/Variation/)).toBeNull();
  });
}); 