import { useState } from 'react'
import Canvas from '@/components/Canvas'
import Controls from '@/components/Controls'
import History from '@/components/History'
import Spectrum from '@/components/Spectrum'
import Card from '@/shared/Card'
import { useFourier } from '@/hooks/useFourier'
import { useShapeHistory } from '@/hooks/useShapeHistory'
import './App.css'

function App() {
  const { points, spectrum, addPoint, clear, load } = useFourier()
  const { shapes, push, reset, limit } = useShapeHistory()
  const [message, setMessage] = useState('Draw a shape on the canvas.')
  const [warning, setWarning] = useState(false)

  function handleSave() {
    const willDropOldest = shapes.length >= limit
    push(points)
    setWarning(willDropOldest)
    setMessage(
      willDropOldest
        ? `History is full (${limit}). The first shape was removed to store the new one.`
        : 'Saved to history.',
    )
  }

  function handleClear() {
    clear()
    setWarning(false)
    setMessage('Canvas cleared.')
  }

  function handleLoad(shape) {
    load(shape)
    setWarning(false)
    setMessage('Shape loaded from history.')
  }

  function handleClearHistory() {
    reset()
    setWarning(false)
    setMessage('History cleared.')
  }

  return (
    <div className="container">
      <h1 className="page-title">Fourier Lens</h1>

      <Card title="Draw">
        <Canvas points={points} onAddPoint={addPoint} onClear={handleClear} />
        <Controls
          pointCount={points.length}
          onClear={handleClear}
          onSave={handleSave}
        />
        <p className={warning ? 'message message-warning' : 'message'}>
          {message}
        </p>
      </Card>

      <Card title="Spectrum">
        <Spectrum spectrum={spectrum} />
      </Card>

      <Card title="History">
        <History
          shapes={shapes}
          limit={limit}
          onLoad={handleLoad}
          onClear={handleClearHistory}
        />
      </Card>
    </div>
  )
}

export default App
