export interface FontOption {
  id: string;
  name: string;
  className: string;
  category: 'handwriting' | 'script' | 'serif' | 'typewriter' | 'rounded';
  sample: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'caveat',
    name: 'Romantic Cursive',
    className: 'font-caveat',
    category: 'script',
    sample: 'Dearest memory, my heart is full today ♡',
    description: 'Soft & intimate flowing cursive handwriting'
  },
  {
    id: 'indie-flower',
    name: 'Cute Doodle Pen',
    className: 'font-indie-flower',
    category: 'handwriting',
    sample: 'Had the sweetest day with him ✨',
    description: 'Playful, bubbly doodle notebook handwriting'
  },
  {
    id: 'dancing-script',
    name: 'Dancing Calligraphy',
    className: 'font-dancing-script',
    category: 'script',
    sample: 'Every little moment with you is precious...',
    description: 'Graceful & romantic letter script'
  },
  {
    id: 'patrick-hand',
    name: 'Neat Diary Note',
    className: 'font-patrick-hand',
    category: 'handwriting',
    sample: 'Today was full of laughter and peace 🌸',
    description: 'Clean & readable classroom notebook style'
  },
  {
    id: 'playfair',
    name: 'Fairytale Storybook',
    className: 'font-playfair',
    category: 'serif',
    sample: 'And so a beautiful chapter begins.',
    description: 'Elegant literary & romantic book serif'
  },
  {
    id: 'typewriter',
    name: 'Vintage Typewriter',
    className: 'font-typewriter',
    category: 'typewriter',
    sample: 'A secret memory preserved forever in time.',
    description: 'Nostalgic retro letter typewriter'
  },
  {
    id: 'quicksand',
    name: 'Sweet Rounded',
    className: 'font-quicksand',
    category: 'rounded',
    sample: 'Hello Kitty thoughts and dreams 🎀',
    description: 'Cute, smooth modern sans'
  },
  {
    id: 'nunito',
    name: 'Classic Hello Kitty',
    className: 'font-nunito',
    category: 'rounded',
    sample: 'Hello Kitty Secret Journal ✨',
    description: 'The signature bubbly diary font'
  }
];

export type PaperStyle = 'lined' | 'grid' | 'plain';

export interface PaperOption {
  id: PaperStyle;
  name: string;
  className: string;
  description: string;
}

export const PAPER_OPTIONS: PaperOption[] = [
  { id: 'lined', name: 'Notebook Ruled', className: 'paper-lined', description: 'Soft pink diary lines' },
  { id: 'grid', name: 'Grid Paper', className: 'paper-grid', description: 'Cute pastel graph paper' },
  { id: 'plain', name: 'Clean Page', className: 'paper-blank', description: 'Smooth minimal page' },
];

export function getGlobalFont(): string {
  if (typeof window === 'undefined') return 'caveat';
  return localStorage.getItem('kitty_global_font') || 'caveat';
}

export function setGlobalFont(fontId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kitty_global_font', fontId);
  window.dispatchEvent(new CustomEvent('kitty-font-changed', { detail: fontId }));
}

export function getGlobalPaper(): PaperStyle {
  if (typeof window === 'undefined') return 'lined';
  return (localStorage.getItem('kitty_paper_style') as PaperStyle) || 'lined';
}

export function setGlobalPaper(paper: PaperStyle) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kitty_paper_style', paper);
  window.dispatchEvent(new CustomEvent('kitty-paper-changed', { detail: paper }));
}

export function getGlobalFontSize(): string {
  if (typeof window === 'undefined') return 'medium';
  return localStorage.getItem('kitty_font_size') || 'medium';
}

export function setGlobalFontSize(size: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kitty_font_size', size);
  window.dispatchEvent(new CustomEvent('kitty-font-size-changed', { detail: size }));
}

export function getEntryFont(tags?: string[]): FontOption {
  if (tags && tags.length > 0) {
    const fontTag = tags.find(t => t.startsWith('font:'));
    if (fontTag) {
      const fontId = fontTag.replace('font:', '');
      const found = FONT_OPTIONS.find(f => f.id === fontId);
      if (found) return found;
    }
  }
  const globalId = getGlobalFont();
  return FONT_OPTIONS.find(f => f.id === globalId) || FONT_OPTIONS[0];
}

export function getEntryPaper(tags?: string[]): PaperOption {
  if (tags && tags.length > 0) {
    const paperTag = tags.find(t => t.startsWith('paper:'));
    if (paperTag) {
      const paperId = paperTag.replace('paper:', '') as PaperStyle;
      const found = PAPER_OPTIONS.find(p => p.id === paperId);
      if (found) return found;
    }
  }
  const globalPaper = getGlobalPaper();
  return PAPER_OPTIONS.find(p => p.id === globalPaper) || PAPER_OPTIONS[0];
}

export function cleanDisplayTags(tags?: string[]): string[] {
  if (!tags) return [];
  return tags.filter(t => !t.startsWith('font:') && !t.startsWith('paper:'));
}
