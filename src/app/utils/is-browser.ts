// src/app/utils/is-browser.ts
export function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
  