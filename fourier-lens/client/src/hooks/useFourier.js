import { useMemo, useState } from 'react'
import { buildSpectrum } from '@/utils/math'

export function useFourier() {
  const [points, setPoints] = useState([])

  const spectrum = useMemo(() => buildSpectrum(points), [points])

  function addPoint(point) {
    setPoints((previous) => [...previous, point])
  }

  function clear() {
    setPoints([])
  }

  function load(nextPoints) {
    setPoints(nextPoints)
  }

  return { points, spectrum, addPoint, clear, load }
}
