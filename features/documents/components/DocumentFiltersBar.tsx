import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DocumentCategory } from '../types';

interface DocumentFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

const CATEGORIES: { label: string; value: DocumentCategory | 'all' }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Lab Reports', value: 'lab_report' },
  { label: 'Prescriptions', value: 'prescription' },
  { label: 'ID Documents', value: 'id_document' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Consent Forms', value: 'consent_form' },
  { label: 'General', value: 'general' },
];

export function DocumentFiltersBar({ 
  search, 
  onSearchChange, 
  category, 
  onCategoryChange, 
  onReset 
}: DocumentFiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
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

      {(search || category !== 'all') && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="text-slate-500 hover:text-slate-900"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
