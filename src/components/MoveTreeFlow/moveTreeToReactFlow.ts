// Utility to convert MoveTree to React Flow nodes and edges
// Assumes MoveTree and MoveTreeNode as implemented in this project

/**
 * moveTreeToReactFlow
 *
 * Converts a MoveTree (from lib/MoveTree) into React Flow nodes and edges for visualization.
 * Skips the root node (move: null) and only includes actual moves.
 *
 * Parameters:
 *   moveTree: MoveTree - The move tree data structure to convert.
 *
 * Returns:
 *   { nodes: Array, edges: Array } - Arrays of React Flow nodes and edges.
 */
export function moveTreeToReactFlow(moveTree: any): { nodes: any[]; edges: any[] } {
    const nodes: any[] = [];
    const edges: any[] = [];
    const NODE_WIDTH = 80;
    const NODE_HEIGHT = 80;
    const X_SPACING = 180;
    const Y_SPACING = 90;

    // Recursive layout: returns [nextY, centerY] for this node
    function traverse(
        node: any,
        parentId: string | null = null,
        depth: number = 0,
        variationIndex: number = 0,
        y: number = 0
    ): [number, number] {
        let myY: number = y;
        let childYs: number[] = [];
        let nextY: number = y;
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const [newNextY, childCenterY]: [number, number] = traverse(child, node.id, depth + 1, i, nextY);
            childYs.push(childCenterY);
            nextY = newNextY;
        }
        // Position this node at the center of its children, or at y if leaf
        if (childYs.length > 0) {
            myY = childYs.reduce((a, b) => a + b, 0) / childYs.length;
        }
        const id = node.id;
        nodes.push({
            id,
            position: { x: depth * X_SPACING, y: myY * Y_SPACING },
            data: {
                notation: node.move?.notation,
                fen: node.fen,
                moveNumber: node.move?.moveNumber,
                annotations: node.move?.annotations,
                nag: node.move?.nag,
                turn: node.move?.turn,
                branchGroup: node.branchGroup,
            },
            type: 'default',
        });
        if (parentId) {
            edges.push({
                id: `${parentId}-${id}`,
                source: parentId,
                target: id,
                data: { branchGroup: node.branchGroup },
            });
        }
        return [nextY === y ? y + 1 : nextY, myY];
    }

    // Traverse from root, but skip adding the root node itself to nodes/edges
    function traverseWithHiddenRoot(
        node: any,
        parentId: string | null = null,
        depth: number = 0,
        variationIndex: number = 0,
        y: number = 0
    ): [number, number] {
        // If this is the root node (no move), don't add it, but traverse its children
        if (!node.move) {
            let nextY: number = y;
            let childYs: number[] = [];
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const [newNextY, childCenterY]: [number, number] = traverseWithHiddenRoot(child, null, 0, i, nextY);
                childYs.push(childCenterY);
                nextY = newNextY;
            }
            return [nextY === y ? y + 1 : nextY, childYs.length > 0 ? childYs.reduce((a, b) => a + b, 0) / childYs.length : y];
        } else {
            return traverse(node, parentId, depth, variationIndex, y);
        }
    }

    traverseWithHiddenRoot(moveTree.root);
    return { nodes, edges };
} 