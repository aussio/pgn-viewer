import MoveTreeFlow from './MoveTreeFlow/MoveTreeFlow'

function MoveTreeVisualization({ moveTree }) {
  if (!moveTree) return null
  return (
    <div>
      <h2>Move Tree Visualization</h2>
      <MoveTreeFlow moveTree={moveTree} />
    </div>
  )
}

export default MoveTreeVisualization 