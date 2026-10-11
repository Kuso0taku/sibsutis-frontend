import Button from '@/shared/Button'

function History({ shapes, limit, onLoad, onClear }) {
  if (shapes.length === 0) {
    return <p className="empty">No saved shapes yet.</p>
  }

  return (
    <div className="history">
      <div className="library">
        {shapes.map((shape, index) => (
          <Button key={index} variant="ghost" onClick={() => onLoad(shape)}>
            Shape {shapes.length - index}
          </Button>
        ))}
      </div>
      <div className="controls">
        <Button variant="ghost" onClick={onClear}>
          Clear history
        </Button>
        <span className="counter">
          {shapes.length}/{limit}
        </span>
      </div>
    </div>
  )
}

export default History
