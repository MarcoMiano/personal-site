export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];

export const pageKeys = [
  'home',
  'cv',
  'projects',
  'notes',
  'lab',
  'contact',
  'credits',
  'privacy',
] as const;
export type PageKey = (typeof pageKeys)[number];

type LocalizedText = Record<Locale, string>;

export const contactEmail = 'hello@post.miano.cloud';

type PageDefinition = {
  segment: '' | Exclude<PageKey, 'home'>;
  nav: boolean;
  listed: boolean;
  indexable: boolean;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  heading: LocalizedText;
  introduction: LocalizedText;
};

export const pages = {
  home: {
    segment: '',
    nav: true,
    listed: true,
    indexable: true,
    label: { it: 'Home', en: 'Home' },
    title: {
      it: 'Marco Miano — Software, automazione AV e infrastrutture',
      en: 'Marco Miano — Software, AV automation and infrastructure',
    },
    description: {
      it: 'Software, automazione AV e infrastrutture.',
      en: 'Software, AV automation, and infrastructure.',
    },
    heading: {
      it: 'Sistemi, segnali e software.',
      en: 'Systems, signals, and software.',
    },
    introduction: {
      it: 'Costruisco e mantengo strumenti tecnici tra software, hardware, automazione AV e infrastrutture.',
      en: 'I build and maintain technical tools across software, hardware, AV automation, and infrastructure.',
    },
  },
  cv: {
    segment: 'cv',
    nav: true,
    listed: true,
    indexable: true,
    label: { it: 'CV', en: 'CV' },
    title: { it: 'CV — Marco Miano', en: 'CV — Marco Miano' },
    description: {
      it: 'Esperienza professionale, competenze e formazione.',
      en: 'Professional experience, skills, and education.',
    },
    heading: { it: 'Curriculum vitae', en: 'Curriculum vitae' },
    introduction: {
      it: 'Esperienza, competenze e formazione in un curriculum bilingue strutturato.',
      en: 'Experience, skills, and education in a structured bilingual CV.',
    },
  },
  projects: {
    segment: 'projects',
    nav: true,
    listed: true,
    indexable: true,
    label: { it: 'Progetti', en: 'Projects' },
    title: { it: 'Progetti — Marco Miano', en: 'Projects — Marco Miano' },
    description: {
      it: 'Progetti software, automazione AV e infrastrutture.',
      en: 'Software, AV automation, and infrastructure projects.',
    },
    heading: { it: 'Progetti', en: 'Projects' },
    introduction: {
      it: 'Software, automazione AV e infrastrutture, dal problema al risultato.',
      en: 'Software, AV automation, and infrastructure, from problem to outcome.',
    },
  },
  notes: {
    segment: 'notes',
    nav: true,
    listed: false,
    indexable: false,
    label: { it: 'Note', en: 'Notes' },
    title: {
      it: 'Note tecniche — Marco Miano',
      en: 'Technical notes — Marco Miano',
    },
    description: {
      it: 'Note tecniche e guide.',
      en: 'Technical notes and guides.',
    },
    heading: { it: 'Note tecniche', en: 'Technical notes' },
    introduction: {
      it: 'Appunti tecnici e guide riproducibili.',
      en: 'Reproducible technical notes and guides.',
    },
  },
  lab: {
    segment: 'lab',
    nav: true,
    listed: false,
    indexable: false,
    label: { it: 'Lab', en: 'Lab' },
    title: { it: 'Lab — Marco Miano', en: 'Lab — Marco Miano' },
    description: {
      it: 'Esperimenti e prototipi tecnici.',
      en: 'Technical experiments and prototypes.',
    },
    heading: { it: 'Laboratorio', en: 'Lab' },
    introduction: {
      it: 'Esperimenti, prototipi e risultati parziali, separati dai progetti finiti.',
      en: 'Experiments, prototypes, and partial results, kept separate from finished projects.',
    },
  },
  contact: {
    segment: 'contact',
    nav: true,
    listed: true,
    indexable: true,
    label: { it: 'Contatti', en: 'Contact' },
    title: { it: 'Contatti — Marco Miano', en: 'Contact — Marco Miano' },
    description: {
      it: 'Contatti professionali e collegamenti esterni.',
      en: 'Professional contact details and external links.',
    },
    heading: { it: 'Contatti e link', en: 'Contact and links' },
    introduction: {
      it: 'Profili pubblici e un canale di contatto dedicato.',
      en: 'Public profiles and a dedicated contact channel.',
    },
  },
  credits: {
    segment: 'credits',
    nav: false,
    listed: true,
    indexable: false,
    label: { it: 'Crediti', en: 'Credits' },
    title: { it: 'Crediti — Marco Miano', en: 'Credits — Marco Miano' },
    description: {
      it: 'Strumenti e risorse di terze parti usati per costruire miano.cloud.',
      en: 'Tools and third-party resources used to build miano.cloud.',
    },
    heading: { it: 'Crediti', en: 'Credits' },
    introduction: {
      it: 'Strumenti principali, risorse visive e attribuzioni del sito.',
      en: 'Primary tools, visual resources, and site attributions.',
    },
  },
  privacy: {
    segment: 'privacy',
    nav: false,
    listed: true,
    indexable: false,
    label: { it: 'Privacy', en: 'Privacy' },
    title: { it: 'Privacy — Marco Miano', en: 'Privacy — Marco Miano' },
    description: {
      it: 'Privacy e dati tecnici su miano.cloud.',
      en: 'Privacy and technical data on miano.cloud.',
    },
    heading: { it: 'Privacy', en: 'Privacy' },
    introduction: {
      it: 'Dati trattati dal sito, log tecnici e preferenze salvate nel browser.',
      en: 'Site data, operational logs, and preferences stored in the browser.',
    },
  },
} as const satisfies Record<PageKey, PageDefinition>;

export const listedPageKeys = pageKeys.filter((page) => pages[page].listed);

export const ui = {
  it: {
    primaryNavigation: 'Navigazione principale',
    languageNavigation: 'Selezione lingua',
    skipToContent: 'Vai al contenuto',
    provisional: 'Bozza strutturale — contenuti in revisione',
    footerStatus: 'Sito statico, nessun tracciamento.',
    footerNavigation: 'Informazioni sul sito',
    footerBuildRevision: 'Revisione sorgente completa',
  },
  en: {
    primaryNavigation: 'Primary navigation',
    languageNavigation: 'Language selection',
    skipToContent: 'Skip to content',
    provisional: 'Structural draft — content under review',
    footerStatus: 'Static site, no tracking.',
    footerNavigation: 'Site information',
    footerBuildRevision: 'Full source revision',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function getPath(locale: Locale, page: PageKey): string {
  const segment = pages[page].segment;
  const localizedRoot = locale === 'en' ? '/en' : '';
  return `${localizedRoot}/${segment}${segment ? '/' : ''}`;
}

export function getLocalizedPaths(page: PageKey) {
  return {
    it: getPath('it', page),
    en: getPath('en', page),
  } as const;
}

export function getIndexablePaths(): string[] {
  return pageKeys.flatMap((page) =>
    pages[page].indexable ? locales.map((locale) => getPath(locale, page)) : [],
  );
}
