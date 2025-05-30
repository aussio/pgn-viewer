import { describe, it, expect } from 'vitest';
import { MoveTree, MoveTreeNode } from './MoveTree';

describe('MoveTree and MoveTreeNode (chess-specific)', () => {
    it('constructs a tree from a chess model', () => {
        const model = {
            fen: 'start',
            move: null,
            children: [
                { fen: 'fen1', move: { notation: 'e4', moveNumber: 1 } },
                {
                    fen: 'fen2', move: { notation: 'd4', moveNumber: 1 }, children: [
                        { fen: 'fen3', move: { notation: 'd5', moveNumber: 1 } }
                    ]
                }
            ]
        };
        const tree = new MoveTree(model);
        expect(tree.root.fen).toBe('start');
        expect(tree.root.children.length).toBe(2);
        expect(tree.root.children[1].children[0].fen).toBe('fen3');
        expect(tree.root.children[0].move.notation).toBe('e4');
    });

    it('addChild adds a child node with chess fields', () => {
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const child = root.addChild({ fen: 'fen1', move: { notation: 'e4', moveNumber: 1 }, children: [] });
        expect(root.children.length).toBe(1);
        expect(child.fen).toBe('fen1');
        expect(child.move.notation).toBe('e4');
        expect(child.parent).toBe(root);
        expect(typeof child.id).toBe('string');
    });

    it('hasChildren returns true if node has children', () => {
        const node = new MoveTreeNode({ fen: 'start', move: null, children: [{ fen: 'fen1', move: { notation: 'e4' }, children: [] }] });
        expect(node.hasChildren()).toBe(true);
        const leaf = new MoveTreeNode({ fen: 'fen2', move: { notation: 'e4' }, children: [] });
        expect(leaf.hasChildren()).toBe(false);
    });

    it('getPath returns the path from root to node', () => {
        const model = {
            fen: 'start',
            move: null,
            children: [
                { fen: 'fen1', move: { notation: 'e4' }, children: [{ fen: 'fen2', move: { notation: 'e5' } }] }
            ]
        };
        const tree = new MoveTree(model);
        const e5 = tree.root.children[0].children[0];
        const path = e5.getPath();
        expect(path.map(n => n.fen)).toEqual(['start', 'fen1', 'fen2']);
    });

    it('walk visits all nodes in the tree', () => {
        const model = {
            fen: 'start',
            move: null,
            children: [
                { fen: 'fen1', move: { notation: 'e4' } },
                { fen: 'fen2', move: { notation: 'd4' }, children: [{ fen: 'fen3', move: { notation: 'd5' } }] }
            ]
        };
        const tree = new MoveTree(model);
        const fens: string[] = [];
        tree.root.walk(node => fens.push(node.fen!));
        expect(fens).toEqual(['start', 'fen1', 'fen2', 'fen3']);
    });

    it('all returns all nodes matching predicate', () => {
        const model = {
            fen: 'start',
            move: null,
            children: [
                { fen: 'fen1', move: { notation: 'e4' } },
                { fen: 'fen2', move: { notation: 'e4' }, children: [{ fen: 'fen3', move: { notation: 'd5' } }] }
            ]
        };
        const tree = new MoveTree(model);
        const nodes = tree.root.all(node => node.move && node.move.notation === 'e4');
        expect(nodes.length).toBe(2);
        expect(nodes.every(n => n.move.notation === 'e4')).toBe(true);
    });

    it('first returns the first node matching predicate', () => {
        const model = {
            fen: 'start',
            move: null,
            children: [
                { fen: 'fen1', move: { notation: 'e4' } },
                { fen: 'fen2', move: { notation: 'e4' }, children: [{ fen: 'fen3', move: { notation: 'd5' } }] }
            ]
        };
        const tree = new MoveTree(model);
        const node = tree.root.first(n => n.move && n.move.notation === 'e4')!;
        expect(node.move.notation).toBe('e4');
        // Should be the first 'e4' in the tree
        expect(node).toBe(tree.root.children[0]);
    });

    it('generates unique ids for nodes if not provided', () => {
        const node1 = new MoveTreeNode({ fen: 'f1', move: { notation: 'a' }, children: [] });
        const node2 = new MoveTreeNode({ fen: 'f2', move: { notation: 'b' }, children: [] });
        expect(node1.id).not.toBe(node2.id);
        expect(typeof node1.id).toBe('string');
        expect(typeof node2.id).toBe('string');
    });

    it('uses provided id if given', () => {
        const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' }, id: 'custom', children: [] });
        expect(node.id).toBe('custom');
    });

    it('sets parent and isRoot correctly', () => {
        const parent = new MoveTreeNode({ fen: 'f', move: null, children: [] });
        const child = parent.addChild({ fen: 'c', move: { notation: 'b' }, children: [] });
        expect(child.parent).toBe(parent);
        expect(parent.isRoot).toBeFalsy();
        const root = new MoveTreeNode({ fen: 'root', move: null, children: [] }, null, true);
        expect(root.isRoot).toBe(true);
    });

    it('all returns empty if no match', () => {
        const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' }, children: [] });
        const result = node.all(n => n.move && n.move.notation === 'zzz');
        expect(result).toEqual([]);
    });

    it('first returns null if no match', () => {
        const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' }, children: [] });
        const result = node.first(n => n.move && n.move.notation === 'zzz');
        expect(result).toBeNull();
    });

    it('findChildByMove returns the correct child or null', () => {
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const e4 = root.addChild({ fen: 'fen1', move: { notation: 'e4', turn: 'w' }, children: [] });
        const d4 = root.addChild({ fen: 'fen2', move: { notation: 'd4', turn: 'w' }, children: [] });
        expect(root.findChildByMove({ notation: 'e4', turn: 'w' })).toBe(e4);
        expect(root.findChildByMove({ notation: 'd4', turn: 'w' })).toBe(d4);
        expect(root.findChildByMove({ notation: 'c4', turn: 'w' })).toBeNull();
        // Should match even if turn is omitted
        expect(root.findChildByMove({ notation: 'e4' })).toBe(e4);
    });

    it('isAtEndOfBranch returns true for leaf, false for non-leaf', () => {
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        expect(root.isAtEndOfBranch()).toBe(true);
        root.addChild({ fen: 'fen1', move: { notation: 'e4' }, children: [] });
        expect(root.isAtEndOfBranch()).toBe(false);
    });

    it('addMove adds a child node with correct fields', () => {
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const move = { notation: 'e4', moveNumber: 1, turn: 'w' };
        const fen = 'fen1';
        const child = root.addMove(move, fen);
        expect(child.move).toEqual(move);
        expect(child.fen).toBe(fen);
        expect(child.parent).toBe(root);
        expect(child.branchGroup).toBe(root.branchGroup);
        // Custom branchGroup
        const move2 = { notation: 'd4', moveNumber: 1, turn: 'w' };
        const child2 = root.addMove(move2, 'fen2', 42);
        expect(child2.branchGroup).toBe(42);
    });

    it('deleteNode removes the node from its parent', () => {
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const child = root.addChild({ fen: 'fen1', move: { notation: 'e4' }, children: [] });
        expect(root.children.length).toBe(1);
        child.deleteSubtree();
        expect(root.children.length).toBe(0);
    });

    it('deleteSubtree: deleting main line node before a branch removes only that node and its descendants', () => {
        // root -> e4 (main) -> e5 (main) -> Nf3 (main, to be deleted)
        //                                      ↳ Nc6 (variation, branchGroup=1)
        //                                          ↳ Bb5 (main)
        //                                          ↳ a6 (variation, branchGroup=2)
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const e4 = root.addChild({ fen: 'fen1', move: { notation: 'e4', moveNumber: 1 }, children: [] });
        const e5 = e4.addChild({ fen: 'fen2', move: { notation: 'e5', moveNumber: 1 }, children: [] });
        const Nf3 = e5.addChild({ fen: 'fen3', move: { notation: 'Nf3', moveNumber: 2 }, children: [] });
        const Nc6 = e5.addChild({ fen: 'fen4', move: { notation: 'Nc6', moveNumber: 2 }, children: [] });
        Nc6.branchGroup = 1;
        const Bb5 = Nc6.addChild({ fen: 'fen5', move: { notation: 'Bb5', moveNumber: 3 }, children: [] });
        const a6 = Nc6.addChild({ fen: 'fen6', move: { notation: 'a6', moveNumber: 3 }, children: [] });
        a6.branchGroup = 2;
        // Delete Nf3 (main line)
        Nf3.deleteSubtree();
        // e5 should have only one child: Nc6 (variation)
        expect(e5.children.length).toBe(1);
        expect(e5.children[0].move.notation).toBe('Nc6');
        // Nc6's children: Bb5 (main), a6 (variation)
        expect(e5.children[0].children.length).toBe(2);
        expect(e5.children[0].children[0].move.notation).toBe('Bb5');
        expect(e5.children[0].children[1].move.notation).toBe('a6');
    });

    it('deleteSubtree: deleting last main line node of a sub-branch removes only that node and its descendants', () => {
        // root -> e4 (main) -> e5 (main)
        //                          ↳ Nc6 (variation, branchGroup=1)
        //                              ↳ Bb5 (main, to be deleted)
        //                              ↳ a6 (variation, branchGroup=2)
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const e4 = root.addChild({ fen: 'fen1', move: { notation: 'e4', moveNumber: 1 }, children: [] });
        const e5 = e4.addChild({ fen: 'fen2', move: { notation: 'e5', moveNumber: 1 }, children: [] });
        const Nc6 = e5.addChild({ fen: 'fen3', move: { notation: 'Nc6', moveNumber: 2 }, children: [] });
        Nc6.branchGroup = 1;
        const Bb5 = Nc6.addChild({ fen: 'fen4', move: { notation: 'Bb5', moveNumber: 3 }, children: [] });
        const a6 = Nc6.addChild({ fen: 'fen5', move: { notation: 'a6', moveNumber: 3 }, children: [] });
        a6.branchGroup = 2;
        // Delete Bb5 (main line of branchGroup=1)
        Bb5.deleteSubtree();
        // Nc6 should have only one child: a6 (variation)
        expect(Nc6.children.length).toBe(1);
        expect(Nc6.children[0].move.notation).toBe('a6');
    });

    it('deleteSubtree: deleting a variation removes only that variation and its subtree', () => {
        // root -> e4 (main) -> e5 (main)
        //                          ├─ Nf3 (main)
        //                          └─ Nc6 (variation, branchGroup=1)
        const root = new MoveTreeNode({ fen: 'start', move: null, children: [] });
        const e4 = root.addChild({ fen: 'fen1', move: { notation: 'e4', moveNumber: 1 }, children: [] });
        const e5 = e4.addChild({ fen: 'fen2', move: { notation: 'e5', moveNumber: 1 }, children: [] });
        const Nf3 = e5.addChild({ fen: 'fen3', move: { notation: 'Nf3', moveNumber: 2 }, children: [] });
        const Nc6 = e5.addChild({ fen: 'fen4', move: { notation: 'Nc6', moveNumber: 2 }, children: [] });
        Nc6.branchGroup = 1;
        // Delete Nc6 (variation)
        Nc6.deleteSubtree();
        // e5 should have only one child: Nf3 (main)
        expect(e5.children.length).toBe(1);
        expect(e5.children[0].move.notation).toBe('Nf3');
        // Nc6 should be gone
        expect(e5.children.find(n => n.move.notation === 'Nc6')).toBeUndefined();
    });
});

describe('MoveTreeNode.findById', () => {
    it('finds a node by id in the tree', () => {
        const model = {
            fen: 'start',
            move: null,
            children: [
                { fen: 'fen1', move: { notation: 'e4' }, children: [] },
                { fen: 'fen2', move: { notation: 'd4' }, children: [
                    { fen: 'fen3', move: { notation: 'd5' }, children: [] }
                ] }
            ]
        };
        const tree = new MoveTree(model);
        const node1 = tree.root.children[0];
        const node3 = tree.root.children[1].children[0];
        expect(MoveTreeNode.findById(tree.root, node1.id)).toBe(node1);
        expect(MoveTreeNode.findById(tree.root, node3.id)).toBe(node3);
        expect(MoveTreeNode.findById(tree.root, 'not-an-id')).toBeNull();
    });
}); 