import React from 'react';
import { useMoveTreeStore } from '../../lib/store';

/**
 * Sidebar
 *
 * Displays chapters/branches navigation based on the move tree, showing one chapter per branch group (using the store selector).
 * Bolds the chapter whose branchGroup matches the current node.
 */
const Sidebar: React.FC = () => {
  const getBranchGroupChapters = useMoveTreeStore(state => state.getBranchGroupChapters);
  const currentNode = useMoveTreeStore(state => state.currentNode);
  const chaptersMap = getBranchGroupChapters();
  const chapters = Array.from(chaptersMap.entries()).sort((a, b) => a[0] - b[0]);
  return (
    <nav data-testid="sidebar">
      <ul>
        <li><strong>Chapters</strong></li>
        {chapters.map(([branchGroup, node]) => (
          <li key={node.id}>
            {currentNode && currentNode.branchGroup === branchGroup ? (
              <strong>
                {branchGroup === 0
                  ? `Main Line: ${node.move?.notation || '(start)'}`
                  : `Variation ${branchGroup}: ${node.move?.notation || '(?)'}`}
              </strong>
            ) : (
              branchGroup === 0
                ? `Main Line: ${node.move?.notation || '(start)'}`
                : `Variation ${branchGroup}: ${node.move?.notation || '(?)'}`
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar; 