'use client';

import { useEffect } from 'react';

export function DocsBackground() {
  useEffect(() => {
    // Override the global body background color while in the docs
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'var(--sidebar)';
    
    return () => {
      // Restore on unmount (navigation away from docs)
      document.body.style.backgroundColor = originalBg;
    };
  }, []);
  
  return null;
}
