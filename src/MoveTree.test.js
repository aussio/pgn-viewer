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
        const root = new MoveTreeNode({ fen: 'start', move: null });
        const child = root.addChild({ fen: 'fen1', move: { notation: 'e4', moveNumber: 1 } });
        expect(root.children.length).toBe(1);
        expect(child.fen).toBe('fen1');
        expect(child.move.notation).toBe('e4');
        expect(child.parent).toBe(root);
        expect(typeof child.id).toBe('string');
    });

    it('hasChildren returns true if node has children', () => {
        const node = new MoveTreeNode({ fen: 'start', move: null, children: [{ fen: 'fen1', move: { notation: 'e4' } }] });
        expect(node.hasChildren()).toBe(true);
        const leaf = new MoveTreeNode({ fen: 'fen2', move: { notation: 'e4' } });
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
        const fens = [];
        tree.root.walk(node => fens.push(node.fen));
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
        const node = tree.root.first(n => n.move && n.move.notation === 'e4');
        expect(node.move.notation).toBe('e4');
        // Should be the first 'e4' in the tree
        expect(node).toBe(tree.root.children[0]);
    });

    it('generates unique ids for nodes if not provided', () => {
        const node1 = new MoveTreeNode({ fen: 'f1', move: { notation: 'a' } });
        const node2 = new MoveTreeNode({ fen: 'f2', move: { notation: 'b' } });
        expect(node1.id).not.toBe(node2.id);
        expect(typeof node1.id).toBe('string');
        expect(typeof node2.id).toBe('string');
    });

    it('uses provided id if given', () => {
        const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' }, id: 'custom' });
        expect(node.id).toBe('custom');
    });

    it('sets parent and isRoot correctly', () => {
        const parent = new MoveTreeNode({ fen: 'f', move: null });
        const child = parent.addChild({ fen: 'c', move: { notation: 'b' } });
        expect(child.parent).toBe(parent);
        expect(parent.isRoot).toBeFalsy();
        const root = new MoveTreeNode({ fen: 'root', move: null }, null, true);
        expect(root.isRoot).toBe(true);
    });

    it('all returns empty if no match', () => {
        const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' } });
        const result = node.all(n => n.move && n.move.notation === 'zzz');
        expect(result).toEqual([]);
    });

    it('first returns null if no match', () => {
        const node = new MoveTreeNode({ fen: 'f', move: { notation: 'a' } });
        const result = node.first(n => n.move && n.move.notation === 'zzz');
        expect(result).toBeNull();
    });
}); 