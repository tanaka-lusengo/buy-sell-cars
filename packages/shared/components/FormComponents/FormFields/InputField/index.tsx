import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { Grid } from "@/styled-system/jsx";
import * as Styled from "../common.styled";

type InputFieldProps<TFormValues extends FieldValues> = {
  name: string;
  register: UseFormRegister<TFormValues>;
  errors: FieldErrors<TFormValues>;
  label?: string;
  type?: string;
  defaultValue?: string | number;
  decimalNumbers?: boolean;
  flex?: boolean;
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
  flex = false,
  ...rest
}: InputFieldProps<TFormValues>) => {
  return (
    <Styled.InputContainer>
      <Grid columns={flex ? 2 : 1} alignItems="center" gap="sm">
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
      </Grid>

      {errors[name] && (
        <Styled.ErrorText key={`${name}-error`} role="alert">
          {typeof errors[name]?.message === "string" && errors[name].message}
        </Styled.ErrorText>
      )}
    </Styled.InputContainer>
  );
};
