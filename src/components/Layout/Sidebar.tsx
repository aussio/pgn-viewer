import React from 'react';
import { useMoveTreeStore } from '../../lib/store';
import type { MoveTreeNode } from '../../lib/MoveTree';
import styles from './Sidebar.module.css';

/**
 * Sidebar
 *
 * Displays chapters/branches navigation based on the move tree, showing one chapter per branch group (using the store selector).
 * Bolds the chapter whose branchGroup matches the current node.
 * Clicking a chapter sets the current node to the head of that branch.
 * Nests sub-branches (variations) under their parent branches.
 * Only displays branch heads (chapter nodes), not all moves.
 */
const Sidebar: React.FC = () => {
  const getBranchGroupChapters = useMoveTreeStore(state => state.getBranchGroupChapters);
  const currentNode = useMoveTreeStore(state => state.currentNode);
  const setCurrentNode = useMoveTreeStore(state => state.setCurrentNode);
  const chaptersMap = getBranchGroupChapters();

  // Build a map of branchGroup -> array of child branchGroups
  const parentToChildren = new Map<number, number[]>();
  chaptersMap.forEach((node, branchGroup) => {
    const parentBranchGroup = node.parent && node.parent.branchGroup !== undefined ? node.parent.branchGroup : null;
    if (parentBranchGroup !== null && parentBranchGroup !== branchGroup) {
      if (!parentToChildren.has(parentBranchGroup)) parentToChildren.set(parentBranchGroup, []);
      parentToChildren.get(parentBranchGroup)!.push(branchGroup);
    }
  });

  // Recursively render branch heads, nesting sub-branches
  const renderBranch = (branchGroup: number, isMainLine = false): React.ReactNode => {
    const node = chaptersMap.get(branchGroup);
    if (!node) return null;
    const children = parentToChildren.get(branchGroup) || [];
    return (
      <li
        key={node.id}
        onClick={() => setCurrentNode(node)}
        className={isMainLine ? `${styles.chapterItem} ${styles.mainChapterItem}` : styles.chapterItem}
        data-testid={`sidebar-branch-${branchGroup}`}
      >
        {currentNode && currentNode.branchGroup === branchGroup ? (
          <strong>
            {isMainLine
              ? `Main Line: ${node.move?.notation || '(start)'}`
              : `Variation ${branchGroup}: ${node.move?.notation || '(?)'}`}
          </strong>
        ) : (
          isMainLine
            ? `Main Line: ${node.move?.notation || '(start)'}`
            : `Variation ${branchGroup}: ${node.move?.notation || '(?)'}`
        )}
        {children.length > 0 && (
          <ul>
            {children.map(childBranchGroup => renderBranch(childBranchGroup, false))}
          </ul>
        )}
      </li>
    );
  };

  // Find all top-level branches (those whose parent is not a branch head)
  const topLevelBranchGroups = Array.from(chaptersMap.entries())
    .filter(([branchGroup, node]) => {
      const parentBranchGroup = node.parent && node.parent.branchGroup !== undefined ? node.parent.branchGroup : null;
      return parentBranchGroup === null || !chaptersMap.has(parentBranchGroup);
    })
    .map(([branchGroup]) => branchGroup)
    .sort((a, b) => a - b);

  if (topLevelBranchGroups.length === 0) return null;

  return (
    <nav data-testid="sidebar">
      <h2>Chapters</h2>
      <ul className={styles.sidebarList}>
        {topLevelBranchGroups.map((branchGroup, idx) => renderBranch(branchGroup, idx === 0))}
      </ul>
    </nav>
  );
};

export default Sidebar; 