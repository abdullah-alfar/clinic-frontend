import { useState } from 'react';
import { usePatientAttachments, useDeleteAttachment } from '../hooks/useAttachments';
import type { Attachment } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, FileText, FileImage } from 'lucide-react';
import { AttachmentPreviewDialog } from './AttachmentPreviewDialog';
import { useAuthStore } from '@/hooks/useAuthStore';
import { formatClinicDate } from '@/lib/formatters';
import { useTheme } from '@/providers/ThemeProvider';

interface Props {
  patientId: string;
}

export function AttachmentList({ patientId }: Props) {
  const { data: attachments, isLoading } = usePatientAttachments(patientId);
  const { mutate: deleteAttachment } = useDeleteAttachment(patientId);
  const user = useAuthStore((s) => s.user);
  const { tenant } = useTheme();
  const [previewAtt, setPreviewAtt] = useState<Attachment | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg border-dashed">
        No reports or attachments on file.
      </div>
    );
  }

  const handleDelete = (att: Attachment) => {
    if (window.confirm(`Are you sure you want to delete ${att.name}?`)) {
      deleteAttachment(att.id);
    }
  };

  const isImage = (att: Attachment) => att.file_type === 'image' || att.mime_type.startsWith('image/');

  return (
    <div className="space-y-4">
      {attachments.map((att) => (
        <div key={att.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/10 transition-colors">
          <div className="flex items-start gap-4 mb-3 sm:mb-0">
            <div className="bg-primary/10 p-2 rounded-md shrink-0">
              {isImage(att) ? <FileImage className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
            </div>
            <div>
              <p className="text-sm font-medium line-clamp-1">{att.name}</p>
              <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                <span>{formatClinicDate(att.created_at, tenant?.timezone)}</span>
                <span>•</span>
                <span>{(att.file_size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end sm:justify-start gap-2 sm:ml-4">
            <Button variant="outline" size="sm" onClick={() => setPreviewAtt(att)} className="gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(att)} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <AttachmentPreviewDialog
        attachment={previewAtt}
        open={!!previewAtt}
        onOpenChange={(open) => !open && setPreviewAtt(null)}
      />
    </div>
  );
}
