const getErrorMessage = async (res: Response) => {
  const body = await res.json().catch(() => null);
  return typeof body?.message === 'string'
    ? body.message
    : 'Failed to upload image';
};

export const uploadImage = async (file: File): Promise<string> => {
  const params = new URLSearchParams({
    contentType: file.type,
    size: String(file.size),
  });
  const presignRes = await fetch(`/api/upload/presign?${params}`);
  if (!presignRes.ok) {
    throw new Error(await getErrorMessage(presignRes));
  }

  const { filename, uploadUrl } = await presignRes.json();

  if (uploadUrl) {
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!uploadRes.ok) {
      throw new Error('Failed to upload image');
    }
    return filename;
  }

  const formData = new FormData();
  formData.append('image', file);
  const uploadRes = await fetch('/api/upload/image', {
    method: 'POST',
    body: formData,
  });
  if (!uploadRes.ok) {
    throw new Error(await getErrorMessage(uploadRes));
  }
  const { filename: storedFilename } = await uploadRes.json();
  return storedFilename;
};
