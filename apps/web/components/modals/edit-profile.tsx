import { EditProfileModalProps } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileInput, updateProfileSchema } from '@repo/trpc/schemas';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onSave,
}: EditProfileModalProps) {
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name,
      bio: profile.bio || '',
      website: profile.website || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: profile.name,
      bio: profile.bio || '',
      website: profile.website || '',
    });
  }, [profile, form]);

  const handleSubmit = (data: UpdateProfileInput) => {
    onSave(data);
    onOpenChange(false);
  };

  const bio = form.watch('bio');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-125'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-4 py-4'
          id='form-rhf-edit-profile'
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-rhf-edit-profile-name'>
                    Name
                  </FieldLabel>
                  <Input
                    placeholder='Your name'
                    maxLength={50}
                    aria-invalid={fieldState.invalid}
                    aria-label='form-rhf-edit-profile-name'
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='bio'
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel>Bio</FieldLabel>
                  <Textarea
                    placeholder='Tell people about yourself...'
                    rows={4}
                    maxLength={150}
                    aria-invalid={fieldState.invalid}
                    aria-label='form-rhf-edit-profile-bio'
                    {...field}
                  />
                  <FieldDescription>
                    {bio?.length || 0}/150 characters
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='website'
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel>Website</FieldLabel>

                  <Input
                    type='url'
                    placeholder='https://example.com'
                    aria-invalid={fieldState.invalid}
                    aria-label='form-rhf-edit-profile-website'
                    {...field}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
