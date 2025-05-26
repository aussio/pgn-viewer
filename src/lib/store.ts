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
  setCurrentNode: (currentNode: MoveTreeNode | null) => void;
  setParsed: (parsed: ParseTree | null) => void;
  getCurrentBranchGroup: () => number;
  getBranchGroupChapters: () => Map<number, MoveTreeNode>;
}

// Utility to get the first node for each branch group in a move tree
export function getBranchGroupChaptersFromTree(moveTree: MoveTree | null): Map<number, MoveTreeNode> {
  const map = new Map<number, MoveTreeNode>();
  if (!moveTree) return map;
  moveTree.root.walk(node => {
    if (!map.has(node.branchGroup)) {
      map.set(node.branchGroup, node);
    }
  });
  return map;
}

export const useMoveTreeStore = create<MoveTreeStore>((set, get) => ({
  moveTree: null,
  currentNode: null,
  parsed: null,
  setMoveTree: (moveTree) => set({ moveTree }),
  setCurrentNode: (currentNode) => set({ currentNode }),
  setParsed: (parsed) => set({ parsed }),
  getCurrentBranchGroup: () => get().currentNode?.branchGroup ?? 0,
  getBranchGroupChapters: () => getBranchGroupChaptersFromTree(get().moveTree),
})); 