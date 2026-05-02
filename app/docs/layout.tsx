import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';
import 'katex/dist/katex.css';

import { DocsBackground } from './DocsBackground';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsBackground />
      <DocsLayout
        tree={source.pageTree}
        nav={{ title: 'SigmaVote Docs' }}
      >
        {children}
      </DocsLayout>
    </>
  );
}
