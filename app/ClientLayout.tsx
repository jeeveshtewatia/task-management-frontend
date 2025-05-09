'use client'

import React from 'react';
import { AuthProvider } from '@/context/AuthContext'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div>
        <main>{children}</main>
      </div>
    </AuthProvider>
  )
} 