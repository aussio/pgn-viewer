import React from 'react';
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, cleanup, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { useMoveTreeStore } from '../../lib/store';
import { MoveTree } from '../../lib/MoveTree';

vi.mock('../../lib/store');

describe('Sidebar', () => {
  const mockSetCurrentNode = vi.fn();
  const mockCurrentNode = { id: '2', branchGroup: 1 };
  const mockChaptersMap = new Map([
    [0, { id: '1', branchGroup: 0, move: { notation: 'e4' } }],
    [1, { id: '2', branchGroup: 1, move: { notation: 'd4' } }],
  ]);

  beforeEach(() => {
    vi.clearAllMocks();
    (useMoveTreeStore as unknown as { mockImplementation: Function }).mockImplementation((fn: any) => {
      if (fn.toString().includes('getBranchGroupChapters')) return () => new Map();
      if (fn.toString().includes('currentNode')) return null;
      if (fn.toString().includes('setCurrentNode')) return mockSetCurrentNode;
      return undefined;
    });
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
    (useMoveTreeStore as unknown as { mockImplementation: Function }).mockImplementation((fn: any) => {
      if (fn.toString().includes('getBranchGroupChapters')) return () => mockChaptersMap;
      if (fn.toString().includes('currentNode')) return mockCurrentNode;
      if (fn.toString().includes('setCurrentNode')) return mockSetCurrentNode;
      return undefined;
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
    (useMoveTreeStore as unknown as { mockImplementation: Function }).mockImplementation((fn: any) => {
      if (fn.toString().includes('getBranchGroupChapters')) return () => new Map([[0, { id: '1', branchGroup: 0, move: { notation: 'e4' } }]]);
      if (fn.toString().includes('currentNode')) return { id: '1', branchGroup: 0, move: { notation: 'e4' } };
      if (fn.toString().includes('setCurrentNode')) return mockSetCurrentNode;
      return undefined;
    });
    useMoveTreeStore.setState({ moveTree: tree });
    render(<Sidebar />);
    const sidebar = screen.getByTestId('sidebar');
    expect(within(sidebar).getByText(/Main Line: e4/)).toBeTruthy();
    expect(within(sidebar).queryByText(/Variation/)).toBeNull();
  });

  it('renders chapters and bolds the current branch', () => {
    (useMoveTreeStore as unknown as { mockImplementation: Function }).mockImplementation((fn: any) => {
      if (fn.toString().includes('getBranchGroupChapters')) return () => mockChaptersMap;
      if (fn.toString().includes('currentNode')) return mockCurrentNode;
      if (fn.toString().includes('setCurrentNode')) return mockSetCurrentNode;
      return undefined;
    });
    const { getByText } = render(<Sidebar />);
    expect(getByText('Main Line: e4')).toBeInTheDocument();
    expect(getByText('Variation 1: d4').tagName).toBe('STRONG');
  });

  it('calls setCurrentNode when a branch is clicked', () => {
    (useMoveTreeStore as unknown as { mockImplementation: Function }).mockImplementation((fn: any) => {
      if (fn.toString().includes('getBranchGroupChapters')) return () => mockChaptersMap;
      if (fn.toString().includes('currentNode')) return mockCurrentNode;
      if (fn.toString().includes('setCurrentNode')) return mockSetCurrentNode;
      return undefined;
    });
    const { getByTestId } = render(<Sidebar />);
    fireEvent.click(getByTestId('sidebar-branch-0'));
    expect(mockSetCurrentNode).toHaveBeenCalledWith(mockChaptersMap.get(0));
    fireEvent.click(getByTestId('sidebar-branch-1'));
    expect(mockSetCurrentNode).toHaveBeenCalledWith(mockChaptersMap.get(1));
  });
}); 