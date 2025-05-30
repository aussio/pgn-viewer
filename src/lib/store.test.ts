import { describe, it, expect, beforeEach } from 'vitest';
import { useMoveTreeStore } from './store';
import { MoveTree, MoveTreeNode } from './MoveTree';

// Reset Zustand store state before each test
beforeEach(() => {
  useMoveTreeStore.setState({ moveTree: null, currentNode: null, parsed: null });
});

describe('useMoveTreeStore', () => {
  it('has correct initial state', () => {
    const state = useMoveTreeStore.getState();
    expect(state.moveTree).toBeNull();
    expect(state.currentNode).toBeNull();
    expect(state.parsed).toBeNull();
    expect(state.getCurrentBranchGroup()).toBe(0);
  });

  it('setMoveTree updates moveTree', () => {
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    useMoveTreeStore.getState().setMoveTree(tree);
    expect(useMoveTreeStore.getState().moveTree).toBe(tree);
  });

  it('setCurrentNode updates currentNode', () => {
    const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' }, children: [], branchGroup: 2 });
    useMoveTreeStore.getState().setCurrentNode(node);
    expect(useMoveTreeStore.getState().currentNode).toBe(node);
    expect(useMoveTreeStore.getState().getCurrentBranchGroup()).toBe(2);
  });

  it('setParsed updates parsed', () => {
    const parsed = {
      moves: [],
      tags: {
        Event: '', Site: '', Round: '', White: '', Black: '', Result: '',
        WhiteTitle: '', BlackTitle: '', WhiteElo: '', BlackElo: '', WhiteUSCF: '', BlackUSCF: '',
        WhiteNA: '', BlackNA: '', WhiteType: '', BlackType: '', EventDate: { value: '' }, EventSponsor: '',
        Section: '', Stage: '', Board: '', Opening: '', Variation: '', SubVariation: '', ECO: '', NIC: '',
        SetUp: '', FEN: '', Termination: '', Annotator: '', Mode: '', PlyCount: '',
        PuzzleEngine: '', PuzzleMakerVersion: '', PuzzleCategory: '', PuzzleWinner: '', Variant: '',
        WhiteRatingDiff: '', BlackRatingDiff: '', WhiteFideId: '', BlackFideId: '', WhiteTeam: '', BlackTeam: '', Orientation: '',
        Clock: '', WhiteClock: '', BlackClock: '',
        Date: { value: '' }, UTCDate: { value: '' }, Time: { value: '' }, UTCTime: { value: '' },
        TimeControl: {},
        messages: []
      },
      messages: []
    };
    useMoveTreeStore.getState().setParsed(parsed);
    expect(useMoveTreeStore.getState().parsed).toBe(parsed);
  });

  it('currentBranchGroup returns 0 if no currentNode', () => {
    useMoveTreeStore.getState().setCurrentNode(null);
    expect(useMoveTreeStore.getState().getCurrentBranchGroup()).toBe(0);
  });
});

describe('playOrAddMove', () => {
  beforeEach(() => {
    useMoveTreeStore.setState({ moveTree: null, currentNode: null });
  });

  it('does nothing if moveTree or currentNode is null', () => {
    useMoveTreeStore.getState().playOrAddMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    expect(useMoveTreeStore.getState().currentNode).toBeNull();
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    useMoveTreeStore.setState({ moveTree: tree, currentNode: null });
    useMoveTreeStore.getState().playOrAddMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    expect(useMoveTreeStore.getState().currentNode).toBeNull();
  });

  it('adds a move as a continuation if at end of branch', () => {
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    useMoveTreeStore.setState({ moveTree: tree, currentNode: tree.root });
    useMoveTreeStore.getState().playOrAddMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    const node = useMoveTreeStore.getState().currentNode;
    expect(node).not.toBeNull();
    expect(node?.move.notation).toBe('e4');
    expect(tree.root.children[0]).toBe(node);
  });

  it('moves to an existing child if the move already exists', () => {
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    const child = tree.root.addMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    useMoveTreeStore.setState({ moveTree: tree, currentNode: tree.root });
    useMoveTreeStore.getState().playOrAddMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    expect(useMoveTreeStore.getState().currentNode).toBe(child);
  });

  it('adds a move as a new branch if not at end of branch', () => {
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    const child = tree.root.addMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    useMoveTreeStore.setState({ moveTree: tree, currentNode: tree.root });
    // Add a new move that is not a child
    useMoveTreeStore.getState().playOrAddMove({ notation: 'd4', moveNumber: 1, turn: 'w' }, 'fen2');
    const newNode = useMoveTreeStore.getState().currentNode;
    expect(newNode).not.toBeNull();
    expect(newNode?.move.notation).toBe('d4');
    expect(newNode?.branchGroup).not.toBe(child.branchGroup);
    expect(tree.root.children.length).toBe(2);
  });
});

describe('deleteNodeAndDescendants', () => {
  beforeEach(() => {
    useMoveTreeStore.setState({ moveTree: null, currentNode: null });
  });

  it('removes the node and all its descendants from the tree and updates currentNode if needed', () => {
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    const e4 = tree.root.addMove({ notation: 'e4', moveNumber: 1, turn: 'w' }, 'fen1');
    const d4 = tree.root.addMove({ notation: 'd4', moveNumber: 1, turn: 'w' }, 'fen2');
    const d5 = d4.addMove({ notation: 'd5', moveNumber: 1, turn: 'b' }, 'fen3');
    useMoveTreeStore.setState({ moveTree: tree, currentNode: d5 });
    // Delete d4 (should remove d4 and d5)
    useMoveTreeStore.getState().deleteNodeAndDescendants(d4.id);
    // Only e4 should remain
    expect(tree.root.children.length).toBe(1);
    expect(tree.root.children[0]).toBe(e4);
    // d4 and d5 should be unreachable
    expect(tree.root.all(n => n === d4 || n === d5)).toEqual([]);
    // currentNode should be root since d5 was deleted
    expect(useMoveTreeStore.getState().currentNode).toBe(tree.root);
  });

  it('does nothing if node is root or not found', () => {
    const tree = new MoveTree({ fen: 'start', move: null, children: [] });
    useMoveTreeStore.setState({ moveTree: tree, currentNode: tree.root });
    useMoveTreeStore.getState().deleteNodeAndDescendants(tree.root.id); // Should not delete root
    expect(useMoveTreeStore.getState().moveTree).toBe(tree);
    useMoveTreeStore.getState().deleteNodeAndDescendants('not-an-id'); // Should do nothing
    expect(useMoveTreeStore.getState().moveTree).toBe(tree);
  });
}); 