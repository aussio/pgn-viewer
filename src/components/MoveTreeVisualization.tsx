import MoveTreeFlow from './MoveTreeFlow/MoveTreeFlow'
import type { FC } from 'react';
import { MoveTree } from '../lib/MoveTree';

interface MoveTreeVisualizationProps {
  moveTree: MoveTree | null;
  selectedNodeId?: string;
  onNodeSelect?: (nodeId: string) => void;
}

const MoveTreeVisualization: FC<MoveTreeVisualizationProps> = ({ moveTree, selectedNodeId, onNodeSelect }) => {
  if (!moveTree) return null;
  return (
    <div>
      <MoveTreeFlow moveTree={moveTree} selectedNodeId={selectedNodeId} onNodeSelect={onNodeSelect} />
    </div>
  );
};

export default MoveTreeVisualization; 