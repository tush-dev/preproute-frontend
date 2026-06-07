import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Logo() {
  const [imgOk, setImgOk] = useState(true)

  return (
    <div className="logo-mark">
      <Link to="/dashboard" aria-label="PrepRoute home">
        {imgOk ? (
          <img src="/image-1780823968532.png" alt="PrepRoute" onError={() => setImgOk(false)} />
        ) : (
          <span>PrepRoute</span>
        )}
      </Link>
    </div>
  )
}
