'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Schedule from '../components/Schedule';
import Notes from '../components/Notes';
import Deadlines from '../components/Deadlines';
import { AppProvider } from '../components/AppContext';

export type TabType = 'dashboard' | 'schedule' | 'notes' | 'deadlines';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'schedule':
        return <Schedule />;
      case 'notes':
        return <Notes />;
      case 'deadlines':
        return <Deadlines />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AppProvider>
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
          <div className="container">
            {renderContent()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
