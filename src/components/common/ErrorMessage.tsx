import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <p className="font-medium text-foreground">Une erreur est survenue</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Réessayer
        </Button>
      )}
    </div>
  );
}
