import { Inbox } from 'lucide-react';

export function TimelineEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/20">
      <div className="bg-background p-4 rounded-full shadow-sm mb-4">
        <Inbox className="h-10 w-10 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold">No medical timeline activity yet</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        When this patient has appointments, medical records, or other activities, they will appear here chronologically.
      </p>
    </div>
  );
}
