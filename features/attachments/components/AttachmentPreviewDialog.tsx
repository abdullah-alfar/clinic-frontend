import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, Sparkles } from 'lucide-react';
import type { Attachment } from '../types';
import { ReportAISummaryCard } from './ReportAISummaryCard';
import { useAnalyzeReport } from '../hooks/useAttachments';

interface Props {
  attachment: Attachment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttachmentPreviewDialog({ attachment, open, onOpenChange }: Props) {
  const { mutate: analyze, isPending } = useAnalyzeReport(attachment?.id || '');

  if (!attachment) return null;

  const isImage = attachment.file_type === 'image' || attachment.mime_type.startsWith('image/');
  
  const handleDownload = () => {
    // using backend API origin
    const origin = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const link = document.createElement('a');
    link.href = `${origin}${attachment.file_url}`;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mt-2">
          <DialogTitle className="text-xl font-semibold">
            {attachment.name}
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-2 mr-6">
            <Button variant="secondary" size="sm" onClick={() => analyze('summary')} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Analyze with AI
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="rounded-md border bg-muted/20 flex flex-col items-center justify-center min-h-[350px] overflow-hidden p-4">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${attachment.file_url}`} 
                alt={attachment.name} 
                className="max-w-full max-h-[50vh] object-contain rounded drop-shadow-sm"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground space-y-4">
                <p>Preview not available for this file type.</p>
                <Button variant="outline" onClick={handleDownload}>Download to View</Button>
              </div>
            )}
          </div>

          <ReportAISummaryCard attachmentId={attachment.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
