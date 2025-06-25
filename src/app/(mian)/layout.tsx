import { Suspense } from 'react';

export default function Page({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
