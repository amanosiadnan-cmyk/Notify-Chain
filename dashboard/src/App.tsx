import { useState } from 'react';
import { EventExplorerPage } from './pages/EventExplorerPage';
import { ExportHistoryPage } from './pages/ExportHistoryPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'exports'>('explorer');

  return (
    <div className="app">
      <nav className="nav-header">
        <span className="nav-brand">Notify-Chain</span>
        <div className="nav-tabs">
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'explorer' ? 'nav-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            Event Explorer
          </button>
          <button
            type="button"
            className={`nav-tab-btn ${activeTab === 'exports' ? 'nav-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('exports')}
          >
            Export Center
          </button>
        </div>
      </nav>

      {activeTab === 'explorer' ? <EventExplorerPage /> : <ExportHistoryPage />}
    </div>
  );
}
