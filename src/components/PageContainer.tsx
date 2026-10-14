import { cn } from '../utils/cn';
import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn('mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10', className)}>{children}</div>;
}