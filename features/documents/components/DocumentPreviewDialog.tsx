import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { Document } from '../types';
import { UnsupportedDocumentPreview } from './UnsupportedDocumentPreview';
import { ExternalLink, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentPreviewDialogProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentPreviewDialog({ document, isOpen, onClose }: DocumentPreviewDialogProps) {
  if (!document) return null;

  const isImage = document.mime_type.startsWith('image/');
  const isPDF = document.mime_type === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b flex-row justify-between items-center space-y-0">
          <div className="space-y-1">
            <DialogTitle className="text-xl">{document.name}</DialogTitle>
            <DialogDescription>
              {document.category.replace('_', ' ')} • Uploaded on {new Date(document.created_at).toLocaleDateString()}
            </DialogDescription>
          </div>
          <div className="flex gap-2 mr-8">
            <Button variant="outline" size="sm" asChild>
              <a href={document.download_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open External
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={document.download_url} download={document.name}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-slate-100 p-4">
          <div className="flex items-center justify-center min-h-full">
            {isImage ? (
              <img 
                src={document.download_url} 
                alt={document.name} 
                className="max-w-full h-auto shadow-lg rounded-sm"
              />
            ) : isPDF ? (
              <iframe 
                src={`${document.download_url}#toolbar=0`} 
                className="w-full h-[70vh] border-0 shadow-lg rounded-sm"
                title={document.name}
              />
            ) : (
              <UnsupportedDocumentPreview 
                name={document.name}
                type={document.mime_type}
                size={document.size}
                downloadUrl={document.download_url}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
