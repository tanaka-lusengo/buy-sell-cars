"use client";

import { useMemo, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { type infer as ZodInfer } from "zod";
import { SelectField } from "~bsc-shared/components";
import {
  CAR_CONDITIONS,
  FUEL_TYPES,
  GEARBOX_TYPES,
} from "~bsc-shared/constants";
import { Button, H3, LinkButton } from "~bsc-shared/ui";
import { generatePrices, generateYears, toSnakeCase } from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { vehiclePageFilterValidationSchema } from "@/src/schemas";
import { parseUrlSearchParams } from "@/src/utils";
import { Flex, Grid } from "@/styled-system/jsx";
import { Form } from "./common.styled";

type FilterForm = ZodInfer<typeof vehiclePageFilterValidationSchema>;

export const Filter = ({
  vehicleFilterData,
}: {
  vehicleFilterData: {
    makes: string[];
    models: string[];
  };
}) => {
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FilterForm>({
    resolver: zodResolver(vehiclePageFilterValidationSchema),
    mode: "all",
  });

  // Populate form with URL parameters on mount
  useEffect(() => {
    const filterCriteria = parseUrlSearchParams(searchParams);
    Object.entries(filterCriteria).forEach(([key, value]) => {
      if (value) {
        setValue(key as keyof FilterForm, value);
      }
    });
  }, [searchParams, setValue]);

  const handleAction = async (formData: FilterForm) => {
    // Create search parameters from form data, filtering out empty values
    const searchParams = new URLSearchParams(window.location.search);

    // Clear existing params first
    Object.keys(formData).forEach((key) => {
      searchParams.delete(key);
    });

    // Add new values
    Object.entries(formData).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        searchParams.set(key, value);
      }
    });

    // Update URL with new search parameters
    const queryString = searchParams.toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;
    window.history.pushState({}, "", newUrl);

    // Trigger a custom event to notify components of the filter change
    window.dispatchEvent(new Event("filterchange"));
  };

  const handleReset = () => {
    // Clear form fields
    reset();

    // Clear URL parameters
    const newUrl = window.location.pathname;
    window.history.pushState({}, "", newUrl);

    // Trigger filter change event to show all vehicles
    window.dispatchEvent(new Event("filterchange"));
  };

  const PRICES = useMemo(() => generatePrices(), []);
  const YEARS = useMemo(() => generateYears(), []);

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
        <H3>Filters</H3>

        <LinkButton onClick={handleReset} type="button">
          Clear fields
        </LinkButton>
      </Flex>

      <Grid gridTemplateColumns="0.5fr" gap="sm">
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
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField name="make" register={register} errors={errors}>
          <option key="make" value={""}>
            Make
          </option>
          {vehicleFilterData.makes.map((make) => (
            <option key={make} value={make}>
              {make}
            </option>
          ))}
        </SelectField>

        <SelectField name="model" register={register} errors={errors}>
          <option key="model" value={""}>
            Model
          </option>
          {vehicleFilterData.models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <SelectField name="year" register={register} errors={errors}>
          <option key="year" value={""}>
            Year
          </option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
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
