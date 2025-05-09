'use client'

import { useEffect, useState } from 'react'
import { tasks } from '@/lib/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement)

interface Task {
  _id: string
  title: string
  description?: string
  dueDate?: string
  priority: string
  status: string
}

interface Analytics {
  priorityDistribution: {
    High: number
    Medium: number
    Low: number
  }
  statusDistribution: {
    Pending: number
    Completed: number
  }
  completionTrend: {
    _id: string
    completed: number
    total: number
  }[]
  upcomingDeadlines: Task[]
  priorityByStatus: {
    Pending: {
      High: number
      Medium: number
      Low: number
    }
    Completed: {
      High: number
      Medium: number
      Low: number
    }
  }
  overdueTasks: number
}

const defaultAnalytics: Analytics = {
  priorityDistribution: { High: 0, Medium: 0, Low: 0 },
  statusDistribution: { Pending: 0, Completed: 0 },
  completionTrend: [],
  upcomingDeadlines: [],
  priorityByStatus: {
    Pending: { High: 0, Medium: 0, Low: 0 },
    Completed: { High: 0, Medium: 0, Low: 0 }
  },
  overdueTasks: 0
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics>(defaultAnalytics)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const data = await tasks.getAnalytics()
      // Ensure all required fields are present with default values
      const formattedData: Analytics = {
        priorityDistribution: {
          High: data.priorityDistribution?.High || 0,
          Medium: data.priorityDistribution?.Medium || 0,
          Low: data.priorityDistribution?.Low || 0
        },
        statusDistribution: {
          Pending: data.statusDistribution?.Pending || 0,
          Completed: data.statusDistribution?.Completed || 0
        },
        completionTrend: data.completionTrend || [],
        upcomingDeadlines: data.upcomingDeadlines || [],
        priorityByStatus: {
          Pending: {
            High: data.priorityByStatus?.Pending?.High || 0,
            Medium: data.priorityByStatus?.Pending?.Medium || 0,
            Low: data.priorityByStatus?.Pending?.Low || 0
          },
          Completed: {
            High: data.priorityByStatus?.Completed?.High || 0,
            Medium: data.priorityByStatus?.Completed?.Medium || 0,
            Low: data.priorityByStatus?.Completed?.Low || 0
          }
        },
        overdueTasks: data.overdueTasks || 0
      }
      setAnalytics(formattedData)
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setError((err.response as { data?: { message?: string } }).data?.message || 'Failed to fetch analytics')
      } else {
        setError('Failed to fetch analytics')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </div>
    )
  }

  const totalTasks = analytics.statusDistribution.Pending + analytics.statusDistribution.Completed
  const completionRate = totalTasks > 0 ? (analytics.statusDistribution.Completed / totalTasks) * 100 : 0

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [
          analytics.priorityDistribution.High,
          analytics.priorityDistribution.Medium,
          analytics.priorityDistribution.Low,
        ],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
      },
    ],
  }

  const statusData = {
    labels: ['Pending', 'Completed'],
    datasets: [
      {
        data: [
          analytics.statusDistribution.Pending,
          analytics.statusDistribution.Completed,
        ],
        backgroundColor: ['#9CA3AF', '#3B82F6'],
      },
    ],
  }

  const completionTrendData = {
    labels: analytics.completionTrend.map(item => item._id),
    datasets: [
      {
        label: 'Completion Rate',
        data: analytics.completionTrend.map(item => (item.completed / item.total) * 100),
        borderColor: '#3B82F6',
        tension: 0.4,
        fill: false,
      },
    ],
  }

  const priorityByStatusData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Pending',
        data: [
          analytics.priorityByStatus.Pending.High,
          analytics.priorityByStatus.Pending.Medium,
          analytics.priorityByStatus.Pending.Low,
        ],
        backgroundColor: '#9CA3AF',
      },
      {
        label: 'Completed',
        data: [
          analytics.priorityByStatus.Completed.High,
          analytics.priorityByStatus.Completed.Medium,
          analytics.priorityByStatus.Completed.Low,
        ],
        backgroundColor: '#3B82F6',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-300">{totalTasks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Completion Rate</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{completionRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Overdue Tasks</h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{analytics.overdueTasks}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Task Priority Distribution</h2>
            <div className="h-64">
              <Pie data={priorityData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Task Status Distribution</h2>
            <div className="h-64">
              <Pie data={statusData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Completion Rate Trend</h2>
            <div className="h-64">
              <Line
                data={completionTrendData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Completion Rate (%)'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Priority Distribution by Status</h2>
            <div className="h-64">
              <Bar
                data={priorityByStatusData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Upcoming Deadlines</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.upcomingDeadlines.map((task) => (
                  <tr key={task._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === 'High'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(task.dueDate!).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {analytics.upcomingDeadlines.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                      No upcoming deadlines
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 