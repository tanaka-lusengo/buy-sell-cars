"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, JSX } from "react";
import type {
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";
import { Button } from "../../../../ui";
import { handleClientError } from "../../../../utils";
import * as Styled from "../common.styled";

type FileInputFieldProps<TFormValues extends FieldValues> = {
  label?: string | string[] | JSX.Element;
  name: string;
  accept?: string;
  multiple?: boolean;
  width?: CSSProperties["width"];
  disabled?: boolean;
  register: UseFormRegisterReturn;
  errors: FieldErrors<TFormValues>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FileInputField = <TFormValues extends FieldValues>({
  label,
  name,
  accept,
  multiple = undefined,
  width = "max-content",
  disabled,
  register,
  errors,
}: FileInputFieldProps<TFormValues>) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const count = e.target.files?.length || 0;
    // If more than 10 files, show error and reset state
    if (count > 10) {
      handleClientError(
        "uploading photos",
        "You can only upload a maximum of 10 images."
      );
      setFileCount(0);
      setFileName(null);
      // Optionally, clear the input value
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileCount(count);
    setFileName(e.target.files?.[0]?.name || null);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <Styled.InputContainer>
      {label && (
        <Styled.Label key={`${name}-label`} htmlFor={name}>
          {label}
        </Styled.Label>
      )}

      <Styled.FileInputField
        type="file"
        id={name}
        name={name}
        key={name}
        accept={accept}
        multiple={multiple}
        ref={(e) => {
          if (register?.ref) register.ref(e);
          fileInputRef.current = e;
        }}
        onChange={(e) => {
          handleFileChange(e);
          register?.onChange?.(e);
        }}
        disabled={disabled}
        aria-label={label ? `${label} file` : "File"}
      />

      <Button
        width={width}
        variant="upload"
        type="button"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        onClick={triggerFileInput}
      >
        {fileName ? `Pending: ${fileCount}` : "Upload Files"}
      </Button>

      {errors[name] && (
        <Styled.ErrorText key={`${name}-error`} role="alert">
          {typeof errors[name]?.message === "string" && errors[name].message}
        </Styled.ErrorText>
      )}
    </Styled.InputContainer>
  );
};
