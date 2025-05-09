'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LockClosedIcon, EnvelopeIcon, UserIcon, EyeIcon, EyeSlashIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [apiError, setApiError] = useState('')
  const { register } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.username) newErrors.username = 'Username is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setIsLoading(true)
    setApiError('')
    try {
      // Replace with your registration API call
      await register(formData.username, formData.email, formData.password)
      setTimeout(() => {
        setIsLoading(false)
        router.push('/tasks')
      }, 1000)
    } catch {
      setApiError('Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  const getInputClassName = (field: string) => {
    const base = 'block w-full pl-10 pr-10 py-2 rounded-lg border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150';
    const border = errors[field] ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-700';
    return `${base} ${border}`;
  }

  return (
    <>
      {/* Top bar with logo and theme toggle */}
      <div className="h-screen flex flex-col items-center justify-center pt-0">
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 shadow mb-8 absolute top-0 left-0 right-0">
        <Link href="/" className="flex items-center text-2xl font-bold text-blue-600 dark:text-blue-400">
          <span className="mr-2">📝</span> Task Manager
        </Link>
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
      </nav>
      {/* Register card */}
      <div className=" flex items-center justify-center pt-0">
        <div className="w-full max-w-md p-1 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-xl animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <UserIcon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create your account</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Sign up to get started!</p>
            </div>
            {apiError && (
              <div className="mb-4 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 text-sm">
                {apiError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Username</label>
                <span className="absolute left-3 top-9 text-gray-400 dark:text-gray-500">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={getInputClassName('username')}
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
                <span className="absolute left-3 top-9 text-gray-400 dark:text-gray-500">
                  <EnvelopeIcon className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={getInputClassName('email')}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
                <span className="absolute left-3 top-9 text-gray-400 dark:text-gray-500">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={getInputClassName('password')}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-9 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Register'}
              </button>
            </form>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              <span className="mx-4 text-gray-400 dark:text-gray-500 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

const RegisterPage = dynamic(() => Promise.resolve(RegisterForm), {
  ssr: false
})

export default RegisterPage 