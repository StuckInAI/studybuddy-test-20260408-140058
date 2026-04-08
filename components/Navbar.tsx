'use client';

import { TabType } from '../app/page';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'deadlines', label: 'Deadlines', icon: '⏰' },
  ];

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)' }}>StudyManager</span>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>{tab.icon}</span>
              <span className="nav-label-visible">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .nav-label-visible { display: none; }
        }
      `}</style>
    </nav>
  );
}
