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
export function moveTreeToReactFlow(moveTree) {
    const nodes = [];
    const edges = [];
    const NODE_WIDTH = 80;
    const NODE_HEIGHT = 80;
    const X_SPACING = 180;
    const Y_SPACING = 90;

    // Recursive layout: returns [nextY, centerY] for this node
    // variationGroup: 0 for mainline, unique for each variation branch
    function traverse(node, parentId = null, depth = 0, variationIndex = 0, y = 0, variationGroup = 0) {
        let myY = y;
        let childYs = [];
        let nextY = y;
        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            // For mainline, keep parent's variationGroup; for variations, use their own index
            const childVariationGroup = (i === 0) ? variationGroup : child.id || `${parentId}-var${i}`;
            const [newNextY, childCenterY] = traverse(child, node.id, depth + 1, i, nextY, childVariationGroup);
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
            },
            type: 'default',
        });
        if (parentId) {
            edges.push({
                id: `${parentId}-${id}`,
                source: parentId,
                target: id,
                data: { variationIndex, variationGroup },
            });
        }
        return [nextY === y ? y + 1 : nextY, myY];
    }

    // Traverse from root, but skip adding the root node itself to nodes/edges
    function traverseWithHiddenRoot(node, parentId = null, depth = 0, variationIndex = 0, y = 0, variationGroup = 0) {
        // If this is the root node (no move), don't add it, but traverse its children
        if (!node.move) {
            let nextY = y;
            let childYs = [];
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i];
                const childVariationGroup = (i === 0) ? variationGroup : child.id || `root-var${i}`;
                const [newNextY, childCenterY] = traverseWithHiddenRoot(child, null, 0, i, nextY, childVariationGroup);
                childYs.push(childCenterY);
                nextY = newNextY;
            }
            return [nextY === y ? y + 1 : nextY, childYs.length > 0 ? childYs.reduce((a, b) => a + b, 0) / childYs.length : y];
        } else {
            return traverse(node, parentId, depth, variationIndex, y, variationGroup);
        }
    }

    traverseWithHiddenRoot(moveTree.root);
    return { nodes, edges };
} 