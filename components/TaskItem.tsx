'use client'

import { useState } from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    CalendarIcon, 
    CheckCircleIcon, 
    ClockIcon,
    ExclamationCircleIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { TaskModal } from './TaskModal';

interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority: string;
    status: string;
}

interface TaskItemProps {
    task: Task;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: string) => void;
    onUpdate: (task: Task, mode: 'create' | 'edit' | 'view') => Promise<void>;
}

export function TaskItem({ task, onDelete, onStatusChange, onUpdate }: TaskItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

    const priorityColors = {
        High: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
        Low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    };

    const statusColors = {
        Pending: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
        Completed: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleTitleClick = () => {
        setModalMode('view');
        setIsModalOpen(true);
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => onStatusChange(task._id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                                    className={`flex-shrink-0 p-1 rounded-full ${
                                        task.status === 'Completed' 
                                            ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' 
                                            : 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <CheckCircleIcon className="h-6 w-6" />
                                </button>
                                <h3 
                                    className={`text-lg font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 ${
                                        task.status === 'Completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''
                                    }`}
                                    onClick={handleTitleClick}
                                >
                                    {task.title}
                                </h3>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        priorityColors[task.priority as keyof typeof priorityColors]
                                    }`}
                                >
                                    {task.priority === 'High' && <ExclamationCircleIcon className="h-3 w-3 mr-1" />}
                                    {task.priority}
                                </span>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                        statusColors[task.status as keyof typeof statusColors]
                                    }`}
                                >
                                    {task.status === 'Pending' ? (
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                    ) : (
                                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    )}
                                    {task.status}
                                </span>
                                {task.dueDate && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        isOverdue 
                                            ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700' 
                                            : 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                                    }`}>
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                            <button
                                onClick={handleEditClick}
                                className="p-1 text-gray-400 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                                title="Edit task"
                            >
                                <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => onDelete(task._id)}
                                className="p-1 text-gray-400 dark:text-red-300 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
                                title="Delete task"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={handleTitleClick}
                                className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                title="View details"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalMode('view');
                }}
                task={task}
                onSave={async (updatedTask) => {
                    console.log('TaskItem - Saving task:', updatedTask);
                    console.log('TaskItem - Mode:', modalMode);
                    await onUpdate(updatedTask, modalMode);
                }}
                mode={modalMode}
            />
        </>
    );
} 