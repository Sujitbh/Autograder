import { ReactNode, useState, useMemo, useCallback, createContext, useContext } from 'react';
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
export function PageLayout({ children }: Readonly<PageLayoutProps>) {
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);
  const toggleNotesPanel = useCallback(() => setNotesPanelOpen(prev => !prev), []);

  const contextValue = useMemo(
    () => ({ notesPanelOpen, toggleNotesPanel }),
    [notesPanelOpen, toggleNotesPanel]
  );

  return (
    <NotesPanelContext.Provider value={contextValue}>
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
