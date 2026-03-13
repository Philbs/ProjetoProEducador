import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Tag, Folder } from 'lucide-react';
import api from '../services/api';

export default function TaskModal({ isOpen, onClose, taskData, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMeta();
      if (taskData) {
        setTitle(taskData.title || '');
        setDescription(taskData.description || '');
        setDueDate(taskData.dueDate ? taskData.dueDate.split('T')[0] : '');
        setPriority(taskData.priority || 'MEDIUM');
        setCategoryId(taskData.categoryId || '');
        setSelectedTags(taskData.tags?.map(t => t.id) || []);
      } else {
        resetForm();
      }
    }
  }, [isOpen, taskData]);

  const fetchMeta = async () => {
    try {
      const [catsRes, tagsRes] = await Promise.all([
        api.get('/categories'),
        api.get('/tags')
      ]);
      setCategories(catsRes.data);
      setAvailableTags(tagsRes.data);
    } catch (err) {
      console.error('Failed fetching metadata', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('MEDIUM');
    setCategoryId('');
    setSelectedTags([]);
    setNewTagInput('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        isCompleted: taskData ? taskData.isCompleted : false,
        categoryId: categoryId || null,
        tagIds: selectedTags
      };

      if (taskData?.id) {
        await api.put(`/tasks/${taskData.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagInput.trim()) return;
    try {
      const res = await api.post('/tags', { name: newTagInput.trim() });
      setAvailableTags([...availableTags, res.data]);
      // Removed auto-select so it stays empty until user clicks it
      setNewTagInput('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create tag');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-[var(--color-dark-card)] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-tight">
            {taskData ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Task Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)] transition-all"
                placeholder="What needs to be done?"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)] transition-all resize-none"
                placeholder="Add more details about this task..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)] transition-all appearance-none cursor-pointer"
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                <Folder className="w-4 h-4 text-gray-500" />
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-neon)] focus:ring-1 focus:ring-[var(--color-neon)] transition-all appearance-none cursor-pointer"
              >
                <option value="">No Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300 ml-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                Tags
              </label>

              <div className="flex items-center gap-2 w-full sm:w-2/3">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateTag())}
                  placeholder="Criar nova tag..."
                  className="flex-1 bg-[var(--color-dark-bg)] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-neon)]"
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  + Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all flex items-center gap-2 ${
                      selectedTags.includes(tag.id) 
                        ? 'bg-[var(--color-neon)] border-[var(--color-neon)] text-white shadow-md' 
                        : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && <X className="w-3.5 h-3.5 opacity-80" />}
                  </button>
                ))}
                
                {availableTags.length === 0 && (
                  <p className="text-sm text-gray-500 ml-1">Nenhuma tag criada ainda. Adicione acima!</p>
                )}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-900/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-[var(--color-neon)] hover:bg-teal-500 transition-colors shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>

      </div>
    </div>
  );
}
