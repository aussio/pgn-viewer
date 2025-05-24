import MoveTreeFlow from './MoveTreeFlow/MoveTreeFlow'
import type { FC } from 'react';
import { MoveTree } from '../lib/MoveTree';

interface MoveTreeVisualizationProps {
  moveTree: MoveTree | null;
  selectedNodeId?: string;
}

const MoveTreeVisualization: FC<MoveTreeVisualizationProps> = ({ moveTree, selectedNodeId }) => {
  if (!moveTree) return null;
  return (
    <div>
      <MoveTreeFlow moveTree={moveTree} selectedNodeId={selectedNodeId} />
    </div>
  );
};

export default MoveTreeVisualization; 