import React from 'react';
import type { FC } from 'react';
import { ReactFlow, Controls, getSmoothStepPath, Handle, Position, Edge } from '@xyflow/react';
import { moveTreeToReactFlow } from './moveTreeToReactFlow';
import styles from './MoveTreeFlow.module.css';
import type { EdgeProps } from '@xyflow/react';
import type { MoveTree } from '../../lib/MoveTree';
import { useMoveTreeStore } from '../../lib/store';

/**
 * MoveTreeFlow
 *
 * Visualizes a chess move tree using React Flow. Each move is a node, and variations are colored edges.
 *
 * Props:
 *   moveTree: MoveTree - The move tree data structure to visualize (from lib/MoveTree).
 *   selectedNodeId?: string - The ID of the selected node.
 *   onNodeSelect?: (id: string) => void - Optional function to call when a node is clicked.
 *
 * Usage:
 *   <MoveTreeFlow moveTree={moveTree} />
 */
interface MoveTreeFlowProps {
  moveTree: MoveTree;
  selectedNodeId?: string;
  onNodeSelect?: (id: string) => void;
}

// Map piece notation to SVG filenames
const pieceMap: Record<string, string> = {
  K: 'K', Q: 'Q', R: 'R', B: 'B', N: 'N', P: 'P',
};

/**
 * getPieceType
 *
 * Returns the piece type (K, Q, R, B, N, P) from a move notation string.
 * Defaults to 'P' (pawn) if not found.
 */
function getPieceType(notation: string | null): string {
  if (!notation) return 'P'; // Default to pawn
  const first = notation[0];
  return pieceMap[first] ? first : 'P';
}

/**
 * getToSquare
 *
 * Extracts the destination square (e.g., 'e4', 'f3') from a move notation string.
 * Returns '' if not found.
 */
function getToSquare(notation: string | null): string {
  if (!notation) return '';
  // e.g. e4, Nf3, exd5, Qxe5, etc. Find last two letters that are a square
  const match = notation.match(/[a-h][1-8]$/);
  return match ? match[0] : '';
}

/**
 * ChessMoveNode
 *
 * Custom node component for React Flow representing a chess move.
 * Shows the piece, destination square, and uses SVGs for piece icons.
 *
 * Props:
 *   data: { notation, turn, ... } - Node data from moveTreeToReactFlow.
 *   selected?: boolean - Indicates if the node is selected.
 */
const ChessMoveNode: FC<{ data: any; selected?: boolean }> = ({ data, selected }) => {
  const { notation, turn } = data;
  const piece = getPieceType(notation);
  const color = turn === 'w' ? 'w' : 'b';
  const toSquare = getToSquare(notation);
  // Use import.meta.glob for Vite to import all SVGs
  const svgs = React.useMemo(() => {
    // Fix for Vite import.meta.glob type error
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const all = import.meta.glob('/src/assets/pieces/*.svg', { eager: true }) as Record<string, { default: string }>;
    const map: Record<string, string> = {};
    Object.keys(all).forEach((path) => {
      const file = path.split('/').pop()?.replace('.svg', '');
      if (file) map[file] = all[path].default;
    });
    return map;
  }, []);
  const svgSrc = svgs[`${color}${piece}`];
  return (
    <div className={selected ? `${styles.chessMoveNode} ${styles['chessMoveNode--selected']}` : styles.chessMoveNode}>
      {/* Target handle for incoming edges (invisible, non-interactive) */}
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} isConnectable={false} />
      {svgSrc && <img src={svgSrc} alt={piece} className={styles.chessMoveNode__piece} />}
      <span className={styles.chessMoveNode__square}>{toSquare}</span>
      {/* Source handle for outgoing edges (invisible, non-interactive) */}
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} isConnectable={false} />
    </div>
  );
};

const nodeTypes = { chessMove: ChessMoveNode };

/**
 * labelEdge
 *
 * Returns a label for an edge based on its variation index.
 * Mainline edges have no label; variations are labeled 'Var N'.
 */
function labelEdge(edge: Edge): string {
  const idx = edge.data?.variationIndex ?? 0;
  return idx === 0 ? '' : `Var ${idx}`;
}

const variationColors = [
  '#e53935', // bright red
  '#43a047', // green
  '#fb8c00', // orange
  '#8e24aa', // purple
  '#00bcd4', // cyan
  '#fbc02d', // yellow
  '#d81b60', // magenta/pink
  '#039be5', // light blue
  '#ffb300', // vivid yellow-orange
  '#8e24aa', // violet
  '#00acc1', // teal
  '#c62828', // strong red
];

/**
 * ChessEdge
 *
 * Custom edge component for React Flow representing a chess move connection.
 * Colors edges by variation group for clarity.
 *
 * Props:
 *   id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data - React Flow edge props.
 */
const ChessEdge: FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) => {
  const group = data?.branchGroup ?? 0;
  const style = group === 0
    ? { stroke: '#111', strokeWidth: 3 }
    : { stroke: variationColors[(Math.abs(hashCode(group.toString()))) % variationColors.length], strokeWidth: 3 };
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <g>
      <path
        id={id}
        d={edgePath}
        fill="none"
        style={style}
      />
    </g>
  );
};

/**
 * hashCode
 *
 * Simple hash function for deterministic color assignment to variation groups.
 * Returns a 32-bit integer hash for a string.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const edgeTypes = { chessEdge: ChessEdge };

const MoveTreeFlow: FC<MoveTreeFlowProps> = ({ moveTree, selectedNodeId, onNodeSelect }) => {
  const deleteNodeAndDescendants = useMoveTreeStore(state => state.deleteNodeAndDescendants);
  const rootId = moveTree.root.id;
  const [nodeToDelete, setNodeToDelete] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  if (!moveTree) return <div>No move tree to display.</div>;
  // Patch moveTreeToReactFlow to use 'chessMove' as node type and style edges
  const { nodes, edges } = moveTreeToReactFlow(moveTree);
  nodes.forEach(n => n.type = 'chessMove');
  edges.forEach(e => {
    e.type = 'chessEdge';
    e.label = labelEdge(e);
  });

  // Use React Flow's selection mechanism
  const nodesWithSelection = nodes.map(n =>
    n.id === selectedNodeId ? { ...n, selected: true } : { ...n, selected: false }
  );

  // Handle node click
  const handleNodeClick = React.useCallback((event: React.MouseEvent, node: any) => {
    if (onNodeSelect) onNodeSelect(node.id);
  }, [onNodeSelect]);

  // Handle right-click (context menu) on node
  const handleNodeContextMenu = React.useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();
    if (node.id !== rootId) {
      setNodeToDelete(node.id);
      setShowModal(true);
    }
  }, [rootId]);

  // Modal confirm/cancel handlers
  const handleConfirmDelete = () => {
    if (nodeToDelete) {
      deleteNodeAndDescendants(nodeToDelete);
    }
    setShowModal(false);
    setNodeToDelete(null);
  };
  const handleCancelDelete = () => {
    setShowModal(false);
    setNodeToDelete(null);
  };

  return (
    <div className={styles.container}>
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: .25 }}
        style={{ width: '100%', height: '100%' }}
        onNodeClick={handleNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
      >
        <Controls className={styles['react-flow__controls']} />
      </ReactFlow>
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            <h3>Delete this node and all its descendants?</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 16 }}>
              <button onClick={handleCancelDelete}>Cancel</button>
              <button onClick={handleConfirmDelete} style={{ background: '#e53935', color: 'white' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoveTreeFlow; 