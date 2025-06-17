import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { handleClientError } from "@/src/utils";
import { createClient } from "@/supabase/client";
import { StorageBucket } from "../types";

type UploadFileParams = {
  id: string;
  file: File;
  bucket: string;
  fileNamePrefix: string;
};

export const useFileUploadHelpers = (
  supabase: ReturnType<typeof createClient>
) => {
  const getPublicUrl = (bucket: StorageBucket, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl;
  };

  const deleteOldFiles = async (bucket: string, oldPaths: string[]) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove(oldPaths);

      if (deleteError) {
        // Handle and throw error if deletion fails
        handleClientError(
          `Error deleting old files from ${bucket}`,
          deleteError
        );
        throw deleteError;
      }

      const { error: dbError } = await supabase
        .from("vehicle_images")
        .delete()
        .in("image_path", oldPaths);

      if (dbError) {
        // Handle and throw error if deletion from database fails
        handleClientError(
          `Error deleting file paths from vehicle_images table`,
          dbError
        );
        throw dbError;
      }
    } catch (error) {
      handleClientError(`deleting old files from ${bucket}`, error);
      throw error;
    }
  };

  const compressAndUploadFile = async ({
    file,
    id,
    bucket,
    fileNamePrefix,
  }: UploadFileParams) => {
    const uniqueSuffix = uuidv4();
    const ext = file.name.split(".").pop();
    const filePath = `${id}/${fileNamePrefix}-${uniqueSuffix}.${ext}`;

    try {
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

  return { getPublicUrl, deleteOldFiles, compressAndUploadFile };
};
