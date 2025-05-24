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