'use client'

import React from 'react';
import { AuthProvider } from '@/context/AuthContext'
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <div>
        <main>{children}</main>
      </div>
    </AuthProvider>
  )
} 