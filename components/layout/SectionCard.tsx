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
    <Card className={cn("overflow-hidden border-border/80 shadow-sm", className)}>
      {(title || action || description) && (
        <CardHeader className="flex flex-row items-start lg:items-center justify-between gap-4 pb-4 space-y-0">
          <div className="space-y-1">
            {title && (
              <CardTitle className="text-base flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                {title}
              </CardTitle>
            )}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("pt-0", !title && !action && !description && "pt-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
