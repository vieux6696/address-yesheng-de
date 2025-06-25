'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  className?: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {children}
    </div>
  );
};

const SheetContent: React.FC<SheetContentProps> = ({
  className,
  children,
  side = 'right',
}) => {
  const sideClasses = {
    right: 'right-0 top-0 h-full w-80 translate-x-0',
    left: 'left-0 top-0 h-full w-80 -translate-x-0',
    top: 'top-0 left-0 right-0 h-80 translate-y-0',
    bottom: 'bottom-0 left-0 right-0 h-80 translate-y-0',
  };

  return (
    <div
      className={cn(
        'fixed bg-background shadow-lg border-l border-border animate-in slide-in-from-right duration-300',
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  );
};

const SheetHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={cn(
      'flex flex-col space-y-2 p-4 border-b border-border',
      className
    )}
  >
    {children}
  </div>
);

const SheetTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <h2 className={cn('text-lg font-semibold', className)}>{children}</h2>
);

const SheetDescription: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
);

const SheetClose: React.FC<{ className?: string; onClose?: () => void }> = ({
  className,
  onClose,
}) => (
  <button
    onClick={onClose}
    className={cn(
      'absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity',
      className
    )}
  >
    <X className="h-4 w-4" />
  </button>
);

export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
