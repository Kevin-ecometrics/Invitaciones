import BentoGrid from '@/components/BentoGrid'
import { publicStorageUrl } from '@/lib/storage-url'

const REFERENCES = [
  { file: 'disfraz-galactico-poster.jpg', alt: 'Disfraz Galáctico — brilla, atrévete y viaja a otra galaxia' },
  { file: 'holographic-outfit.jpg', alt: 'Conjunto holográfico plateado' },
  { file: 'glitter-makeup-1.jpg', alt: 'Maquillaje con glitter y accesorios plateados' },
  { file: 'crystal-headpiece.jpg', alt: 'Tocado de cristales holográficos' },
  { file: 'holographic-skin.jpg', alt: 'Piel iluminada con acabado holográfico' },
]

export default function DressCodeInspiration() {
  const items = REFERENCES.map((ref) => ({
    id: ref.file,
    url: publicStorageUrl('dress-code', ref.file),
    alt: ref.alt,
  }))

  return <BentoGrid items={items} />
}
