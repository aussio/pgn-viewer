import { useState } from 'react'
import { parsePgn } from '../lib/pgnParser'
import styles from '../App.module.css'
import DebugPre from './DebugPre'

const defaultPgn = `[Event "Variation Test"]
[Site "Test"]
[Date "2023.01.01"]
[White "White"]
[Black "Black"]
[Result "*"]

1. e4 (1. d4 d5 2. c4) e5 2. Nf3 Nc6 3. Bb5 a6 *
`;

/**
 * PGNInput
 *
 * A component for entering, parsing, and debugging PGN input.
 *
 * Props:
 *   setParsed: function - Setter for parsed PGN data (lifts parsed state to parent).
 *   parsed: any - The parsed PGN data (used for debug display).
 */
function PGNInput({ setParsed, parsed }) {
  const [pgn, setPgn] = useState(defaultPgn)
  const [error, setError] = useState(null)
  const [showJson, setShowJson] = useState(false)

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

  return (
    <>
      <textarea
        value={pgn}
        onChange={handleInputChange}
        rows={10}
        cols={60}
        className={styles.textarea}
      />
      <br />
      <button className={styles.button} onClick={handleParse}>Parse PGN</button>
      <DebugPre
        jsonData={parsed}
        showJson={showJson}
        setShowJson={setShowJson}
      />
      {error && <div className={styles.error}>{error}</div>}
    </>
  )
}

export default PGNInput 