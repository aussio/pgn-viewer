import React from 'react';
import styles from '../App.module.css'

/**
 * DebugPre
 *
 * A reusable component for toggling and displaying pretty-printed JSON data.
 *
 * Props:
 *   jsonData: any - The JSON-serializable data to display.
 *   showJson: boolean - Whether the JSON should be shown.
 *   setShowJson: function - Setter to toggle the JSON display.
 */
type DebugPreProps = {
  jsonData: any;
  showJson: boolean;
  setShowJson: React.Dispatch<React.SetStateAction<boolean>>;
};

function DebugPre({ jsonData, showJson, setShowJson }: DebugPreProps) {
  if (!jsonData) return null
  return (
    <>
      <button
        className={`${styles.button} ${styles.parsedJsonButton}`}
        onClick={() => setShowJson(v => !v)}
        type="button"
      >
        Show JSON
      </button>
      {showJson && (
        <div className={styles.parsedJsonSection}>
          <pre className={styles.pre}>{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default DebugPre 