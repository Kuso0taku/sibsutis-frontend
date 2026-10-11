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

  function handleSave() {
    push(points)
    setMessage(`Saved to history (max ${limit}).`)
  }

  function handleClear() {
    clear()
    setMessage('Canvas cleared.')
  }

  function handleLoad(shape) {
    load(shape)
    setMessage('Shape loaded from history.')
  }

  function handleClearHistory() {
    reset()
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
        <p className="message">{message}</p>
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
