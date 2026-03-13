import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  LogOut, LayoutDashboard, CheckCircle, Clock, AlertTriangle, ListTodo, Plus
} from 'lucide-react';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to load dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--color-neon)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { total, completed, pending, inProgress, overdue } = metrics.metrics;
  
  // Data for the summary chart
  const chartData = [
    { name: 'Completed', value: completed, color: '#10b981' }, // Emerald
    { name: 'In Progress', value: inProgress, color: '#3b82f6' }, // Blue
    { name: 'Pending', value: pending, color: '#14b8a6' }, // Teal
    { name: 'Overdue', value: overdue, color: '#ef4444' }, // Red
  ];

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[var(--color-dark-card)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-[var(--color-neon)]" />
              <span className="font-bold text-xl tracking-tight">ProEducador</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-400 hidden sm:block">
                Welcome, <strong className="text-white">{user?.name}</strong>
              </span>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Your Productivity Overview
            </h1>
            <p className="text-gray-400 mt-1">Here's what's happening with your tasks today.</p>
          </div>
          
          <button 
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            className="bg-[var(--color-neon)] hover:bg-teal-500 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Tasks" 
            value={total} 
            icon={<ListTodo className="w-6 h-6 text-blue-400" />} 
            trend="+2 this week"
          />
          <MetricCard 
            title="Completed" 
            value={completed} 
            icon={<CheckCircle className="w-6 h-6 text-emerald-400" />} 
            trend="Awesome job!"
          />
          <MetricCard 
            title="In Progress" 
            value={inProgress} 
            icon={<Clock className="w-6 h-6 text-teal-400" />} 
            trend="Keep going"
          />
          <MetricCard 
            title="Overdue" 
            value={overdue} 
            icon={<AlertTriangle className="w-6 h-6 text-red-500" />} 
            trend="Action needed"
            urgent={overdue > 0}
          />
        </div>

        {/* Charts & Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Card */}
          <div className="lg:col-span-2 bg-[var(--color-dark-card)] border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-gray-400" />
              Task Distribution
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af'}} />
                  <YAxis stroke="#6b7280" tick={{fill: '#9ca3af'}} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#374151', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent/Upcoming Tasks Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--color-dark-card)] border border-gray-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
              {metrics.upcomingTasks.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No upcoming tasks.</p>
              ) : (
                <div className="space-y-3">
                  {metrics.upcomingTasks.map(task => (
                    <div key={task.id} className="p-3 bg-[var(--color-dark-bg)] rounded-xl border border-gray-800/60 flex flex-col gap-1">
                      <span className="font-medium text-sm flex items-center justify-between">
                         {task.title}
                         {task.priority === 'URGENT' && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                      </span>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full Task List Component integrated under the dashboard cards */}
        <TaskList 
          onEdit={(task) => { setEditingTask(task); setIsModalOpen(true); }}
          onTaskChange={fetchDashboardData}
        />

      </main>

      {/* Task Creation Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }} 
        taskData={editingTask}
        onSuccess={fetchDashboardData} 
      />

    </div>
  );
}

function MetricCard({ title, value, icon, trend, urgent }) {
  return (
    <div className={`bg-[var(--color-dark-card)] p-6 rounded-2xl border transition-all hover:-translate-y-1 ${urgent ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-gray-800 shadow-xl'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h4 className="text-3xl font-bold">{value}</h4>
        </div>
        <div className="p-3 bg-[var(--color-dark-bg)] rounded-xl border border-gray-800">
          {icon}
        </div>
      </div>
      <p className={`text-xs mt-4 ${urgent ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
        {trend}
      </p>
    </div>
  );
}
