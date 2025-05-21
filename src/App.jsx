import { useState } from 'react'
import { parsePgn } from './pgnParser'
import styles from './App.module.css'
import MoveTreeFlow from './MoveTreeFlow'
import { moveTreeFromPgn } from './moveTreeFromPgn'

const defaultPgn = `[Event "Variation Test"]
[Site "Test"]
[Date "2023.01.01"]
[White "White"]
[Black "Black"]
[Result "*"]

1. e4 (1. d4 d5 2. c4) e5 2. Nf3 Nc6 3. Bb5 a6 *
`;

function App() {
  const [pgn, setPgn] = useState(defaultPgn)
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState(null)
  const [showParsedJson, setShowParsedJson] = useState(false)

  const handleInputChange = (e) => {
    setPgn(e.target.value)
  }

  const handleParse = () => {
    try {
      const result = parsePgn(pgn)
      if (!result || result.length === 0) {
        setParsed(null)
        setError('Failed to parse PGN.')
      } else {
        setParsed(result)
        setError(null)
      }
    } catch {
      setParsed(null)
      setError('Failed to parse PGN.')
    }
  }

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
      <textarea
        value={pgn}
        onChange={handleInputChange}
        placeholder="Paste your PGN here..."
        rows={10}
        cols={60}
        className={styles.textarea}
      />
      <br />
      <button className={styles.button} onClick={handleParse}>Parse PGN</button>
      {parsed && (
        <button
          className={`${styles.button} ${styles.parsedJsonButton}`}
          onClick={() => setShowParsedJson(v => !v)}
          type="button"
        >
          Parsed JSON
        </button>
      )}
      {showParsedJson && parsed && (
        <div className={styles.parsedJsonSection}>
          <pre className={styles.pre}>{JSON.stringify(parsed, null, 2)}</pre>
        </div>
      )}
      {error && <div className={styles.error}>{error}</div>}
      {moveTree && (
        <div>
          <h2>Move Tree Visualization</h2>
          <MoveTreeFlow moveTree={moveTree} />
        </div>
      )}
    </div>
  )
}

export default App
