// Minimal TreeModel.js core logic, adapted for local use
// Source: https://github.com/joaonuno/tree-model-js/blob/master/index.js

let moveTreeNodeId = 0;
function generateMoveTreeNodeId() {
    return `node_${moveTreeNodeId++}`;
}

class MoveTreeNode {
    constructor(model, parent = null, isRoot = false) {
        // Chess-specific fields
        this.fen = model.fen || null;
        this.move = model.move || null; // {notation, moveNumber, annotations, etc.}
        this.id = (model.id == null) ? generateMoveTreeNodeId() : model.id;        this.parent = parent;
        this.isRoot = isRoot;
        // Children (variations or next moves)
        this.children = (model.children || []).map(child => new MoveTreeNode(child, this));
    }

    hasChildren() {
        return this.children && this.children.length > 0;
    }

    addChild(childModel) {
        const childNode = new MoveTreeNode(childModel, this);
        this.children.push(childNode);
        return childNode;
    }

    getPath() {
        const path = [];
        let node = this;
        while (node) {
            path.unshift(node);
            node = node.parent;
        }
        return path;
    }

    walk(action) {
        action(this);
        this.children.forEach(child => child.walk(action));
    }

    all(predicate) {
        const matches = [];
        this.walk(node => {
            if (predicate(node)) matches.push(node);
        });
        return matches;
    }

    first(predicate) {
        let found = null;
        this.walk(node => {
            if (!found && predicate(node)) found = node;
        });
        return found;
    }
}

class MoveTree {
    constructor(model) {
        this.root = new MoveTreeNode(model, null, true);
    }
}

export { MoveTree, MoveTreeNode }; 