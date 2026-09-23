import BentoGrid from '@/components/BentoGrid'

interface Photo {
  id: string
  url: string
  alt: string
}

export default function GalleryGrid({ photos }: { photos: Photo[] }) {
  return (
    <BentoGrid
      items={photos}
      emptyText="Aún no hay fotos publicadas. ¡Sé el primero en compartir una!"
    />
  )
}
