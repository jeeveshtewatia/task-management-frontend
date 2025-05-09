'use client'

import { ReactNode } from 'react'

export function HtmlWrapper({ children, lang }: { children: ReactNode; lang: string }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      {children}
    </html>
  )
} 