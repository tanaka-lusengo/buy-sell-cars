import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

import * as Styled from "../common.styled";

type SelectFieldProps<TFormValues extends FieldValues> = {
  name: string;
  register: UseFormRegister<TFormValues> | null;
  errors: FieldErrors<TFormValues> | null;
  label?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectField = <TFormValues extends FieldValues>({
  name,
  label,
  defaultValue,
  errors,
  register,
  children,
  value,
  onChange,
  ...rest
}: SelectFieldProps<TFormValues>) => {
  return (
    <Styled.InputContainer>
      {label && (
        <Styled.Label key={`${name}-label`} htmlFor={name}>
          {label}
        </Styled.Label>
      )}

      <Styled.SelectField
        key={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        {...(register && {
          ...register(name as Path<TFormValues>),
        })}
        {...rest}
      >
        {children}
      </Styled.SelectField>

      {errors && errors[name] && (
        <Styled.ErrorText key={`${name}-error`} role="alert">
          {typeof errors[name]?.message === "string" && errors[name].message}
        </Styled.ErrorText>
      )}
    </Styled.InputContainer>
  );
};
