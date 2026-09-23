import Image from 'next/image'
import invitation from '@/public/invitation/invitacion-maria-esther.jpg'

export default function InvitationCard() {
  return (
    <div className="glass-card overflow-hidden rounded-3xl p-1.5 shadow-[0_0_50px_rgba(139,123,255,0.15)]">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-moon/20">
        <Image
          src={invitation}
          alt="Invitación de los 60 años de María Esther"
          className="h-auto w-full object-cover"
          placeholder="blur"
          sizes="(min-width: 1024px) 400px, 100vw"
          priority
        />
      </div>
    </div>
  )
}
