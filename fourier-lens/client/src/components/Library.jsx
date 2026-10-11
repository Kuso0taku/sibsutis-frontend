import Button from '@/shared/Button'

function Library({ shapes, onLoad }) {
  if (shapes.length === 0) {
    return <p className="empty">No saved shapes yet.</p>
  }

  return (
    <div className="library">
      {shapes.map((shape, index) => (
        <Button key={index} variant="ghost" onClick={() => onLoad(shape)}>
          Shape {index + 1}
        </Button>
      ))}
    </div>
  )
}

export default Library
