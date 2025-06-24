import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SelectField, TextareaField, InputField } from "~bsc-shared/components";
import {
  CAR_CONDITIONS,
  FUEL_TYPES,
  GEARBOX_TYPES,
  VEHICLE_CATEGORIES,
  LISTING_TYPES,
} from "~bsc-shared/constants/values";
import { toSnakeCase, formatToReadableString } from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { EditVehicleFormType } from "@/src/types";

const SELECT_OPTIONS: Record<string, string[]> = {
  isActive: ["true", "false"],
  condition: CAR_CONDITIONS,
  fuelType: FUEL_TYPES,
  gearBox: GEARBOX_TYPES,
  vehicleCategory: VEHICLE_CATEGORIES,
  listingCategory: LISTING_TYPES,
  location: LOCATIONS,
};

type EditableInputProps = {
  value: string | number | boolean;
  name: string;
  register: UseFormRegister<EditVehicleFormType>;
  errors: FieldErrors<EditVehicleFormType>;
};

export const EditableInput = ({
  value,
  name,
  register,
  errors,
}: EditableInputProps) => {
  const numericFields = ["year", "price", "mileage", "doors", "seats"];
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
      type={numericFields.includes(name) ? "number" : "text"}
      name={name}
      defaultValue={String(value)}
      register={register}
      errors={errors}
    />
  );
};
