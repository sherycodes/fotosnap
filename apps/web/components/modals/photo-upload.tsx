'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTRPC } from '@/lib/trpc/client';
import { uploadImage } from '@/lib/upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Fab } from '../ui/fab';
import FileUploadArea from '../ui/file-upload-area';
import { Label } from '../ui/label';

const PhotoUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createPost = useMutation(
    trpc.postsRouter.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.postsRouter.findAll.queryKey(),
        });
        toast.success('Post shared');
        setIsOpen(false);
      },
    }),
  );

  const onFileSelect = (file: File) => {
    setSelectedFile(file);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPreview(e.target?.result as string);
    };

    fileReader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setPreview(null);
    setSelectedFile(null);
    setCaption('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) return;
    setIsUploading(true);

    try {
      const filename = await uploadImage(selectedFile);

      await createPost.mutateAsync({ image: filename, caption });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      onOpenChangeComplete={(open) => {
        if (!open) clearSelection();
      }}
    >
      <DialogTrigger render={<Fab />}>
        <Plus className='size-6' />
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>
        {!preview ? (
          <FileUploadArea onFileSelect={onFileSelect} />
        ) : (
          <div className='space-y-4'>
            <div className='relative'>
              <Image
                src={preview}
                alt='Preivew'
                height={64}
                width={64}
                className='w-full h-64 object-cover rounded-lg'
              />
              <Button
                variant='ghost'
                size='sm'
                className='absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70'
                onClick={clearSelection}
              >
                <X className='size-4' />
              </Button>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='caption'>Caption</Label>
              <textarea
                id='caption'
                placeholder='Write a caption...'
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className='w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={clearSelection}
                disabled={isUploading}
              >
                Back
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !caption.trim()}
              >
                Share
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUpload;
