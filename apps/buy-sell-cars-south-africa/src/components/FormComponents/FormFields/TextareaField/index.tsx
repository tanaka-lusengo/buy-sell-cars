import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

import * as Styled from "../common.styled";

type TextareaFieldProps<TFormValues extends FieldValues> = {
  name: string;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  label?: string;
  defaultValue?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const TextareaField = <TFormValues extends FieldValues>({
  name,
  label,
  placeholder,
  errors,
  register,
  defaultValue,
}: TextareaFieldProps<TFormValues>) => {
  return (
    <Styled.InputContainer>
      {label && (
        <Styled.Label key={`${name}-label`} htmlFor={name}>
          {label}
        </Styled.Label>
      )}

      <Styled.TextareaField
        key={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name as Path<TFormValues>)}
      />

      {errors[name] && (
        <Styled.ErrorText key={`${name}-error`} role="alert">
          {typeof errors[name]?.message === "string" && errors[name].message}
        </Styled.ErrorText>
      )}
    </Styled.InputContainer>
  );
};
