'use client';

import { useApp } from './AppContext';
import { TabType } from '../app/page';

interface DashboardProps {
  setActiveTab: (tab: TabType) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { scheduleItems, notes, deadlines } = useApp();

  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[today.getDay()];
  const todaySchedule = scheduleItems.filter(item => item.day === todayName);
  const pendingDeadlines = deadlines.filter(d => !d.completed);
  const urgentDeadlines = pendingDeadlines.filter(d => {
    const due = new Date(d.dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 3;
  });
  const completedDeadlines = deadlines.filter(d => d.completed);
  const completionRate = deadlines.length > 0 ? Math.round((completedDeadlines.length / deadlines.length) * 100) : 0;

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'var(--danger)';
    if (priority === 'medium') return 'var(--warning)';
    return 'var(--success)';
  };

  const getDaysUntil = (dueDate: string) => {
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Due today';
    if (diff === 1) return 'Due tomorrow';
    return `${diff} days left`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const statsCards = [
    { label: 'Classes Today', value: todaySchedule.length, icon: '📚', color: 'var(--primary)', bgColor: '#ede9fe' },
    { label: 'Pending Tasks', value: pendingDeadlines.length, icon: '📋', color: 'var(--warning)', bgColor: '#fef3c7' },
    { label: 'Urgent Deadlines', value: urgentDeadlines.length, icon: '🚨', color: 'var(--danger)', bgColor: '#fee2e2' },
    { label: 'Total Notes', value: notes.length, icon: '📝', color: 'var(--secondary)', bgColor: '#e0f2fe' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>Good {getGreeting()}, Student! 👋</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {statsCards.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px', height: '48px',
              background: stat.bgColor,
              borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', flexShrink: 0
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Today&apos;s Schedule</h2>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }} onClick={() => setActiveTab('schedule')}>
              View All
            </button>
          </div>
          {todaySchedule.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <div className="empty-state-title">No classes today!</div>
              <p style={{ fontSize: '0.875rem' }}>Enjoy your free day or use it to study ahead.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todaySchedule.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius)',
                  borderLeft: `4px solid ${item.color}`
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.subject}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
                      {item.startTime} - {item.endTime} · {item.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Upcoming Deadlines</h2>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }} onClick={() => setActiveTab('deadlines')}>
              View All
            </button>
          </div>
          {pendingDeadlines.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <div className="empty-state-title">All caught up!</div>
              <p style={{ fontSize: '0.875rem' }}>No pending deadlines. Great work!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingDeadlines.slice(0, 4).map(deadline => (
                <div key={deadline.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius)'
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: getPriorityColor(deadline.priority), flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deadline.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{deadline.subject}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: getPriorityColor(deadline.priority), fontWeight: 500, flexShrink: 0 }}>
                    {getDaysUntil(deadline.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1rem' }}>Recent Notes</h2>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }} onClick={() => setActiveTab('notes')}>
              View All
            </button>
          </div>
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📓</div>
              <div className="empty-state-title">No notes yet</div>
              <p style={{ fontSize: '0.875rem' }}>Start taking notes to keep track of what you learn.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notes.slice(0, 3).map(note => (
                <div key={note.id} style={{
                  padding: '0.75rem',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{note.title}</div>
                    <span className="badge badge-primary" style={{ marginLeft: '0.5rem', flexShrink: 0 }}>{note.subject}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {note.content.substring(0, 80)}...
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.375rem' }}>
                    Updated {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>Completion Progress</h2>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Task Completion</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{completionRate}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${completionRate}%`, background: 'var(--success)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{completedDeadlines.length} completed</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pendingDeadlines.length} remaining</span>
            </div>
          </div>

          <h3 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Weekly Classes', value: scheduleItems.length, icon: '📚' },
              { label: 'Total Deadlines', value: deadlines.length, icon: '📋' },
              { label: 'Notes Created', value: notes.length, icon: '📝' },
              { label: 'High Priority Tasks', value: deadlines.filter(d => d.priority === 'high' && !d.completed).length, icon: '🔥' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                <span style={{ fontSize: '0.875rem' }}>{stat.icon} {stat.label}</span>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
