import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Download, 
  Trash2, 
  Calendar,
  FileIcon,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { usePatientDocuments, useDeleteDocument } from '../hooks';
import { DocumentFiltersBar } from './DocumentFiltersBar';
import { DocumentPreviewDialog } from './DocumentPreviewDialog';
import { DocumentUploadDialog } from './DocumentUploadDialog';
import { Document } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface PatientDocumentsTabProps {
  patientId: string;
}

export function PatientDocumentsTab({ patientId }: PatientDocumentsTabProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const { data: documents, isLoading } = usePatientDocuments(patientId, category === 'all' ? undefined : category);
  const deleteMutation = useDeleteDocument(patientId);

  const filteredDocs = documents?.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handlePreview = (doc: Document) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Document deleted');
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'lab_report': return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'prescription': return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'id_document': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'insurance': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
      case 'consent_form': return 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Patient Documents</h2>
          <p className="text-sm text-slate-500">View and manage clinical documents, lab reports, and IDs.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </div>

      <DocumentFiltersBar 
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        onReset={() => { setSearch(''); setCategory('all'); }}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="text-slate-500 animate-pulse">Loading documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <FileText className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No documents found</h3>
          <p className="text-slate-500 max-w-[250px] text-center mt-1">
            {search || category !== 'all' 
              ? "Try adjusting your filters to find what you're looking for." 
              : "Start by uploading lab reports, prescriptions, or IDs."}
          </p>
          {(search || category !== 'all') && (
            <Button variant="link" onClick={() => { setSearch(''); setCategory('all'); }} className="mt-2">
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[400px]">Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocs.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 truncate max-w-[300px]">{doc.name}</span>
                        <span className="text-xs text-slate-400 capitalize">{doc.mime_type.split('/')[1] || 'File'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`capitalize font-medium ${getCategoryColor(doc.category)}`}>
                      {doc.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {format(new Date(doc.created_at), 'MMM d, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {formatSize(doc.size)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 h-8 w-8 text-slate-400 hover:text-slate-900">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handlePreview(doc)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href={doc.download_url} download={doc.name}>
                            <Download className="mr-2 h-4 w-4" />
                            Download File
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(doc.id)} 
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Document
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DocumentPreviewDialog 
        document={selectedDoc}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      <DocumentUploadDialog 
        patientId={patientId}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
