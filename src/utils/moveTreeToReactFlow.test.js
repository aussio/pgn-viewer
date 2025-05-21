import { describe, it, expect } from 'vitest';
import { MoveTree } from '../MoveTree';
import { moveTreeToReactFlow } from './moveTreeToReactFlow';

// Simple tree: 1. e4 e5 2. Nf3 Nc6
const simpleModel = {
    fen: 'start',
    move: null,
    children: [
        {
            fen: 'fen1', move: { notation: 'e4', moveNumber: 1, turn: 'w' }, children: [
                {
                    fen: 'fen2', move: { notation: 'e5', moveNumber: null, turn: 'b' }, children: [
                        {
                            fen: 'fen3', move: { notation: 'Nf3', moveNumber: 2, turn: 'w' }, children: [
                                { fen: 'fen4', move: { notation: 'Nc6', moveNumber: null, turn: 'b' }, children: [] }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

// Tree with variation: 1. e4 e5 2. Nf3 (2. f4 exf4) 2... Nc6
const variationModel = {
    fen: 'start',
    move: null,
    children: [
        {
            fen: 'fen1', move: { notation: 'e4', moveNumber: 1, turn: 'w' }, children: [
                {
                    fen: 'fen2', move: { notation: 'e5', moveNumber: null, turn: 'b' }, children: [
                        // Mainline: Nf3
                        {
                            fen: 'fen3', move: { notation: 'Nf3', moveNumber: 2, turn: 'w' }, children: [
                                { fen: 'fen4', move: { notation: 'Nc6', moveNumber: null, turn: 'b' }, children: [] }
                            ]
                        },
                        // Variation: f4 exf4 (as a sibling at this ply)
                        {
                            fen: 'fen5', move: { notation: 'f4', moveNumber: 2, turn: 'w' }, children: [
                                { fen: 'fen6', move: { notation: 'exf4', moveNumber: null, turn: 'b' }, children: [] }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

describe('moveTreeToReactFlow', () => {
    it('converts a simple MoveTree to React Flow nodes and edges', () => {
        const tree = new MoveTree(simpleModel);
        const { nodes, edges } = moveTreeToReactFlow(tree);
        // There should be 5 nodes (root + 4 moves)
        expect(nodes.length).toBe(5);
        // There should be 4 edges (one for each move from parent)
        expect(edges.length).toBe(4);
        // Node ids should match tree node ids
        const nodeIds = nodes.map(n => n.id);
        expect(nodeIds).toContain(tree.root.id);
        expect(nodeIds).toContain(tree.root.children[0].id);
        expect(nodeIds).toContain(tree.root.children[0].children[0].id);
        expect(nodeIds).toContain(tree.root.children[0].children[0].children[0].id);
        expect(nodeIds).toContain(tree.root.children[0].children[0].children[0].children[0].id);
        // Edge sources/targets should match parent/child ids
        for (const edge of edges) {
            expect(nodeIds).toContain(edge.source);
            expect(nodeIds).toContain(edge.target);
        }
    });

    it('converts a MoveTree with a variation to correct nodes and edges', () => {
        const tree = new MoveTree(variationModel);
        const { nodes, edges } = moveTreeToReactFlow(tree);
        // There should be 7 nodes: root, e4, e5, Nf3, Nc6, f4, exf4
        expect(nodes.length).toBe(7);
        // There should be 6 edges (one for each move from parent)
        expect(edges.length).toBe(6);
        // Check that both mainline and variation moves are present
        const notations = nodes.map(n => n.data.notation);
        expect(notations).toContain('Nf3');
        expect(notations).toContain('f4');
        expect(notations).toContain('exf4');
        expect(notations).toContain('Nc6');
        // Check that edges connect correct parent/child
        for (const edge of edges) {
            expect(nodes.map(n => n.id)).toContain(edge.source);
            expect(nodes.map(n => n.id)).toContain(edge.target);
        }
    });
}); 