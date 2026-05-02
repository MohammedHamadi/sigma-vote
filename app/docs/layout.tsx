import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import 'katex/dist/katex.css';

import { DocsBackground } from './DocsBackground';

import { RootProvider } from 'fumadocs-ui/provider/next';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ forcedTheme: 'dark' }}>
      <DocsBackground />
      <DocsLayout
        tree={source.pageTree}
        nav={{ title: 'SigmaVote Docs' }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
