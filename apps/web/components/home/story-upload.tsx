import { StoryUploadProps } from '@/lib/types';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import FileUploadArea from '../ui/file-upload-area';

export default function StoryUpload({
  open,
  onOpenChange,
  onSubmit,
}: StoryUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onSubmit(selectedFile);
      onOpenChange(false);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) clearSelection();
      }}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Add to your story</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <FileUploadArea onFileSelect={handleFileSelect} />
        ) : (
          <div className='space-y-4'>
            <div className='relative'>
              <Image
                src={preview}
                alt='Preview'
                height={64}
                width={64}
                className='w-full h-96 object-cover rounded-lg'
              />
              <Button
                variant='ghost'
                size='sm'
                onClick={clearSelection}
                className='absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70'
              >
                <X className='size-4' />
              </Button>
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                onClick={clearSelection}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                Share to Story
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
