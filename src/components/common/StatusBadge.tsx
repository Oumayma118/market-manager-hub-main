import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'available' | 'rented' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isAvailable = status === 'available';
  
  return (
    <span
      className={cn(
        'badge-status',
        isAvailable ? 'badge-available' : 'badge-rented',
        className
      )}
    >
      {isAvailable ? 'Disponible' : 'Loué'}
    </span>
  );
}
