'use client'

import { useRef, useState } from 'react'
import { SpeakerOffIcon, SpeakerOnIcon } from '@/components/Icons'

interface Props {
  src: string | null
}

export default function MusicToggle({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  if (!src) return null

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? 'Silenciar música' : 'Reproducir música'}
        className="glass-card fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full text-silver shadow-lg transition hover:scale-105"
      >
        {playing ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
    </>
  )
}
