import { useState } from 'react'
import { parsePgn } from './pgnParser'
import styles from './App.module.css'

const defaultPgn = `[Event "Friendly Match"]
[Site "New Braunfels Chess Club"]
[Date "2023.11.03"]
[White "Alice"]
[Black "Bob"]
[Result "1-0"]

1. e4 e5 2. Nf3 f6? {Weakening kingside, exposing Black to danger} 
3. Nxe5! fxe5?? {Loses immediately} 
4. Qh5+ Ke7 5. Qxe5# {Quick checkmate} 1-0
`;

function App() {
  const [pgn, setPgn] = useState(defaultPgn)
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState(null)

  const handleInputChange = (e) => {
    setPgn(e.target.value)
  }

  const handleParse = () => {
    try {
      const result = parsePgn(pgn)
      setParsed(result)
      setError(null)
    } catch {
      setParsed(null)
      setError('Failed to parse PGN.')
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
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.parsedContainer}>
        <h2>Parsed Output</h2>
        <pre className={styles.pre}>{parsed ? JSON.stringify(parsed, null, 2) : ''}</pre>
      </div>
    </div>
  )
}

export default App
