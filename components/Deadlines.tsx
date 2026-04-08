'use client';

import { useState } from 'react';
import { useApp, Deadline } from './AppContext';

type FormData = Omit<Deadline, 'id'>;

const defaultForm: FormData = {
  title: '',
  subject: '',
  dueDate: '',
  priority: 'medium',
  completed: false,
  description: '',
};

export default function Deadlines() {
  const { deadlines, addDeadline, updateDeadline, deleteDeadline, toggleDeadline } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [search, setSearch] = useState('');

  const today = new Date();

  const filteredDeadlines = deadlines.filter(d => {
    const matchesStatus = filter === 'all' || (filter === 'pending' && !d.completed) || (filter === 'completed' && d.completed);
    const matchesPriority = priorityFilter === 'all' || d.priority === priorityFilter;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.subject.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const openAdd = () => {
    setEditingId(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setForm({ ...defaultForm, dueDate: tomorrow.toISOString().split('T')[0] });
    setShowModal(true);
  };

  const openEdit = (deadline: Deadline) => {
    setEditingId(deadline.id);
    setForm({
      title: deadline.title,
      subject: deadline.subject,
      dueDate: deadline.dueDate,
      priority: deadline.priority,
      completed: deadline.completed,
      description: deadline.description,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    if (editingId) {
      updateDeadline(editingId, form);
    } else {
      addDeadline(form);
    }
    setShowModal(false);
  };

  const getDaysUntil = (dueDate: string) => {
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDueDateLabel = (dueDate: string) => {
    const diff = getDaysUntil(dueDate);
    if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: 'var(--danger)' };
    if (diff === 0) return { label: 'Due today', color: 'var(--danger)' };
    if (diff === 1) return { label: 'Due tomorrow', color: 'var(--warning)' };
    if (diff <= 3) return { label: `${diff} days left`, color: 'var(--warning)' };
    return { label: `${diff} days left`, color: 'var(--success)' };
  };

  const getPriorityBadgeClass = (priority: string) => {
    if (priority === 'high') return 'badge badge-danger';
    if (priority === 'medium') return 'badge badge-warning';
    return 'badge badge-success';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const pendingCount = deadlines.filter(d => !d.completed).length;
  const completedCount = deadlines.filter(d => d.completed).length;
  const overdueCount = deadlines.filter(d => !d.completed && getDaysUntil(d.dueDate) < 0).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Deadlines & Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {pendingCount} pending · {completedCount} completed {overdueCount > 0 ? `· ${overdueCount} overdue` : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Deadline</button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="🔍 Search deadlines..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          style={{ width: 'auto' }}
          value={filter}
          onChange={e => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="form-input"
          style={{ width: 'auto' }}
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {sortedDeadlines.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title">
              {search || filter !== 'all' || priorityFilter !== 'all' ? 'No deadlines found' : 'No deadlines yet'}
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              {search || filter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Add your first deadline to stay on track.'}
            </p>
            {!search && filter === 'all' && priorityFilter === 'all' && (
              <button className="btn btn-primary" onClick={openAdd}>+ Add Deadline</button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedDeadlines.map(deadline => {
            const dueDateInfo = getDueDateLabel(deadline.dueDate);
            return (
              <div
                key={deadline.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  opacity: deadline.completed ? 0.65 : 1,
                  transition: 'opacity 0.2s'
                }}
              >
                <button
                  onClick={() => toggleDeadline(deadline.id)}
                  style={{
                    width: '22px', height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${deadline.completed ? 'var(--success)' : 'var(--border)'}`,
                    background: deadline.completed ? 'var(--success)' : 'transparent',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '2px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {deadline.completed ? '✓' : ''}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                    <span style={{
                      fontWeight: 600, fontSize: '0.9375rem',
                      textDecoration: deadline.completed ? 'line-through' : 'none'
                    }}>
                      {deadline.title}
                    </span>
                    <span className={getPriorityBadgeClass(deadline.priority)}>
                      {deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)}
                    </span>
                    {deadline.completed && <span className="badge badge-success">Completed</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {deadline.subject && (
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>📚 {deadline.subject}</span>
                    )}
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>📅 {formatDate(deadline.dueDate)}</span>
                    {!deadline.completed && (
                      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: dueDateInfo.color }}>
                        {dueDateInfo.label}
                      </span>
                    )}
                  </div>
                  {deadline.description && (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                      {deadline.description}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => openEdit(deadline)}
                  >Edit</button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => deleteDeadline(deadline.id)}
                  >Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Deadline' : 'Add Deadline'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Math Problem Set"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={form.subject}
                    onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                      style={{
                        flex: 1, padding: '0.5rem',
                        borderRadius: 'var(--radius)',
                        border: `2px solid ${form.priority === p ? (p === 'high' ? 'var(--danger)' : p === 'medium' ? 'var(--warning)' : 'var(--success)') : 'var(--border)'}`,
                        background: form.priority === p ? (p === 'high' ? '#fee2e2' : p === 'medium' ? '#fef3c7' : '#d1fae5') : 'white',
                        color: form.priority === p ? (p === 'high' ? 'var(--danger)' : p === 'medium' ? '#92400e' : 'var(--success)') : 'var(--text-secondary)',
                        fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                        transition: 'all 0.2s',
                        textTransform: 'capitalize'
                      }}
                    >
                      {p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'} {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Additional details..."
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add Deadline'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
