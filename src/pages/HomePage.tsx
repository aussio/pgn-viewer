import React from 'react'
import type { FC } from 'react'
import BookLayout from '../components/Layout/BookLayout'
import Sidebar from '../components/Layout/Sidebar'
import Breadcrumbs from '../components/Layout/Breadcrumbs'
import Chessboard from '../components/Chessboard/Chessboard'
import { useMoveTreeStore } from '../lib/store'
import PGNInput from '../components/PGNInput'
import MoveTreeVisualization from '../components/MoveTreeVisualization'
import { moveTreeFromPgn } from '../lib/moveTreeFromPgn'
import styles from './HomePage.module.css'

/**
 * HomePage
 *
 * Main page for the PGN Viewer app. Handles PGN input, move tree visualization, and board stepping.
 * @returns {JSX.Element} The rendered home page.
 */
const HomePage: FC = () => {
  const parsed = useMoveTreeStore(state => state.parsed)
  const moveTree = useMoveTreeStore(state => state.moveTree)
  const setMoveTree = useMoveTreeStore(state => state.setMoveTree)
  const currentNode = useMoveTreeStore(state => state.currentNode)
  const setCurrentNode = useMoveTreeStore(state => state.setCurrentNode)

  // Update moveTree and reset currentNode when parsed changes
  React.useEffect(() => {
    if (parsed) {
      try {
        const tree = moveTreeFromPgn(parsed)
        setMoveTree(tree)
        setCurrentNode(tree.root)
      } catch {
        setMoveTree(null)
        setCurrentNode(null)
      }
    } else {
      setMoveTree(null)
      setCurrentNode(null)
    }
  }, [parsed, setMoveTree, setCurrentNode])

  // Step to next move (mainline only for now)
  function goNext() {
    if (currentNode && currentNode.children.length > 0) {
      setCurrentNode(currentNode.children[0])
    }
  }
  // Step to previous move
  function goPrev() {
    if (currentNode && currentNode.parent) {
      setCurrentNode(currentNode.parent)
    }
  }

  // Keyboard navigation: left/right arrows for prev/next
  React.useEffect(() => {
    /**
     * Handles left/right arrow key navigation for move stepping.
     * @param {KeyboardEvent} e - The keyboard event
     */
    function handleKeyDown(e: KeyboardEvent) {
      if (!moveTree || !currentNode) return;
      if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moveTree, currentNode]);

  return (
    <BookLayout sidebar={<Sidebar />} breadcrumbs={<Breadcrumbs />}>
      <h1>PGN Viewer</h1>
      <PGNInput />
      {/* Placeholder for top-level buttons if needed */}
      <div className={styles.chessboardSection}>
        <Chessboard />
      </div>
      <div className={styles.controls}>
        <button onClick={goPrev} disabled={!currentNode?.parent}>Previous</button>
        <button onClick={goNext} disabled={!currentNode || currentNode.children.length === 0}>Next</button>
      </div>
      <div className={styles.moveTreeSection}>
        <MoveTreeVisualization />
      </div>
    </BookLayout>
  )
}

export default HomePage 