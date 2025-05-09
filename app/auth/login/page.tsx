'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import dynamic from 'next/dynamic'
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/context/ThemeContext'

interface FormErrors {
  email?: string
  password?: string
}

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, error } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return undefined
      case 'password':
        if (!value) return 'Password is required'
        return undefined
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    try {
      setIsLoading(true)
      await login(formData.email, formData.password)
      router.push('/tasks')
    } catch (err) {
      setErrors({
        email: 'Invalid email or password',
        password: 'Invalid email or password',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getInputClassName = (fieldName: keyof FormErrors) => {
    const base = 'block w-full pl-10 pr-10 py-2 rounded-lg border text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150';
    const border = errors[fieldName] ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-700';
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
      {/* Login card */}
      <div className=" flex items-center justify-center pt-0">
        <div className="w-full max-w-md p-1 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-xl animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <LockClosedIcon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Sign in to your account</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back! Please enter your details.</p>
            </div>
            {error && (
              <div className="mb-4 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-2 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  onBlur={handleBlur}
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
                  autoComplete="current-password"
                  required
                  className={getInputClassName('password')}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
              <span className="mx-4 text-gray-400 dark:text-gray-500 text-xs">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700" />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

const LoginPage = dynamic(() => Promise.resolve(LoginForm), {
  ssr: false
})

export default LoginPage 