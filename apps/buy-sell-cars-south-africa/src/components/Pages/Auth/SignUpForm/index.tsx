"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  InputField,
  SelectField,
  TextareaField,
} from "~bsc-shared/components/FormComponents";
import { USER_CATEGORYS } from "~bsc-shared/constants";
import { Typography, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
  toSnakeCase,
} from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { signUpValidationSchema, signUpFormDefaultValues } from "@/src/schemas";
import { signUp } from "@/src/server/actions/auth";
import { type SignUpFormType } from "@/src/types";
import { Stack, Grid, HStack, Divider } from "@/styled-system/jsx";
import { Form } from "./index.styled";

export const SignUpForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpValidationSchema),
    mode: "all",
    defaultValues: signUpFormDefaultValues,
  });

  const handleAction = async (formData: SignUpFormType) => {
    try {
      const { status, error } = await signUp(formData);

      if (status !== StatusCode.SUCCESS) {
        return handleClientError("signing up, please try again later.", error);
      }

      toastNotifySuccess("Sign up Success!");
      setShowSuccess(true);
    } catch (error) {
      handleClientError("signing up", error);
    }
  };

  const categoryType = watch("categoryType");

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: SignUpFormType) => await handleAction(formValues)
      )}
    >
      <HStack marginBottom="md">
        <Typography variant="h1">
          {!showSuccess ? "Sign up" : "Thank you for signing up!"}
        </Typography>
      </HStack>

      {!showSuccess ? (
        <>
          <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="sm">
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

          <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="sm">
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
              placeholder="+27..."
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid
            gridTemplateColumns={{
              base: "1fr",
              sm: categoryType === "dealership" ? "1fr 1fr" : "1fr",
            }}
            gap="sm"
          >
            <SelectField
              label="Category"
              name="categoryType"
              register={register}
              errors={errors}
            >
              <option key="user-type" value={""}>
                Select category
              </option>
              {USER_CATEGORYS.map((category) => (
                <option key={category} value={toSnakeCase(category)}>
                  {category}
                </option>
              ))}
            </SelectField>

            {categoryType === "dealership" && (
              <InputField
                label="Dealership name"
                name="dealershipName"
                register={register}
                errors={errors}
              />
            )}
          </Grid>

          <>
            <SelectField
              label="Province"
              name="location"
              register={register}
              errors={errors}
            >
              <option key="location" value={""}>
                Select location
              </option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </SelectField>

            <TextareaField
              label="Description"
              name="description"
              placeholder="Describe your business in a few words..."
              register={register}
              errors={errors}
            />
          </>

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

          <Divider marginY="md" color="grey" />

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
            Now sign in to your account to get started.
          </Typography>

          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        </Stack>
      )}
    </Form>
  );
};
