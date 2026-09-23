'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  baseAlpha: number
  twinkleSpeed: number
  phase: number
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let stars: Star[] = []
    let animationFrame = 0
    let width = 0
    let height = 0

    function resize() {
      if (!canvas) return
      width = canvas.clientWidth
      height = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx?.scale(dpr, dpr)

      const count = Math.floor((width * height) / 3200)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    function draw(time: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      for (const star of stars) {
        const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + star.phase) * 0.3
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(244, 241, 255, ${Math.max(0, Math.min(1, alpha))})`
        ctx.fill()
      }

      animationFrame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animationFrame = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="starfield" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
