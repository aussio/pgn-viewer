import { useState } from 'react'
import styles from '../App.module.css'
import PGNInput from '../components/PGNInput'
import MoveTreeVisualization from '../components/MoveTreeVisualization'
import { moveTreeFromPgn } from '../lib/moveTreeFromPgn'

function HomePage() {
  const [parsed, setParsed] = useState(null)

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