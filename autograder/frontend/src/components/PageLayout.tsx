import { ReactNode, useState, createContext, useContext } from 'react';
import { NotesPanel } from './NotesPanel';

/* ── Notes panel context (shared with TopNav) ── */
interface NotesPanelContextType {
  notesPanelOpen: boolean;
  toggleNotesPanel: () => void;
}

const NotesPanelContext = createContext<NotesPanelContextType>({
  notesPanelOpen: false,
  toggleNotesPanel: () => { },
});

export function useNotesPanel() {
  return useContext(NotesPanelContext);
}

interface PageLayoutProps {
  children: ReactNode;
}

/**
 * PageLayout Component
 * Provides consistent layout with fixed TopNav
 * Adds 64px top padding to account for fixed navigation bar
 */
export function PageLayout({ children }: PageLayoutProps) {
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);
  const toggleNotesPanel = () => setNotesPanelOpen(prev => !prev);

  return (
    <NotesPanelContext.Provider value={{ notesPanelOpen, toggleNotesPanel }}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: 'var(--color-primary-bg)',
          color: 'var(--color-text-dark)',
          paddingTop: '64px' // Account for fixed TopNav height
        }}
      >
        {children}

        {/* Global Notes & Todos Panel */}
        <NotesPanel open={notesPanelOpen} onClose={() => setNotesPanelOpen(false)} />
      </div>
    </NotesPanelContext.Provider>
  );
}
