'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type infer as ZodInfer } from 'zod';
import { Container, Grid } from '@/styled-system/jsx';
import { InputField, SelectField } from '@/src/components/FormComponents';
import { Button, ButtonAsLink } from '@/src/components/ui';
import { Form } from './FilterSection.styled';
import { generatePrices, generateYears } from '../../utils/generateData';
import { CAR_CONDITIONS, FUEL_TYPES } from '../../constants';
import { filterValidationSchema } from '../../schema/filterValidationSchema';

type FilterForm = ZodInfer<typeof filterValidationSchema>;

export const FilterSection = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<FilterForm>({
    resolver: zodResolver(filterValidationSchema),
    mode: 'all',
  });

  const YEARS = useMemo(() => generateYears(), []);
  const PRICES = useMemo(() => generatePrices(), []);

  const handleAction = async (formData: FilterForm) => {
    console.log('Form data:', formData);
  };

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: FilterForm) => await handleAction(formValues)
      )}
    >
      <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="sm">
        <InputField
          name="location"
          placeholder="Location"
          register={register}
          errors={errors}
        />

        <InputField
          name="make"
          placeholder="Make"
          register={register}
          errors={errors}
        />
      </Grid>

      <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="sm">
        <InputField
          name="model"
          placeholder="model"
          register={register}
          errors={errors}
        />

        <SelectField<FilterForm>
          name="year"
          register={register}
          errors={errors}
        >
          <option key="year" value={''}>
            Years
          </option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="sm">
        <SelectField<FilterForm>
          name="condition"
          register={register}
          errors={errors}
        >
          <option key="condition" value={''}>
            Condition
          </option>
          {CAR_CONDITIONS.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </SelectField>

        <SelectField<FilterForm>
          name="fuelType"
          register={register}
          errors={errors}
        >
          <option key="fuel-type" value={''}>
            Fuel type
          </option>
          {FUEL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="sm">
        <SelectField<FilterForm>
          name="minPrice"
          register={register}
          errors={errors}
          defaultValue="Min price"
        >
          <option key="min-price" value={''}>
            Min price
          </option>
          {PRICES.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </SelectField>

        <SelectField<FilterForm>
          name="maxPrice"
          register={register}
          errors={errors}
        >
          <option key="max-price" value={''}>
            Max price
          </option>
          {PRICES.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </SelectField>
      </Grid>

      <Button
        type="submit"
        variant="primary"
        marginTop="sm"
        disabled={!isValid}
      >
        Search
      </Button>

      <Container marginTop="sm">
        <ButtonAsLink onClick={reset}>Reset fields</ButtonAsLink>
      </Container>
    </Form>
  );
};
