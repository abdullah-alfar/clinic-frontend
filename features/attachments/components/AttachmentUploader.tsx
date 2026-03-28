import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useUploadAttachment } from '../hooks/useAttachments';

interface Props {
  patientId: string;
}

export function AttachmentUploader({ patientId }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadFile, isPending } = useUploadAttachment(patientId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadFile({ file });
    
    // Clear the input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,application/pdf"
      />
      <Button
        variant="outline"
        className="gap-2"
        disabled={isPending}
        onClick={() => fileInputRef.current?.click()}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
        Upload File
      </Button>
    </div>
  );
}
