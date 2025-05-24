import MoveTreeFlow from './MoveTreeFlow/MoveTreeFlow'
import type { FC } from 'react';
import { MoveTree } from '../lib/MoveTree';

interface MoveTreeVisualizationProps {
  moveTree: MoveTree | null;
}

const MoveTreeVisualization: FC<MoveTreeVisualizationProps> = ({ moveTree }) => {
  if (!moveTree) return null;
  return (
    <div>
      <MoveTreeFlow moveTree={moveTree} />
    </div>
  );
};

export default MoveTreeVisualization; 