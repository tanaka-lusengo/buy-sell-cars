"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type infer as ZodInfer } from "zod";
import { Container, Grid } from "@/styled-system/jsx";
import { InputField, SelectField } from "@/src/components/FormComponents";
import { Button, Typography } from "@/src/components/ui";
import { Form } from "./index.styled";
import { generatePrices, generateYears, toSnakeCase } from "@/src/utils";
import { CAR_CONDITIONS, FUEL_TYPES, LOCATIONS } from "@/src/constants/values";
import { filterValidationSchema } from "../../schema";

type FilterForm = ZodInfer<typeof filterValidationSchema>;

export const Filter = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FilterForm>({
    resolver: zodResolver(filterValidationSchema),
    mode: "all",
  });

  const YEARS = useMemo(() => generateYears(), []);
  const PRICES = useMemo(() => generatePrices(), []);

  const handleAction = async (formData: FilterForm) => {
    console.log("Form data:", formData);
  };

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: FilterForm) => await handleAction(formValues)
      )}
    >
      <Typography variant="h4" align="center">
        Find your car
      </Typography>

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

        <InputField
          name="make"
          placeholder="Make"
          register={register}
          errors={errors}
        />
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <InputField
          name="model"
          placeholder="model"
          register={register}
          errors={errors}
        />

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

      <Container marginTop="sm">
        <Button onClick={() => reset()}>Clear fields</Button>
      </Container>
    </Form>
  );
};
