export const RESOLUTION = 128
export const BARS = 32

const TAU = Math.PI * 2

export function centerPoints(points) {
  if (points.length === 0) return []
  const center = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x / points.length,
      y: acc.y + point.y / points.length,
    }),
    { x: 0, y: 0 },
  )
  return points.map((point) => ({
    x: point.x - center.x,
    y: point.y - center.y,
  }))
}

export function toPolar(points) {
  return points.map((point) => ({
    r: Math.hypot(point.x, point.y),
    theta: normalizeAngle(Math.atan2(point.y, point.x)),
  }))
}

function normalizeAngle(angle) {
  return angle < 0 ? angle + TAU : angle
}

export function resamplePolar(polar, resolution = RESOLUTION) {
  if (polar.length === 0) return []
  const sorted = [...polar].sort((a, b) => a.theta - b.theta)
  const samples = []
  for (let index = 0; index < resolution; index += 1) {
    samples.push(radiusAt(sorted, (index / resolution) * TAU))
  }
  return samples
}

function radiusAt(sorted, angle) {
  if (sorted.length === 1) return sorted[0].r
  for (let index = 0; index < sorted.length; index += 1) {
    const start = sorted[index]
    const end = sorted[(index + 1) % sorted.length]
    const endAngle = index === sorted.length - 1 ? end.theta + TAU : end.theta
    const target = angle < start.theta ? angle + TAU : angle
    if (target >= start.theta && target <= endAngle) {
      const span = endAngle - start.theta || 1
      return start.r + (end.r - start.r) * ((target - start.theta) / span)
    }
  }
  return sorted[0].r
}

export function dft(samples) {
  const size = samples.length
  const real = new Array(size).fill(0)
  const imag = new Array(size).fill(0)
  for (let k = 0; k < size; k += 1) {
    for (let n = 0; n < size; n += 1) {
      const angle = (TAU * k * n) / size
      real[k] += samples[n] * Math.cos(angle)
      imag[k] -= samples[n] * Math.sin(angle)
    }
  }
  return { real, imag }
}

export function magnitudeSpectrum(samples, count = BARS) {
  const { real, imag } = dft(samples)
  const half = Math.floor(samples.length / 2)
  const magnitudes = []
  for (let k = 1; k < half; k += 1) {
    magnitudes.push((Math.hypot(real[k], imag[k]) * 2) / half)
  }
  return magnitudes.slice(0, count)
}

export function buildSpectrum(points) {
  if (points.length < 3) return []
  const centered = centerPoints(points)
  const polar = toPolar(centered)
  const samples = resamplePolar(polar)
  return magnitudeSpectrum(samples)
}
