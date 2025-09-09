"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  InputField,
  SelectField,
  TextareaField,
  FileInputField,
} from "~bsc-shared/components/FormComponents";
import { USER_CATEGORYS } from "~bsc-shared/constants";
import { H1, H4, P, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
  toSnakeCase,
} from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { useFileUploadHelpers } from "@/src/hooks";
import { signUpValidationSchema, signUpFormDefaultValues } from "@/src/schemas";
import { signUp } from "@/src/server/actions/auth";
import { type SignUpFormType } from "@/src/types";
import { Stack, Grid, HStack, Divider, Box } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { ProfilePhotoPreviewModal } from "./components";
import { Form } from "./index.styled";

export const SignUpForm = () => {
  const supabase = createClient();
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpValidationSchema),
    mode: "all",
    defaultValues: signUpFormDefaultValues,
  });

  const { compressAndUploadFile } = useFileUploadHelpers(supabase);

  const handlePreviewClick = () => {
    if (imageFile) {
      setIsPreviewModalOpen(true);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
  };

  const handleAction = async (formData: SignUpFormType) => {
    try {
      setUploading(true);

      if (!imageFile) {
        return handleClientError("Profile photo is required", null);
      }

      // Create user first to get user ID
      const { data: user, status, error } = await signUp(formData);

      if (status !== StatusCode.SUCCESS || !user) {
        return handleClientError("signing up, please try again later.", error);
      }

      // Upload profile photo
      const profileLogoPath = await compressAndUploadFile({
        id: user.id,
        file: imageFile,
        bucket: "profile-logos",
        fileNamePrefix: "profile-logo",
      });

      if (!profileLogoPath) {
        return handleClientError(
          "Profile photo upload failed. Please try again.",
          null
        );
      }

      // Update the user's profile with the logo path
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_logo_path: profileLogoPath })
        .eq("id", user.id);

      if (updateError) {
        return handleClientError(
          "Error updating profile with photo",
          updateError
        );
      }

      toastNotifySuccess("Sign up Success!");
      setShowSuccess(true);
    } catch (error) {
      handleClientError("signing up", error);
    } finally {
      setUploading(false);
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
        <H1>{!showSuccess ? "Sign up" : "Thank you for signing up!"}</H1>
      </HStack>

      {!showSuccess ? (
        <>
          {/* Profile Photo Upload Section */}
          <Box marginBottom="md">
            <Box marginBottom="sm">
              <H4>Profile Photo Required</H4>
            </Box>
            <Box marginBottom="sm">
              <P>
                <i>Upload a profile photo to continue with signup</i>
              </P>
            </Box>

            <Grid
              gridTemplateColumns={{ base: "1fr", sm: "1fr auto" }}
              gap="sm"
              alignItems="end"
            >
              <FileInputField
                accept="image/*"
                label={
                  uploading || isSubmitting
                    ? "Uploading..."
                    : imageFile
                      ? "Change photo"
                      : "Choose photo"
                }
                name="profileLogoPath"
                disabled={uploading || isSubmitting}
                register={{
                  ...register("profileLogoPath"),
                  onChange: async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagesPreview(URL.createObjectURL(file));
                    } else {
                      setImageFile(null);
                      setImagesPreview("");
                    }
                  },
                }}
                errors={errors}
              />

              {imageFile && (
                <Button
                  type="button"
                  onClick={handlePreviewClick}
                  disabled={uploading || isSubmitting}
                >
                  Preview
                </Button>
              )}
            </Grid>

            {imageFile && (
              <Box marginTop="sm">
                <P style={{ opacity: 0.3 }}>
                  Selected: {imageFile.name} (
                  {(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                </P>
              </Box>
            )}
          </Box>

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

            <InputField
              label="Address"
              name="address"
              register={register}
              errors={errors}
            />

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
            <Button type="submit" disabled={uploading || isSubmitting}>
              {uploading || isSubmitting ? "Creating Account..." : "Submit"}
            </Button>
          </Stack>

          <Divider marginY="md" color="grey" />

          <P color="primaryDark" weight="bold">
            <i>Already have an account?</i>
          </P>

          <HStack justifyContent="space-between">
            <Link href="/sign-in">
              <P hoverEffect="color">Sign in</P>
            </Link>

            <Link href="/">
              <P hoverEffect="color">Close</P>
            </Link>
          </HStack>
        </>
      ) : (
        <Stack alignItems="center" marginTop="md" gap="md">
          <H4 align="center">Now sign in to your account to get started.</H4>

          <Link href="/sign-in">
            <Button>Sign in</Button>
          </Link>
        </Stack>
      )}

      <ProfilePhotoPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        imageSrc={imagesPreview}
        imageFile={imageFile}
      />
    </Form>
  );
};
