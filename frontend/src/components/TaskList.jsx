import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Filter, Calendar as LitCalendar, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskList({ onEdit, onTaskChange }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, DONE

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, catsRes, tagsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/categories'),
        api.get('/tags')
      ]);
      setTasks(tasksRes.data);
      setCategories(catsRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.error('Failed to fetch task data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return !task.isCompleted;
    if (filter === 'DONE') return task.isCompleted;
    return true;
  });

  const handleToggleStatus = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted,
        categoryId: task.categoryId,
        tagIds: task.tags?.map(t => t.id) || []
      });
      fetchData(); // Refresh list after update
      if (onTaskChange) onTaskChange();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchData();
      if (onTaskChange) onTaskChange();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400 bg-red-400/10 border-red-500/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
      case 'LOW': return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-500/20';
    }
  };

  const getStatusColor = (isCompleted) => {
    if (isCompleted) return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
    return 'text-gray-400 bg-gray-400/10 border-gray-500/20';
  };

  if (loading) {
     return <div className="animate-pulse flex space-x-4 p-8">Loading tasks...</div>;
  }

  return (
    <div className="bg-[var(--color-dark-card)] border border-gray-800 rounded-2xl p-6 shadow-xl mt-8">
      
      {/* List Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-white">All Tasks</h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-neon)]"
            />
          </div>
          
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--color-dark-bg)] border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-[var(--color-neon)] cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="DONE">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List items */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
             <p className="text-gray-500">No tasks found for this filter.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[var(--color-dark-bg)] border border-gray-800 rounded-xl hover:border-gray-600 transition-colors gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Complete Toggle Checkbox */}
                <button 
                  onClick={() => handleToggleStatus(task)}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    task.isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-500 hover:border-emerald-500/80 bg-gray-800/50'
                  }`}
                >
                  {task.isCompleted && <span className="text-[10px] font-bold">✓</span>}
                </button>
                
                <div className="flex-1">
                  <h4 className={`text-base font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                     <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                  )}
                  
                  {/* Tags and Metadata */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${getStatusColor(task.isCompleted)}`}>
                      {task.isCompleted ? 'Feito' : 'Pendente'}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-md border font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    
                    {task.dueDate && (
                      <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-md">
                        <LitCalendar className="w-3 h-3" />
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    )}

                    {task.category && (
                      <span className="text-xs text-gray-300 flex items-center gap-1.5 bg-gray-800/80 px-2 py-1 rounded-md border border-gray-700">
                        <div className="w-2 h-2 rounded-full" style={{backgroundColor: task.category.color}}></div>
                        {task.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-center">
                <button 
                  onClick={() => onEdit && onEdit(task)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  title="Editar Tarefa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Excluir Tarefa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
