import React from 'react';
import MoveTreeFlow from './MoveTreeFlow/MoveTreeFlow'
import type { FC } from 'react';
import { MoveTree, MoveTreeNode } from '../lib/MoveTree';
import { useMoveTreeStore } from '../lib/store'

function handleNodeSelect(
  nodeId: string,
  moveTree: MoveTree | null,
  setCurrentNode: (node: MoveTreeNode) => void
): void {
  if (!moveTree) return;
  const newNode = MoveTreeNode.findById(moveTree.root, nodeId);
  if (!newNode) return;
  setCurrentNode(newNode);
}

const MoveTreeVisualization: FC = () => {
  const moveTree = useMoveTreeStore(state => state.moveTree)
  const currentNode = useMoveTreeStore(state => state.currentNode)
  const setCurrentNode = useMoveTreeStore(state => state.setCurrentNode)
  if (!moveTree) return null;
  return (
    <div>
      <MoveTreeFlow
        moveTree={moveTree}
        selectedNodeId={currentNode?.id}
        onNodeSelect={nodeId => handleNodeSelect(nodeId, moveTree, setCurrentNode)}
      />
    </div>
  );
};

export default MoveTreeVisualization; 