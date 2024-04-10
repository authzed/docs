// Forked from https://github.com/shuding/nextra/blob/2e78fe5f52a523399eb491fe525b67c7534f2f0e/packages/nextra-theme-docs/src/types.ts
import { ReactNode } from 'react';

export type SearchResult = {
  children: ReactNode;
  id: string;
  prefix?: ReactNode;
  route: string;
};
