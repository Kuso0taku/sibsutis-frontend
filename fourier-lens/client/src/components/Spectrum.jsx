function Spectrum({ spectrum }) {
  if (spectrum.length === 0) {
    return <p className="empty">Draw a shape to see its spectrum.</p>
  }

  const peak = Math.max(...spectrum, 0.0001)

  return (
    <div className="spectrum">
      {spectrum.map((value, index) => (
        <div
          key={index}
          className="bar"
          style={{ height: `${Math.max((value / peak) * 100, 2)}%` }}
        />
      ))}
    </div>
  )
}

export default Spectrum
