'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utils/cn'

const LOGO_SRC = '/11.png'

interface EsperanzaLogoProps {
  size?: number
  showWordmark?: boolean
  href?: string | null
  className?: string
  wordmarkClassName?: string
  priority?: boolean
}

export function EsperanzaLogo({
  size = 36,
  showWordmark = true,
  href = '/',
  className,
  wordmarkClassName,
  priority = false,
}: EsperanzaLogoProps) {
  const mark = (
    <span className={cn('inline-flex shrink-0 items-center gap-2.5', className)}>
      <span
        className="relative inline-flex shrink-0 overflow-hidden rounded-md"
        style={{ width: size, height: size }}
      >
        <Image
          src={LOGO_SRC}
          alt="Esperanza Club logo"
          width={size}
          height={size}
          priority={priority}
          className="h-full w-full object-contain"
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            'select-none text-sm font-bold tracking-[0.18em] text-white',
            wordmarkClassName,
          )}
        >
          ESPERANZA
        </span>
      )}
    </span>
  )

  if (!href) return mark

  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cyan-400/70"
      aria-label="Esperanza Club home"
    >
      {mark}
    </Link>
  )
}
