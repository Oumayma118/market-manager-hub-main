import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={cn(sizeStyles[size], 'animate-spin text-primary')} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

import { cn } from '@/lib/utils';
