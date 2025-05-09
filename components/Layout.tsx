import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    ChartBarIcon,
    ArrowRightOnRectangleIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    if (!user) {
        return <>{children}</>;
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/tasks" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                                    <HomeIcon className="h-6 w-6 mr-2" />
                                    Task Manager
                                </Link>
                            </div>
                            
                            {/* Desktop Navigation */}
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/tasks"
                                    className={`${
                                        router.pathname === '/tasks'
                                            ? 'border-indigo-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <HomeIcon className="h-5 w-5 mr-1" />
                                    Tasks
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className={`${
                                        router.pathname === '/dashboard'
                                            ? 'border-indigo-500 text-gray-900 dark:text-white'
                                            : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    <ChartBarIcon className="h-5 w-5 mr-1" />
                                    Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden sm:flex sm:items-center space-x-2">
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
                            <span className="text-gray-700 dark:text-gray-200 mr-4">{user.username}</span>
                            <button
                                onClick={logout}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 inline-flex items-center"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                                Logout
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            >
                                {isMobileMenuOpen ? (
                                    <XMarkIcon className="block h-6 w-6" />
                                ) : (
                                    <Bars3Icon className="block h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden dark:bg-gray-800`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/tasks"
                            className={`$${
                                router.pathname === '/tasks'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-900 dark:text-white'
                                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <HomeIcon className="h-5 w-5 mr-2" />
                                Tasks
                            </div>
                        </Link>
                        <Link
                            href="/dashboard"
                            className={`$${
                                router.pathname === '/dashboard'
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-gray-900 dark:text-white'
                                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white'
                            } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="flex items-center">
                                <ChartBarIcon className="h-5 w-5 mr-2" />
                                Dashboard
                            </div>
                        </Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center px-4">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.username}</div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="ml-auto p-2 rounded-full text-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <SunIcon className="h-5 w-5" /> 
                                ) : (
                                    <MoonIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <div className="mt-3 space-y-1">
                            <button
                                onClick={() => {
                                    logout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <div className="flex items-center">
                                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                                    Logout
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 dark:bg-gray-900 dark:text-gray-100 min-h-[80vh]">
                {children}
            </main>
        </div>
    );
};

export default Layout; 