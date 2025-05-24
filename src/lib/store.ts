/**
 * Zustand store for move tree and UI state.
 *
 * Stores:
 *   - moveTree: the current MoveTree (or null)
 *   - currentNode: the currently selected MoveTreeNode (or null)
 *   - parsed: the parsed PGN (or null)
 *
 * Actions:
 *   - setMoveTree
 *   - setCurrentNode
 *   - setParsed
 *
 * Selectors:
 *   - currentBranchGroup: branchGroup of the current node (or 0)
 */
import { create } from 'zustand';
import type { MoveTree, MoveTreeNode } from './MoveTree';
import type { ParseTree } from '../types/pgn';

interface MoveTreeStore {
  moveTree: MoveTree | null;
  currentNode: MoveTreeNode | null;
  parsed: ParseTree | null;
  setMoveTree: (moveTree: MoveTree | null) => void;
  setCurrentNode: (node: MoveTreeNode | null) => void;
  setParsed: (parsed: ParseTree | null) => void;
  getCurrentBranchGroup: () => number;
}

export const useMoveTreeStore = create<MoveTreeStore>((set, get) => ({
  moveTree: null,
  currentNode: null,
  parsed: null,
  setMoveTree: (moveTree) => set({ moveTree }),
  setCurrentNode: (currentNode) => set({ currentNode }),
  setParsed: (parsed) => set({ parsed }),
  getCurrentBranchGroup: () => get().currentNode?.branchGroup ?? 0,
})); 