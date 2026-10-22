import { cn } from '../utils/cn';

type LoadingSkeletonProps = {
  className?: string;
};

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return <div className={cn('animate-pulse rounded-2xl bg-gradient-to-r from-[#eef8f5] via-[#f5f1e7] to-[#e8f3ef] bg-[length:200%_100%]', className)} />;
}