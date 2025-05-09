'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { useTheme } from '../../context/ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 ">
        <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8">
                <Link href="/tasks" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                  <span className="mr-2">📝</span> Task Manager
                </Link>
                <div className="hidden sm:flex sm:space-x-4 ml-8">
                  <Link
                    href="/tasks"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      pathname === '/tasks'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    Tasks
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      pathname === '/dashboard'
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                  <span className="ml-2">{user?.username}</span>
                </span>
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 