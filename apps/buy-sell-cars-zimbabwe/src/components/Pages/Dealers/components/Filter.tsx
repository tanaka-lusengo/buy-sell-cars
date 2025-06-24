"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type infer as ZodInfer } from "zod";
import { SelectField } from "~bsc-shared/components";
import { Button, Typography } from "~bsc-shared/ui";
import { LOCATIONS } from "@/src/constants/values";
import { Flex, Grid } from "@/styled-system/jsx";
import { filterValidationSchema } from "../schema";
import { Form } from "./common.styled";

type FilterForm = ZodInfer<typeof filterValidationSchema>;

export const Filter = ({ dealers }: { dealers: string[] }) => {
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

        <Button type="button" onClick={() => reset()}>
          Reset fields
        </Button>
      </Flex>

      <Grid gridTemplateColumns="1fr" gap="sm">
        <SelectField name="dealer" register={register} errors={errors}>
          <option key="dealer" value={""}>
            Dealer
          </option>
          {dealers.map((dealer) => (
            <option key={dealer} value={dealer}>
              {dealer}
            </option>
          ))}
        </SelectField>

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

      <Button type="submit" variant="primary" marginTop="sm">
        Search
      </Button>
    </Form>
  );
};
