import { useEffect, useState } from 'react'

const STORAGE_KEY = 'fourier-lens:history'
const MAX_SHAPES = 15

function readStored(maxShapes) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.slice(0, maxShapes)
  } catch {
    return []
  }
}

export function useShapeHistory(maxShapes = MAX_SHAPES) {
  const [shapes, setShapes] = useState(() => readStored(maxShapes))

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shapes))
    } catch {
      return
    }
  }, [shapes])

  function push(points) {
    setShapes((previous) => [...previous, points].slice(-maxShapes))
  }

  function reset() {
    setShapes([])
  }

  return { shapes, push, reset, limit: maxShapes }
}
