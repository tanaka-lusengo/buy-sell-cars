"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type infer as ZodInfer } from "zod";
import { Flex, Grid } from "@/styled-system/jsx";
import { SelectField } from "@/src/components/FormComponents";
import { Button, ButtonAsLink, Typography } from "@/src/components/ui";
import { Form } from "./common.styled";
import { filterValidationSchema } from "../schema";
import {
  CAR_CONDITIONS,
  FUEL_TYPES,
  GEARBOX_TYPES,
  LOCATIONS,
} from "@/src/constants/values";
import { generatePrices, toSnakeCase } from "@/src/utils";

type FilterForm = ZodInfer<typeof filterValidationSchema>;

export const Filter = ({
  vehicleFilterData,
}: {
  vehicleFilterData: {
    makes: string[];
    models: string[];
  };
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FilterForm>({
    resolver: zodResolver(filterValidationSchema),
    mode: "all",
  });

  const handleAction = async (formData: FilterForm) => {
    console.log("Form data:", formData);
  };

  const PRICES = useMemo(() => generatePrices(), []);

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: FilterForm) => await handleAction(formValues)
      )}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        justifyItems="center"
      >
        <Typography variant="h3">Filters</Typography>

        <ButtonAsLink textDecoration="underline" onClick={reset}>
          Clear fields
        </ButtonAsLink>
      </Flex>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField name="make" register={register} errors={errors}>
          <option key="make" value={""}>
            Car make
          </option>
          {vehicleFilterData.makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </SelectField>

        <SelectField name="model" register={register} errors={errors}>
          <option key="model" value={""}>
            Car model
          </option>
          {vehicleFilterData.models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField name="location" register={register} errors={errors}>
          <option key="location" value={""}>
            Location
          </option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </SelectField>

        <SelectField name="condition" register={register} errors={errors}>
          <option key="condition" value={""}>
            Condition
          </option>
          {CAR_CONDITIONS.map((condition) => (
            <option key={condition} value={toSnakeCase(condition)}>
              {condition}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField name="fuelType" register={register} errors={errors}>
          <option key="fuel-type" value={""}>
            Fuel type
          </option>
          {FUEL_TYPES.map((type) => (
            <option key={type} value={toSnakeCase(type)}>
              {type}
            </option>
          ))}
        </SelectField>

        <SelectField name="gearboxType" register={register} errors={errors}>
          <option key="gearbox-type" value={""}>
            Gearbox
          </option>
          {GEARBOX_TYPES.map((type) => (
            <option key={type} value={toSnakeCase(type)}>
              {type}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField
          name="minPrice"
          register={register}
          errors={errors}
          defaultValue="Min price"
        >
          <option key="min-price" value={""}>
            Min price
          </option>
          {PRICES.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </SelectField>

        <SelectField name="maxPrice" register={register} errors={errors}>
          <option key="max-price" value={""}>
            Max price
          </option>
          {PRICES.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Button type="submit" variant="primary" marginTop="sm">
        Search
      </Button>
    </Form>
  );
};
