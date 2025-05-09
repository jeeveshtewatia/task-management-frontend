'use client'

import { useEffect, useState } from 'react'
import { tasks } from '@/lib/api'
import { TaskModal } from '@/components/TaskModal'
import { TaskItem } from '@/components/TaskItem'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

interface Task {
  _id: string
  title: string
  description?: string
  dueDate?: string
  priority: string
  status: string
}

interface CreateTaskData {
  title: string
  description?: string
  dueDate?: Date
  priority?: string
  status: string
}

interface Pagination {
  total: number
  page: number
  pages: number
}

export default function TasksPage() {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, pages: 1 })
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [showFilters, setShowFilters] = useState(false)

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', order: 'desc' })

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    fetchTasks()
  }, [debouncedSearchQuery, statusFilter, priorityFilter, dateRange, sortConfig, pagination.page])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
        sortBy: sortConfig.field,
        sortOrder: sortConfig.order
      })

      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery)
      if (statusFilter) params.append('status', statusFilter)
      if (priorityFilter) params.append('priority', priorityFilter)
      if (dateRange.start) params.append('startDate', dateRange.start)
      if (dateRange.end) params.append('endDate', dateRange.end)

      const response = await tasks.getAll(params.toString())
      setTaskList(response.tasks)
      setPagination(response.pagination)
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data?: { message?: string } }).data?.message || 'Failed to fetch tasks')
      } else {
        setError('Failed to fetch tasks')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTaskUpdate = async (updatedTask: Task, mode: 'create' | 'edit' | 'view') => {
    try {
      if (mode === 'create') {
        const createData: CreateTaskData = {
          title: updatedTask.title,
          description: updatedTask.description,
          dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
          priority: updatedTask.priority,
          status: updatedTask.status
        }
        const result = await tasks.create(createData)
        setTaskList(prevTasks => [result, ...prevTasks])
      } else if (mode === 'edit') {
        const taskId = updatedTask._id;
        const updateData = {
          title: updatedTask.title,
          description: updatedTask.description,
          dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : undefined,
          priority: updatedTask.priority,
          status: updatedTask.status
        }
        const result = await tasks.update(taskId, updateData)
        setTaskList(prevTasks =>
          prevTasks.map(task => (task._id === taskId ? result : task))
        )
      }
      setIsModalOpen(false)
      setSelectedTask(null)
      setModalMode('create')
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data?: { message?: string } }).data?.message || 'Failed to save task')
      } else {
        setError('Failed to save task')
      }
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await tasks.delete(taskId)
      setTaskList(prevTasks => prevTasks.filter(task => task._id !== taskId))
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data?: { message?: string } }).data?.message || 'Failed to delete task')
      } else {
        setError('Failed to delete task')
      }
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const updatedTask = await tasks.update(taskId, { status: newStatus })
      setTaskList(prevTasks =>
        prevTasks.map(task => (task._id === taskId ? updatedTask : task))
      )
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data?: { message?: string } }).data?.message || 'Failed to update task status')
      } else {
        setError('Failed to update task status')
      }
    }
  }

  const handleAddTask = () => {
    setSelectedTask({
      _id: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending'
    })
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleRefresh = () => {
    // Reset all filters
    setSearchQuery('')
    setStatusFilter('')
    setPriorityFilter('')
    setDateRange({ start: '', end: '' })
    setSortConfig({ field: 'createdAt', order: 'desc' })
    setPagination({ total: 0, page: 1, pages: 1 })
    // Fetch tasks will be triggered by the useEffect
  }

  return (
    <div className="flex ">
      <div className="w-full max-w-5xl mx-auto py-10 px-2 sm:px-6 lg:px-8">
        {/* Sticky header and filters */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight dark:text-white">Tasks</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                title="Refresh tasks and reset filters"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleAddTask}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 animate-fadeIn">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-150"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filters
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-all duration-150"
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-all duration-150"
                    >
                      <option value="">All Priorities</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-100 text-red-700 p-4 mb-6 animate-fadeIn">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Error</h3>
                <div className="mt-2 text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200 divide-y divide-gray-200 animate-fadeIn">
              {taskList.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onDelete={handleTaskDelete}
                  onStatusChange={handleStatusChange}
                  onUpdate={handleTaskUpdate}
                />
              ))}
              {taskList.length === 0 && (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddTask}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      New Task
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTask(null)
          }}
          task={selectedTask}
          onSave={handleTaskUpdate}
          mode={modalMode}
        />
      </div>
    </div>
  )
} 