import { useState } from 'react'
import Canvas from '@/components/Canvas'
import Controls from '@/components/Controls'
import Library from '@/components/Library'
import Spectrum from '@/components/Spectrum'
import Card from '@/shared/Card'
import { useFourier } from '@/hooks/useFourier'
import './App.css'

function App() {
  const { points, spectrum, addPoint, clear, load } = useFourier()
  const [saved, setSaved] = useState([])
  const [message, setMessage] = useState('Draw a shape on the canvas.')

  function handleSave() {
    setSaved((previous) => [...previous, points])
    setMessage(`Saved shape #${saved.length + 1}.`)
  }

  function handleClear() {
    clear()
    setMessage('Canvas cleared.')
  }

  function handleLoad(shape) {
    load(shape)
    setMessage('Shape loaded.')
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

      <Card title="Library">
        <Library shapes={saved} onLoad={handleLoad} />
      </Card>
    </div>
  )
}

export default App
