import { useEffect } from 'react';

interface ShortcutActions {
  onTabChange: (tab: string) => void;
  onToggleTheme: () => void;
  onToggleNotifications: () => void;
  onToggleSearch: () => void;
  onToggleShortcutsHelp: () => void;
  onCloseAll: () => void;
}

const tabMap: Record<string, string> = {
  '1': 'overview',
  '2': 'network',
  '3': 'projects',
  '4': 'accountability',
  '5': 'regional',
  '6': 'institutions',
  '7': 'ai-gaps',
  '8': 'simulation',
  '9': 'trust',
};

export function useKeyboardShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput) return;

      // Tab switching: 1-9
      if (tabMap[e.key]) {
        e.preventDefault();
        actions.onTabChange(tabMap[e.key]);
        return;
      }

      // Theme toggle: T
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        actions.onToggleTheme();
        return;
      }

      // Notifications: N
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        actions.onToggleNotifications();
        return;
      }

      // Search: / or Cmd+K
      if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        actions.onToggleSearch();
        return;
      }

      // Escape: close all
      if (e.key === 'Escape') {
        actions.onCloseAll();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);
}
