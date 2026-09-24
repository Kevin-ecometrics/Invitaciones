type IconProps = {
  className?: string
}

const base = 'h-5 w-5'

export function StarIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l2.09 5.26L20 9.27l-4.36 3.94L16.9 19 12 15.9 7.1 19l1.26-5.79L4 9.27l5.91-1.01L12 3z"
      />
    </svg>
  )
}

export function MapPinIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-6.13-7-11a7 7 0 1 1 14 0c0 4.87-7 11-7 11z"
      />
      <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ClockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4.5l3 2" />
    </svg>
  )
}

export function ParkingIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </svg>
  )
}

export function SparkleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M6.5 6.5l2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function MusicNoteIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V5l10-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  )
}

export function SpeakerOnIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4h4l5 4V6l-5 4H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9a4.5 4.5 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" />
    </svg>
  )
}

export function SpeakerOffIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10v4h4l5 4V6l-5 4H4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 10l4 4M21 10l-4 4" />
    </svg>
  )
}

export function UploadCloudIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17.5a4.5 4.5 0 0 1-.9-8.91 5.5 5.5 0 0 1 10.7-1.94A4 4 0 0 1 17.5 15M12 11v8m0-8-3 3m3-3 3 3"
      />
    </svg>
  )
}

export function ImageIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 16l-5.5-5.5a1.5 1.5 0 0 0-2.12 0L4 19" />
    </svg>
  )
}

export function GiftIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9h18v3H3V9zM12 9v11M12 9c-1-2.5-3-4-4.5-4S5 6 5 7.2 6 9 7.5 9H12zm0 0c1-2.5 3-4 4.5-4S19 6 19 7.2 18 9 16.5 9H12z"
      />
    </svg>
  )
}

export function CheckIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function XIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function TrashIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 .8 12.2A2 2 0 0 0 7.79 21h8.42a2 2 0 0 0 1.99-1.8L19 7M10 11v6M14 11v6"
      />
    </svg>
  )
}

export function LogoutIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7M18 15l4-3-4-3M10 12h11.5"
      />
    </svg>
  )
}

export function SearchIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-4.3-4.3" />
    </svg>
  )
}

export function DownloadIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

export function EyeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 12c1.7-4 5.4-7 9.5-7s7.8 3 9.5 7c-1.7 4-5.4 7-9.5 7s-7.8-3-9.5-7z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M6.7 6.7C4.7 8.1 3.3 10 2.5 12c1.7 4 5.4 7 9.5 7 1.8 0 3.4-.5 4.8-1.4M9.9 4.6A10.6 10.6 0 0 1 12 4.5c4.1 0 7.8 3 9.5 7-.5 1.2-1.2 2.4-2.1 3.4"
      />
    </svg>
  )
}

export function ExternalLinkIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6v6M20 4l-9 9M19 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </svg>
  )
}

export function UsersIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 20c.7-3.2 3-5 5.5-5s4.8 1.8 5.5 5M15.5 6a3 3 0 0 1 0 5.8M18 20c-.3-2.3-1.2-3.9-2.7-4.8" />
    </svg>
  )
}

export function TicketIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8zM9 6v12"
        strokeDasharray="2 2.5"
      />
    </svg>
  )
}

export function SlidersIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h13M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  )
}

export function HourglassIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 3h12M6 21h12M7 3c0 4 3 5.5 5 6.5V9.5C10 8.5 7 7 7 3zM7 21c0-4 3-5.5 5-6.5v0c2 1 5 2.5 5 6.5"
      />
    </svg>
  )
}

export function SunIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
      />
    </svg>
  )
}

export function MoonIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"
      />
    </svg>
  )
}
