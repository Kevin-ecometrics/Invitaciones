import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const file = await readFile(
    path.join(process.cwd(), 'public/invitation/invitacion-maria-esther.jpg')
  )
  const dataUrl = `data:image/jpeg;base64,${file.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#05040f',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt=""
          style={{ height: '100%', width: 'auto', objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  )
}
