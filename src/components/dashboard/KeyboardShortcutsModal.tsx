import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ShortcutGroup {
  title: string;
  shortcuts: { keys: string[]; description: string }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['1'], description: 'Overview tab' },
      { keys: ['2'], description: 'Network tab' },
      { keys: ['3'], description: 'Projects tab' },
      { keys: ['4'], description: 'Accountability tab' },
      { keys: ['5'], description: 'Regional tab' },
      { keys: ['6'], description: 'Institutions tab' },
      { keys: ['7'], description: 'AI Gaps tab' },
      { keys: ['8'], description: 'Simulation tab' },
      { keys: ['9'], description: 'Trust tab' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open search' },
      { keys: ['/'], description: 'Open search' },
      { keys: ['T'], description: 'Toggle theme' },
      { keys: ['N'], description: 'Toggle notifications' },
      { keys: ['?'], description: 'Show shortcuts' },
      { keys: ['Esc'], description: 'Close all panels' },
    ],
  },
];

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-[10px] font-mono">?</kbd> to toggle this panel
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((s) => (
                  <div
                    key={s.description + s.keys.join('')}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm text-foreground">{s.description}</span>
                    <div className="flex items-center gap-1">
                      {s.keys.map((key, i) => (
                        <span key={i}>
                          <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded border border-border bg-muted text-[11px] font-mono text-muted-foreground">
                            {key}
                          </kbd>
                          {i < s.keys.length - 1 && (
                            <span className="text-[10px] text-muted-foreground mx-0.5">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
