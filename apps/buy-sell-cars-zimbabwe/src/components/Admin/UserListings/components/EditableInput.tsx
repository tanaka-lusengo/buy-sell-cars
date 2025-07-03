import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SelectField, TextareaField, InputField } from "~bsc-shared/components";
import { toSnakeCase, formatToReadableString } from "~bsc-shared/utils";
import { SUBSCRIPTION_TYPES } from "@/src/constants/subscription";
import { LOCATIONS } from "@/src/constants/values";
import { UpdateProfileAdminFormType } from "@/src/types";

const SELECT_OPTIONS: Record<string, string[]> = {
  isVerified: ["true", "false"],
  subscription: SUBSCRIPTION_TYPES,
  location: LOCATIONS,
};

type EditableInputProps = {
  value: string | number | boolean;
  name: string;
  register: UseFormRegister<UpdateProfileAdminFormType>;
  errors: FieldErrors<UpdateProfileAdminFormType>;
};

export const EditableInput = ({
  value,
  name,
  register,
  errors,
}: EditableInputProps) => {
  const selectOptions = SELECT_OPTIONS[name];

  if (selectOptions) {
    // Filter out the current value so it doesn't appear twice in the dropdown
    const filteredOptions = selectOptions.filter((option) => {
      // Convert both option and value to string for comparison
      const optionValue = LOCATIONS.includes(option)
        ? option
        : toSnakeCase(option);

      return String(optionValue) !== String(value);
    });

    return (
      <SelectField name={name} register={register} errors={errors}>
        <option key={name} value={String(value)}>
          {formatToReadableString(value as string | number | boolean)}
        </option>
        {filteredOptions.map((option) => (
          <option
            key={option}
            value={LOCATIONS.includes(option) ? option : toSnakeCase(option)}
          >
            {formatToReadableString(option)}
          </option>
        ))}
      </SelectField>
    );
  }

  if (name === "description") {
    return (
      <TextareaField
        name={name}
        maxLength={500}
        defaultValue={String(value)}
        register={register}
        errors={errors}
      />
    );
  }

  return (
    <InputField
      type="text"
      name={name}
      defaultValue={String(value)}
      register={register}
      errors={errors}
    />
  );
};
