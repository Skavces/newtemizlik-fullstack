import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  titleSize?: string
  lead?: string
  align?: 'center' | 'left'
  rule?: boolean
  eyebrowWeight?: 600 | 700
}

export default function SectionHeader({
  eyebrow,
  title,
  titleSize = 'clamp(26px, 4vw, 38px)',
  lead,
  align = 'center',
  rule = align === 'center',
  eyebrowWeight = 600,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <>
      <span
        style={{
          fontSize: eyebrowWeight === 700 ? '11px' : '12px',
          fontWeight: eyebrowWeight,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-secondary)',
          display: 'block',
          marginBottom: eyebrowWeight === 700 ? '8px' : '10px',
        }}
      >
        {eyebrow}
      </span>
      <h2 className="section-heading" style={{ fontSize: titleSize }}>
        {title}
      </h2>
      {lead && (
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginTop: '14px',
            lineHeight: 1.7,
            ...(isCenter ? {} : { maxWidth: '560px' }),
          }}
        >
          {lead}
        </p>
      )}
      {rule && (
        <div
          style={{
            width: '50px',
            height: '3px',
            background: 'var(--color-secondary)',
            margin: isCenter ? '16px auto 0' : '16px 0 0',
          }}
        />
      )}
    </>
  )
}
