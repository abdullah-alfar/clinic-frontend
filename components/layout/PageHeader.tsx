import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, className, children, onBack, icon: Icon }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8", className)}>
      <div className="flex items-start gap-4">
        {onBack && (
          <Button variant="outline" size="icon" onClick={onBack} aria-label="Go back" className="h-9 w-9 rounded-xl shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        {Icon && (
          <div className="h-12 w-12 rounded-2xl modern-gradient-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {description && <p className="text-base text-muted-foreground max-w-2xl">{description}</p>}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
