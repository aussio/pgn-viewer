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
 *   - playOrAddMove
 *   - deleteNodeAndDescendants
 *
 * Selectors:
 *   - currentBranchGroup: branchGroup of the current node (or 0)
 */
import { create } from 'zustand';
import type { MoveTree, MoveTreeNode } from './MoveTree';
import { MoveTreeNode as MoveTreeNodeClass } from './MoveTree';
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
  playOrAddMove: (move: any, fen: string) => void;
  deleteNodeAndDescendants: (nodeId: string) => void;
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

  /**
   * Play or add a move to the MoveTree from the currentNode.
   * - If the move exists as a child, updates currentNode to that child.
   * - If not, adds the move as a continuation (if at end) or as a new branch (if not at end).
   * - Updates moveTree and currentNode in the store.
   * @param move The move object (should have notation, moveNumber, turn, etc.)
   * @param fen The resulting FEN after the move
   */
  playOrAddMove: (move: any, fen: string) => {
    const { moveTree, currentNode } = get();
    if (!moveTree || !currentNode) return;
    // 1. Check if move exists as a child
    const existing = currentNode.findChildByMove(move);
    if (existing) {
      set({ currentNode: existing });
      return;
    }
    // 2. If at end, add as continuation
    if (currentNode.isAtEndOfBranch()) {
      const newNode = currentNode.addMove(move, fen);
      set({ currentNode: newNode });
      return;
    }
    // 3. Otherwise, add as new branch (variation)
    // Find max branchGroup in the tree
    let maxBranchGroup = 0;
    moveTree.root.walk(node => {
      if (node.branchGroup > maxBranchGroup) maxBranchGroup = node.branchGroup;
    });
    const newBranchGroup = maxBranchGroup + 1;
    const newNode = currentNode.addMove(move, fen, newBranchGroup);
    set({ currentNode: newNode });
  },

  /**
   * Delete a node and all its descendants from the MoveTree by nodeId.
   * If the currentNode is deleted, set currentNode to its parent or root.
   * Does nothing if node is not found or is the root.
   * @param nodeId The id of the node to delete
   */
  deleteNodeAndDescendants: (nodeId: string) => {
    const { moveTree, currentNode } = get();
    if (!moveTree) return;
    const node = MoveTreeNodeClass.findById(moveTree.root, nodeId);
    if (!node || !node.parent) return; // Don't delete root or non-existent
    const parent = node.parent;
    node.deleteSubtree();
    // If currentNode was deleted, move to parent or root
    if (currentNode && (currentNode === node || node.all((n: MoveTreeNode) => n === currentNode).length > 0)) {
      set({ currentNode: parent || moveTree.root });
    } else {
      set({ moveTree });
    }
  },
})); 