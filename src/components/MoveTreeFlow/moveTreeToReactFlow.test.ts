import { describe, it, expect } from 'vitest';
import { moveTreeFromPgn } from '../../lib/moveTreeFromPgn';
import { parsePgn } from '../../lib/pgnParser';
import { moveTreeToReactFlow } from './moveTreeToReactFlow';

const simplePgn = `
[Event "Simple"]
[Site "Test"]
[Date "2023.01.01"]
[White "White"]
[Black "Black"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 *
`;

const variationPgn = `
[Event "Variation"]
[Site "Test"]
[Date "2023.01.01"]
[White "White"]
[Black "Black"]
[Result "*"]

1. e4 e5 2. Nf3 (2. f4 exf4) 2... Nc6 *
`;

describe('moveTreeToReactFlow', () => {
    it('converts a simple MoveTree to React Flow nodes and edges', () => {
        const parsed = parsePgn(simplePgn)!;
        const tree = moveTreeFromPgn(parsed);
        const { nodes, edges } = moveTreeToReactFlow(tree);
        // There should be 4 nodes (e4, e5, Nf3, Nc6)
        expect(nodes.length).toBe(4);
        // There should be 3 edges (one for each move from parent)
        expect(edges.length).toBe(3);
        // Node notations should match expected
        const notations = nodes.map(n => n.data.notation);
        expect(notations).toContain('e4');
        expect(notations).toContain('e5');
        expect(notations).toContain('Nf3');
        expect(notations).toContain('Nc6');
        // All nodes and edges should have branchGroup (mainline = 0)
        for (const node of nodes) {
            expect(node.data.branchGroup).toBe(0);
        }
        for (const edge of edges) {
            expect(edge.data.branchGroup).toBe(0);
        }
    });

    it('converts a MoveTree with a variation to correct nodes and edges', () => {
        const parsed = parsePgn(variationPgn)!;
        const tree = moveTreeFromPgn(parsed);
        const { nodes, edges } = moveTreeToReactFlow(tree);
        // There should be 6 nodes: e4, e5, Nf3, Nc6, f4, exf4 (root omitted)
        expect(nodes.length).toBe(6);
        // There should be 5 edges (one for each move from parent)
        expect(edges.length).toBe(5);
        // Check that both mainline and variation moves are present
        const notations = nodes.map(n => n.data.notation);
        expect(notations).toContain('Nf3');
        expect(notations).toContain('f4');
        expect(notations).toContain('exf4');
        expect(notations).toContain('Nc6');
        // Mainline nodes/edges should have branchGroup 0, variation nodes/edges should have >0
        const mainlineNodes = nodes.filter(n => n.data.notation === 'Nf3' || n.data.notation === 'Nc6');
        for (const node of mainlineNodes) {
            expect(node.data.branchGroup).toBe(0);
        }
        const variationNodes = nodes.filter(n => n.data.notation === 'f4' || n.data.notation === 'exf4');
        for (const node of variationNodes) {
            expect(node.data.branchGroup).toBeGreaterThan(0);
        }
        for (const edge of edges) {
            if (variationNodes.map(n => n.id).includes(edge.target)) {
                expect(edge.data.branchGroup).toBeGreaterThan(0);
            } else {
                expect(edge.data.branchGroup).toBe(0);
            }
        }
    });

    it('skips the root node (move: null) in the output nodes', () => {
        const parsed = parsePgn(simplePgn)!;
        const tree = moveTreeFromPgn(parsed);
        const { nodes } = moveTreeToReactFlow(tree);
        // The root node's id should not be present in the output nodes
        const nodeIds = nodes.map(n => n.id);
        expect(nodeIds).not.toContain(tree.root.id);
    });
}); 