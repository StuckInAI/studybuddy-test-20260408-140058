'use client';

import { useState } from 'react';
import { useApp, Note } from './AppContext';

type FormData = {
  title: string;
  content: string;
  subject: string;
  tags: string[];
};

const defaultForm: FormData = {
  title: '',
  content: '',
  subject: '',
  tags: [],
};

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [filterSubject, setFilterSubject] = useState('All');

  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject).filter(Boolean)))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.subject.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'All' || note.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(defaultForm);
    setTagInput('');
    setShowModal(true);
  };

  const openEdit = (note: Note) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, subject: note.subject, tags: note.tags });
    setTagInput('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    if (editingId) {
      updateNote(editingId, form);
    } else {
      addNote(form);
    }
    setShowModal(false);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Notes</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {notes.length} notes saved
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ New Note</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="🔍 Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
        >
          {subjects.map(s => <option key={s} value={s}>{s === 'All' ? 'All Subjects' : s}</option>)}
        </select>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📓</div>
            <div className="empty-state-title">{search || filterSubject !== 'All' ? 'No notes found' : 'No notes yet'}</div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              {search || filterSubject !== 'All' ? 'Try a different search term or filter.' : 'Start capturing your thoughts and study notes.'}
            </p>
            {!search && filterSubject === 'All' && (
              <button className="btn btn-primary" onClick={openAdd}>+ New Note</button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {filteredNotes.map(note => (
            <div key={note.id} className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onClick={() => setViewingNote(note)}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', flex: 1, marginRight: '0.5rem' }}>{note.title}</h3>
                <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={e => { e.stopPropagation(); openEdit(note); }}
                  >✏️</button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                  >🗑️</button>
                </div>
              </div>
              {note.subject && (
                <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{note.subject}</span>
              )}
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                {note.content}
              </p>
              {note.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {note.tags.map(tag => (
                    <span key={tag} style={{ background: '#f1f5f9', color: 'var(--text-secondary)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem' }}>#{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                Updated {formatDate(note.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingNote && (
        <div className="modal-overlay" onClick={() => setViewingNote(null)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{viewingNote.title}</h2>
              <button className="modal-close" onClick={() => setViewingNote(null)}>×</button>
            </div>
            <div>
              {viewingNote.subject && (
                <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-flex' }}>{viewingNote.subject}</span>
              )}
              <pre style={{ fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: '1rem' }}>
                {viewingNote.content}
              </pre>
              {viewingNote.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {viewingNote.tags.map(tag => (
                    <span key={tag} style={{ background: '#f1f5f9', color: 'var(--text-secondary)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>#{tag}</span>
                  ))}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Created {formatDate(viewingNote.createdAt)}</span>
                <span>Updated {formatDate(viewingNote.updatedAt)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" onClick={() => { setViewingNote(null); openEdit(viewingNote); }}>Edit Note</button>
                <button className="btn btn-secondary" onClick={() => setViewingNote(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingId ? 'Edit Note' : 'New Note'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Note title"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
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
                <label className="form-label">Content *</label>
                <textarea
                  className="form-input"
                  placeholder="Write your notes here..."
                  value={form.content}
                  onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tags</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                  <button type="button" className="btn btn-secondary" onClick={handleAddTag} style={{ flexShrink: 0 }}>Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {form.tags.map(tag => (
                      <span key={tag} style={{ background: '#ede9fe', color: '#6d28d9', padding: '0.2rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        #{tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6d28d9', fontWeight: 700, padding: 0, lineHeight: 1 }}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Note' : 'Save Note'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
