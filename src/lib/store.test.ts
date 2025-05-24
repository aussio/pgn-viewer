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
    console.log(useMoveTreeStore.getState());
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