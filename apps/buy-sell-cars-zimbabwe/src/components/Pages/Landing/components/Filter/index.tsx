"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { type infer as ZodInfer } from "zod";
import { InputField, SelectField } from "~bsc-shared/components";
import {
  CAR_CONDITIONS,
  FUEL_TYPES,
  VEHICLE_CATEGORIES,
} from "~bsc-shared/constants/values";
import { Button, LinkButton, Typography } from "~bsc-shared/ui";
import { generatePrices, generateYears, toSnakeCase } from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { filterValidationSchema } from "@/src/schemas";
import { Container, Flex, Grid } from "@/styled-system/jsx";
import { Form } from "./index.styled";

type FilterForm = ZodInfer<typeof filterValidationSchema>;

export const Filter = () => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm<FilterForm>({
    resolver: zodResolver(filterValidationSchema),
    mode: "all",
  });

  const { push } = useRouter();

  const YEARS = useMemo(() => generateYears(), []);
  const PRICES = useMemo(() => generatePrices(), []);

  const vehicleCategory = watch("vehicleCategory");

  const handleAction = async (formData: FilterForm) => {
    // Create search parameters from form data, filtering out empty values
    const searchParams = new URLSearchParams();

    Object.entries(formData).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        searchParams.set(key, value);
      }
    });

    // Redirect to car sales page with search parameters
    const queryString = searchParams.toString();
    const url = `/${vehicleCategory}/sales/${queryString ? `?${queryString}` : ""}`;
    push(url);
  };

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
        <Typography variant="h3">Search</Typography>

        <LinkButton onClick={() => reset()} type="button">
          Clear fields
        </LinkButton>
      </Flex>

      <Grid gridTemplateColumns="0.5fr">
        <SelectField name="vehicleCategory" register={register} errors={errors}>
          <option key="vehicleCategory" value="">
            Vehicle type
          </option>
          {VEHICLE_CATEGORIES.map((category) => (
            <option key={category} value={toSnakeCase(category)}>
              {category}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <InputField
          name="make"
          placeholder="Make"
          register={register}
          errors={errors}
        />

        <InputField
          name="model"
          placeholder="Model"
          register={register}
          errors={errors}
        />
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField name="location" register={register} errors={errors}>
          <option key="location" value="">
            Location
          </option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </SelectField>

        <SelectField name="year" register={register} errors={errors}>
          <option key="year" value={""}>
            Years
          </option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
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
