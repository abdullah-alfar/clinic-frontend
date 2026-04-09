import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Upload, File, Loader2, X } from 'lucide-react';
import { DocumentCategory } from '../types';
import { useUploadDocument } from '../hooks';
import { toast } from 'sonner';

interface DocumentUploadDialogProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: DocumentCategory }[] = [
  { label: 'Lab Report', value: 'lab_report' },
  { label: 'Prescription', value: 'prescription' },
  { label: 'ID Document', value: 'id_document' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Consent Form', value: 'consent_form' },
  { label: 'General', value: 'general' },
];

export function DocumentUploadDialog({ patientId, isOpen, onClose }: DocumentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('general');
  const uploadMutation = useUploadDocument(patientId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('name', file.name);

    try {
      await uploadMutation.mutateAsync(formData);
      toast.success('Document uploaded successfully');
      setFile(null);
      onClose();
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to this patient's medical records.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            {!file ? (
              <div 
                className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Click to upload or drag & drop</span>
                  <span className="text-xs text-slate-400">PDF, JPG, PNG (Max 50MB)</span>
                </div>
                <input 
                  id="file-input" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-blue-900 truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-blue-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(v) => setCategory(v as DocumentCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploadMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
            {uploadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
