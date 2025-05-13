import { JSX } from 'react';

// Utility function to determine label text
export const getLabelText = (
  file: File | FileList | null,
  loading: boolean,
  defaultLabel: string | JSX.Element,
  changeLabel: string | JSX.Element
): string | JSX.Element => {
  if (loading) return 'Uploading...';
  if (file !== null) return changeLabel;
  return defaultLabel;
};
