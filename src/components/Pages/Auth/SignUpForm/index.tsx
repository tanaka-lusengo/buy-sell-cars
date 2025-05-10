'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography, Button } from '@/src/components/ui';
import { Stack, Grid, HStack, Divider } from '@/styled-system/jsx';
import {
  InputField,
  SelectField,
  TextareaField,
} from '@/src/components/FormComponents';
import { signUpValidationSchema, signUpFormDefaultValues } from '@/src/schemas';
import { signUp } from '@/src/server/actions/auth';
import { CategoryType, type SignUpFormType } from '@/src/types';
import { handleClientError, StatusCode, toastNotifySuccess } from '@/src/utils';
import { Form } from './index.styled';
import { useState } from 'react';

export const SignUpForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpValidationSchema),
    mode: 'all',
    defaultValues: signUpFormDefaultValues,
  });

  const handleAction = async (formData: SignUpFormType) => {
    try {
      const { status, error } = await signUp(formData);

      if (status !== StatusCode.SUCCESS) {
        return handleClientError('signing up, please try again later.', error);
      }

      toastNotifySuccess('Sign up Success!');
      setShowSuccess(true);
    } catch (error) {
      handleClientError('signing up', error);
    }
  };

  const Category: CategoryType = ['individual', 'dealership'];

  const categoryType = watch('categoryType');

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: SignUpFormType) => await handleAction(formValues)
      )}
    >
      <HStack marginBottom="md">
        <Typography variant="h1">
          {!showSuccess ? 'Sign up' : 'Check your email'}
        </Typography>
      </HStack>

      {!showSuccess ? (
        <>
          <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="sm">
            <InputField
              label="First name"
              name="firstName"
              register={register}
              errors={errors}
            />

            <InputField
              label="Last name"
              name="lastName"
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap="sm">
            <InputField
              label="Email address"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              register={register}
              errors={errors}
            />

            <InputField
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid
            gridTemplateColumns={{
              base: '1fr',
              sm: categoryType === 'dealership' ? '1fr 1fr' : '1fr',
            }}
            gap="sm"
          >
            <SelectField
              label="Category"
              name="categoryType"
              register={register}
              errors={errors}
            >
              <option key="user-type" value={''}>
                Select category
              </option>
              {Category.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </SelectField>

            {categoryType === 'dealership' && (
              <InputField
                label="Dealership name"
                name="dealershipName"
                register={register}
                errors={errors}
              />
            )}
          </Grid>

          {categoryType === 'dealership' && (
            <>
              <InputField
                label="Location"
                name="location"
                register={register}
                errors={errors}
              />

              <TextareaField
                label="Description"
                name="description"
                register={register}
                errors={errors}
              />
            </>
          )}

          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            errors={errors}
          />

          <Stack alignItems="center" marginTop="md">
            <Button type="submit">Submit</Button>
          </Stack>

          <Divider marginY="lg" color="grey" />

          <Typography color="primaryDark" weight="bold">
            <i>Already have an account?</i>
          </Typography>

          <HStack justifyContent="space-between">
            <Link href="/sign-in">
              <Typography hoverEffect="color">Sign in</Typography>
            </Link>

            <Link href="/">
              <Typography hoverEffect="color">Close</Typography>
            </Link>
          </HStack>
        </>
      ) : (
        <Stack alignItems="center" marginTop="md" gap="md">
          <Typography variant="h4" align="center">
            Check your email for a confirmation link.
          </Typography>

          <Link href="/">
            <Typography hoverEffect="color">Go Back</Typography>
          </Link>
        </Stack>
      )}
    </Form>
  );
};
