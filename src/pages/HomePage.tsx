import type { FC } from 'react'
import { useState } from 'react'
import styles from '../App.module.css'
import PGNInput from '../components/PGNInput'
import MoveTreeVisualization from '../components/MoveTreeVisualization'
import { moveTreeFromPgn } from '../lib/moveTreeFromPgn'
import type { ParseTree } from '../types/pgn'

/**
 * HomePage
 *
 * Main page for the PGN Viewer app. Handles PGN input and move tree visualization.
 * @returns {JSX.Element} The rendered home page.
 */
const HomePage: FC = () => {
  const [parsed, setParsed] = useState<ParseTree | null>(null)

  let moveTree = null
  if (parsed) {
    try {
      moveTree = moveTreeFromPgn(parsed)
    } catch {
      // Do nothing, moveTree remains null
    }
  }

  return (
    <div className={styles.app}>
      <h1>PGN Viewer</h1>
      <PGNInput
        parsed={parsed}
        setParsed={setParsed}
      />
      <MoveTreeVisualization moveTree={moveTree} />
    </div>
  )
}

export default HomePage 