import imageCompression from 'browser-image-compression';
import { handleClientError } from '@/src/utils';
import { createClient } from '@/supabase/client';

type UploadFileParams = {
  id: string;
  file: File;
  bucket: string;
  oldPath?: string | null;
  fileNamePrefix: string;
};

export const useFileUploadHelpers = (
  supabase: ReturnType<typeof createClient>
) => {
  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl;
  };

  const compressAndUploadFile = async ({
    file,
    id,
    bucket,
    oldPath,
    fileNamePrefix,
  }: UploadFileParams) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const ext = file.name.split('.').pop();
    const filePath = `${id}/${fileNamePrefix}-${timestamp}.${ext}`;

    try {
      if (oldPath && oldPath !== filePath) {
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([oldPath]);

        if (deleteError) {
          handleClientError(
            `Error deleting old file from ${bucket}`,
            deleteError
          );
          throw deleteError;
        }
      }

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressedFile, {
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      return filePath;
    } catch (error) {
      handleClientError(`uploading ${fileNamePrefix}`, error);
      return null;
    }
  };

  return { getPublicUrl, compressAndUploadFile };
};
