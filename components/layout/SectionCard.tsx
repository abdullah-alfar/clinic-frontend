import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

interface SectionCardProps {
  title?: React.ReactNode;
  description?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  action?: React.ReactNode;
}

export function SectionCard({ title, description, icon: Icon, children, className, contentClassName, action }: SectionCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-sm modern-gradient-subtle bg-card/40 backdrop-blur-sm", className)}>
      {(title || action || description || Icon) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 p-6 pb-4 space-y-0">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-4.5 w-4.5 text-primary" />}
              {title && (
                <CardTitle className="text-lg font-semibold tracking-tight">
                  {title}
                </CardTitle>
              )}
            </div>
            {description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("p-6 pt-0", (!title && !action && !description && !Icon) && "pt-6", contentClassName)}>
        <div className="grid gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
