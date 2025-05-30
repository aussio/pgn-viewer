// Minimal TreeModel.js core logic, adapted for local use
// Source: https://github.com/joaonuno/tree-model-js/blob/master/index.js

/**
 * @internal
 * Only for use in MoveTree construction and serialization. Do not use in app logic or UI.
 */
export type _MoveTreeNodeModel = {
    fen: string | null;
    move: any;
    children: _MoveTreeNodeModel[];
    id?: string;
    branchGroup?: number;
};

/**
 * Represents a node in the move tree for chess games.
 */
class MoveTreeNode {
    fen: string | null;
    move: any;
    id: string;
    parent: MoveTreeNode | null;
    isRoot: boolean;
    children: MoveTreeNode[];
    branchGroup: number;

    constructor(model: _MoveTreeNodeModel, parent: MoveTreeNode | null = null, isRoot: boolean = false) {
        // Chess-specific fields
        this.fen = model.fen || null;
        this.move = model.move || null; // {notation, moveNumber, annotations, etc.}
        this.id = (model.id == null) ? generateMoveTreeNodeId() : model.id;
        this.parent = parent;
        this.isRoot = isRoot;
        this.branchGroup = model.branchGroup ?? 0;
        // Children (variations or next moves)
        this.children = (model.children || []).map((child: any) => new MoveTreeNode(child, this));
    }

    hasChildren(): boolean {
        return this.children && this.children.length > 0;
    }

    addChild(childModel: any): MoveTreeNode {
        const childNode = new MoveTreeNode(childModel, this);
        this.children.push(childNode);
        return childNode;
    }

    getPath(): MoveTreeNode[] {
        const path = [];
        let node: MoveTreeNode | null = this;
        while (node) {
            path.unshift(node);
            node = node.parent;
        }
        return path;
    }

    walk(action: (node: MoveTreeNode) => void): void {
        action(this);
        this.children.forEach(child => child.walk(action));
    }

    all(predicate: (node: MoveTreeNode) => boolean): MoveTreeNode[] {
        const matches: MoveTreeNode[] = [];
        this.walk(node => {
            if (predicate(node)) matches.push(node);
        });
        return matches;
    }

    first(predicate: (node: MoveTreeNode) => boolean): MoveTreeNode | null {
        let found: MoveTreeNode | null = null;
        this.walk(node => {
            if (!found && predicate(node)) found = node;
        });
        return found;
    }

    /**
     * Recursively find a node by id in the move tree.
     * @param node The root node to search from
     * @param nodeId The id to search for
     * @returns The found node or null
     */
    static findById(node: MoveTreeNode, nodeId: string): MoveTreeNode | null {
        if (node.id === nodeId) return node;
        for (const child of node.children) {
            const found = MoveTreeNode.findById(child, nodeId);
            if (found) return found;
        }
        return null;
    }

    /**
     * Find a direct child node matching the given move (by notation and turn).
     * @param move The move object to match (should have notation and turn)
     * @returns The child node if found, else null
     */
    findChildByMove(move: { notation: string; turn?: string }): MoveTreeNode | null {
        return this.children.find(child =>
            child.move &&
            child.move.notation === move.notation &&
            (move.turn === undefined || child.move.turn === move.turn)
        ) || null;
    }

    /**
     * Returns true if this node is at the end of its branch (no children).
     */
    isAtEndOfBranch(): boolean {
        return this.children.length === 0;
    }

    /**
     * Add a move as a child node. If branchGroup is provided, use it; otherwise inherit from this node.
     * @param move The move object (should have notation, moveNumber, etc.)
     * @param fen The resulting FEN after the move
     * @param branchGroup Optional branch group for variations
     * @returns The new child node
     */
    addMove(move: any, fen: string, branchGroup?: number): MoveTreeNode {
        const childModel = {
            fen,
            move,
            children: [],
            branchGroup: branchGroup ?? this.branchGroup,
        };
        return this.addChild(childModel);
    }

    /**
     * (Stub) Delete this node from its parent. For future use.
     */
    deleteNode(): void {
        if (!this.parent) return;
        const idx = this.parent.children.indexOf(this);
        if (idx !== -1) this.parent.children.splice(idx, 1);
        // Optionally: clean up references, etc.
    }
}

let moveTreeNodeId = 0;
function generateMoveTreeNodeId(): string {
    return `node_${moveTreeNodeId++}`;
}

/**
 * Represents the move tree for a chess game.
 */
class MoveTree {
    root: MoveTreeNode;
    constructor(model: any) {
        this.root = new MoveTreeNode(model, null, true);
    }
}

export { MoveTree, MoveTreeNode }; 