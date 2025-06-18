import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

import * as Styled from "../common.styled";

type InputFieldProps<TFormValues extends FieldValues> = {
  name: string;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  label?: string;
  type?: string;
  defaultValue?: string | number;
  decimalNumbers?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const InputField = <TFormValues extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  errors,
  register,
  defaultValue,
  decimalNumbers = false,
  ...rest
}: InputFieldProps<TFormValues>) => {
  return (
    <Styled.InputContainer>
      {label && (
        <Styled.Label key={`${name}-label`} htmlFor={name}>
          {label}
        </Styled.Label>
      )}

      <Styled.InputField
        key={name}
        type={type}
        step={type === "number" ? (decimalNumbers ? "0.01" : "1") : undefined}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register(name as Path<TFormValues>)}
        {...rest}
      />

      {errors[name] && (
        <Styled.ErrorText key={`${name}-error`} role="alert">
          {typeof errors[name]?.message === "string" && errors[name].message}
        </Styled.ErrorText>
      )}
    </Styled.InputContainer>
  );
};
