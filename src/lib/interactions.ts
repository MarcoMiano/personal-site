import type { Locale } from './site';

export const themeModes = ['auto', 'dark', 'bright'] as const;
export type ThemeMode = (typeof themeModes)[number];

export const themeStorageKey = 'miano.theme';
export const bootSessionKey = 'miano.bootSeen';

type ThemeCopy = {
  control: string;
  activate: string;
  modes: Record<ThemeMode, string>;
};

type InteractionCopy = {
  theme: ThemeCopy;
  palette: {
    open: string;
    title: string;
    filter: string;
    placeholder: string;
    navigation: string;
    close: string;
    noResults: string;
    resultCount: string;
  };
  help: {
    open: string;
    title: string;
    introduction: string;
    close: string;
    commands: {
      palette: string;
      theme: string;
      help: string;
      close: string;
    };
  };
  shortcuts: string;
  effects: {
    boot: string;
    skip: string;
    legacyHandle: string;
  };
};

export const interactionCopy = {
  it: {
    theme: {
      control: 'Tema',
      activate: 'Attiva',
      modes: {
        auto: 'auto',
        dark: 'scuro',
        bright: 'chiaro',
      },
    },
    palette: {
      open: 'Comandi',
      title: 'Palette dei comandi',
      filter: 'Filtra destinazioni',
      placeholder: 'es. progetti, cv, contatti',
      navigation: 'Navigazione',
      close: 'Chiudi',
      noResults: 'Nessuna destinazione corrispondente.',
      resultCount: '{count} destinazioni disponibili.',
    },
    help: {
      open: 'Aiuto',
      title: 'Scorciatoie da tastiera',
      introduction:
        'Le scorciatoie globali sono disattivate mentre scrivi in un campo. Tutte le azioni restano disponibili come controlli e link normali.',
      close: 'Chiudi',
      commands: {
        palette: 'Apri la palette dei comandi',
        theme: 'Cambia tema: auto, scuro, chiaro',
        help: 'Apri o chiudi questo aiuto',
        close: 'Chiudi la finestra attiva',
      },
    },
    shortcuts: 'Scorciatoie del sito',
    effects: {
      boot: 'Inizializzazione interfaccia',
      skip: 'Salta',
      legacyHandle: 'Handle storico: Ev3r',
    },
  },
  en: {
    theme: {
      control: 'Theme',
      activate: 'Switch to',
      modes: {
        auto: 'auto',
        dark: 'dark',
        bright: 'bright',
      },
    },
    palette: {
      open: 'Commands',
      title: 'Command palette',
      filter: 'Filter destinations',
      placeholder: 'e.g. projects, cv, contact',
      navigation: 'Navigation',
      close: 'Close',
      noResults: 'No matching destination.',
      resultCount: '{count} destinations available.',
    },
    help: {
      open: 'Help',
      title: 'Keyboard shortcuts',
      introduction:
        'Global shortcuts are disabled while you type in a field. Every action remains available through ordinary controls and links.',
      close: 'Close',
      commands: {
        palette: 'Open the command palette',
        theme: 'Cycle theme: auto, dark, bright',
        help: 'Open or close this help',
        close: 'Close the active window',
      },
    },
    shortcuts: 'Site shortcuts',
    effects: {
      boot: 'Interface initialization',
      skip: 'Skip',
      legacyHandle: 'Legacy handle: Ev3r',
    },
  },
} as const satisfies Record<Locale, InteractionCopy>;

export const interactionRegistry = {
  palette: {
    shortcut: {
      key: 'p',
      altKey: true,
      display: 'Alt+P',
      nanoDisplay: 'M-P',
    },
  },
  theme: {
    shortcut: {
      key: 't',
      altKey: true,
      display: 'Alt+T',
      nanoDisplay: 'M-T',
    },
  },
  help: {
    shortcut: {
      key: 'h',
      altKey: true,
      display: 'Alt+H',
      nanoDisplay: 'M-H',
    },
  },
  close: {
    shortcut: {
      key: 'Escape',
      display: 'Esc',
      aria: 'Escape',
    },
  },
} as const;

export function isThemeMode(value: string | null): value is ThemeMode {
  return themeModes.some((mode) => mode === value);
}

export function getNextThemeMode(mode: ThemeMode): ThemeMode {
  return themeModes[(themeModes.indexOf(mode) + 1) % themeModes.length];
}
