import React from 'react'
import { useState, useEffect } from 'react'
import { parsePgn } from '../lib/pgnParser'
import styles from '../App.module.css'
import { useMoveTreeStore } from '../lib/store'

const defaultPgn = `[Event "Braunfel Scotch: Main line opening"]
[Result "*"]
[Variant "Standard"]
[ECO "D01"]
[Opening "Rapport-Jobava System"]
[StudyName "Braunfel Scotch"]
[ChapterName "Main line opening"]
[UTCDate "2025.05.18"]
[UTCTime "22:19:21"]
[Annotator "https://lichess.org/@/Braunfel"]
[ChapterURL "https://lichess.org/study/u8jtEelh/Ev0sXQwp"]

1. d4 d5 2. Nc3 Nf6 3. Bf4 Bf5 (3... Nc6 4. e3 e6 (4... Bf5 5. f3 e6 6. g4 Bg6 7. h4 h6) 5. Bd3 Bb4 6. Ne2) 4. f3 e6 5. g4 Bg6 6. h4 h6 (6... h5 7. g5) *
`;

/**
 * PGNInput
 *
 * A component for entering, parsing, and debugging PGN input.
 */
function PGNInput() {
  const setParsed = useMoveTreeStore(state => state.setParsed)
  const [pgn, setPgn] = useState<string>(defaultPgn)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPgn(e.target.value)
  }

  const handleParse = () => {
    try {
      const result = parsePgn(pgn)
      if (!result) {
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

  useEffect(() => {
    handleParse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className={styles.controls}>
        <button className={styles.button} onClick={handleParse}>Parse PGN</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </>
  )
}

export default PGNInput 