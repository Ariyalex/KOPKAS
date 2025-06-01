// utils/storage.ts - Utility untuk file upload
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string,
  supabase: any
): Promise<string> => {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
};

