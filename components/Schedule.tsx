'use client';

import { useState } from 'react';
import { useApp, ScheduleItem } from './AppContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

type FormData = Omit<ScheduleItem, 'id'>;

const defaultForm: FormData = {
  subject: '',
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:00',
  location: '',
  color: '#4f46e5',
};

export default function Schedule() {
  const { scheduleItems, addScheduleItem, updateScheduleItem, deleteScheduleItem } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [activeDay, setActiveDay] = useState('All');

  const filteredItems = activeDay === 'All' ? scheduleItems : scheduleItems.filter(item => item.day === activeDay);
  const sortedItems = [...filteredItems].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setForm({ subject: item.subject, day: item.day, startTime: item.startTime, endTime: item.endTime, location: item.location, color: item.color });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    if (editingId) {
      updateScheduleItem(editingId, form);
    } else {
      addScheduleItem(form);
    }
    setShowModal(false);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Study Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {scheduleItems.length} classes scheduled
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Class
        </button>
      </div>

      <div className="tabs">
        {['All', ...DAYS].map(day => (
          <button
            key={day}
            className={`tab ${activeDay === day ? 'active' : ''}`}
            onClick={() => setActiveDay(day)}
          >
            {day === 'All' ? 'All Days' : day.slice(0, 3)}
          </button>
        ))}
      </div>

      {sortedItems.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <div className="empty-state-title">No classes scheduled</div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Add your first class to get started.</p>
            <button className="btn btn-primary" onClick={openAdd}>+ Add Class</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedItems.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${item.color}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>{item.subject}</span>
                  <span className="badge badge-primary">{item.day}</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    🕐 {item.startTime} - {item.endTime}
                  </span>
                  {item.location && (
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      📍 {item.location}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openEdit(item)}>Edit</button>
                <button className="btn btn-danger" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8rem' }} onClick={() => deleteScheduleItem(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Class' : 'Add New Class'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={form.subject}
                  onChange={e => handleChange('subject', e.target.value)}
                  required
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Day</label>
                  <select className="form-input" value={form.day} onChange={e => handleChange('day', e.target.value)}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Room 101"
                    value={form.location}
                    onChange={e => handleChange('location', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    className="form-input"
                    type="time"
                    value={form.startTime}
                    onChange={e => handleChange('startTime', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    className="form-input"
                    type="time"
                    value={form.endTime}
                    onChange={e => handleChange('endTime', e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('color', color)}
                      style={{
                        width: '32px', height: '32px',
                        borderRadius: '50%',
                        background: color,
                        border: form.color === color ? '3px solid var(--text-primary)' : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
