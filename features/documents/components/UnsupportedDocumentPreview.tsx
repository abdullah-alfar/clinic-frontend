import React from 'react';
import { FileIcon, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UnsupportedDocumentPreviewProps {
  name: string;
  type: string;
  size: number;
  downloadUrl: string;
}

export function UnsupportedDocumentPreview({ name, type, size, downloadUrl }: UnsupportedDocumentPreviewProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="flex items-center justify-center p-8 bg-slate-50 border-dashed">
      <CardContent className="flex flex-col items-center text-center space-y-4 pt-6">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <FileIcon className="h-12 w-12 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500">
            {type} • {formatSize(size)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
          <AlertCircle className="h-3 w-3" />
          <span>Preview not available for this file type</span>
        </div>
        <Button asChild className="mt-4">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4" />
            Download to View
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
