import { useRef } from 'react'

const SIZE = 320

function Canvas({ points, onAddPoint, onClear }) {
  const drawing = useRef(false)
  const surface = useRef(null)

  function positionOf(event) {
    const rect = surface.current.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * SIZE,
      y: ((event.clientY - rect.top) / rect.height) * SIZE,
    }
  }

  function handlePointerDown(event) {
    drawing.current = true
    surface.current.setPointerCapture(event.pointerId)
    onAddPoint(positionOf(event))
  }

  function handlePointerMove(event) {
    if (drawing.current) onAddPoint(positionOf(event))
  }

  function stopDrawing() {
    drawing.current = false
  }

  const path = points
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ')

  return (
    <svg
      ref={surface}
      className="canvas"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      onDoubleClick={onClear}
    >
      <line className="axis" x1={SIZE / 2} y1="0" x2={SIZE / 2} y2={SIZE} />
      <line className="axis" x1="0" y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} />
      {points.length > 1 && <polyline className="trace" points={path} />}
    </svg>
  )
}

export default Canvas
