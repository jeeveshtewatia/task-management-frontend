'use client'

import { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationCircleIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: string;
    status: string;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onSave: (task: Task, mode: 'create' | 'edit' | 'view') => Promise<void>;
    mode: 'create' | 'edit' | 'view';
}

const priorityOptions = [
    { value: 'High', label: 'High', icon: <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    { value: 'Medium', label: 'Medium', icon: <ClockIcon className="h-4 w-4 text-yellow-500 mr-1" />, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { value: 'Low', label: 'Low', icon: <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
];

const statusOptions = [
    { value: 'Pending', label: 'Pending', icon: <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
    { value: 'Completed', label: 'Completed', icon: <CheckCircleIcon className="h-4 w-4 text-blue-500 mr-1" />, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
];

export function TaskModal({ isOpen, onClose, task, onSave, mode }: TaskModalProps) {
    const [editedTask, setEditedTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'create') {
            setEditedTask({
                _id: '',
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium',
                status: 'Pending'
            });
        } else {
            setEditedTask(task);
        }
    }, [task, mode]);

    if (!isOpen || !editedTask) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedTask) return;

        setLoading(true);
        try {
            await onSave(editedTask, mode);
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-t-2xl" />
                {/* Sticky header */}
                <div className="sticky top-0 flex justify-between items-center p-6 pb-2 bg-white dark:bg-gray-900 rounded-t-2xl z-10 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {mode === 'view' ? 'Task Details' : mode === 'create' ? 'Create Task' : 'Edit Task'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-7 w-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-150 px-3 py-2 text-base disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                            disabled={mode === 'view'}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={editedTask.description || ''}
                            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-150 px-3 py-2 text-base disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            rows={3}
                            disabled={mode === 'view'}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Due Date
                            </label>
                            <input
                                type="date"
                                id="dueDate"
                                value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                                className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-150 px-3 py-2 text-base disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                disabled={mode === 'view'}
                            />
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Priority
                            </label>
                            <div className="relative">
                                <select
                                    id="priority"
                                    value={editedTask.priority}
                                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-150 px-3 py-2 text-base disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10 appearance-none"
                                    disabled={mode === 'view'}
                                >
                                    {priorityOptions.map((option) => (
                                        <option key={option.value} value={option.value} className={option.color}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom dropdown icon */}
                                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
                                    <ExclamationCircleIcon className="h-5 w-5" />
                                </span>
                                {/* Show badge for selected */}
                                <div className="absolute left-0 -bottom-7 flex items-center">
                                    {priorityOptions.find(p => p.value === editedTask.priority)?.icon}
                                    <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${priorityOptions.find(p => p.value === editedTask.priority)?.color}`}>{editedTask.priority}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {mode !== 'create' && (
                        <div>
                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                                Status
                            </label>
                            <div className="relative">
                                <select
                                    id="status"
                                    value={editedTask.status}
                                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-150 px-3 py-2 text-base disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10 appearance-none"
                                    disabled={mode === 'view'}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value} className={option.color}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom dropdown icon */}
                                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300">
                                    <CheckCircleIcon className="h-5 w-5" />
                                </span>
                                {/* Show badge for selected */}
                                <div className="absolute left-0 -bottom-7 flex items-center">
                                    {statusOptions.find(s => s.value === editedTask.status)?.icon}
                                    <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold ${statusOptions.find(s => s.value === editedTask.status)?.color}`}>{editedTask.status}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
                        >
                            {mode === 'view' ? 'Close' : 'Cancel'}
                        </button>
                        {mode !== 'view' && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 border border-transparent rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 disabled:opacity-60"
                            >
                                {loading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
} 