"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FileInputField,
  InputField,
  SelectField,
  TextareaField,
} from "~bsc-shared/components/FormComponents";
import { Button, Typography } from "~bsc-shared/ui";
import { handleClientError, toastNotifySuccess } from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { useFileUploadHelpers } from "@/src/hooks";
import {
  updateProfileFormDefaultValues,
  updateProfileValidationSchema,
} from "@/src/schemas";
import { Profile, UpdateProfileFormType } from "@/src/types";
import { Box, Grid } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { Form } from "./common.styled";
import { RenderUploadedFile } from "./components/RenderUploadedFile";
import { getLabelText } from "./utils/getLabelText";

export const Account = ({ profile }: { profile: Profile | null }) => {
  const supabase = createClient();
  const router = useRouter();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [imagesPreview, setImagesPreview] = useState<string>("");
  const [govtIdPreview, setGovtIdPreview] = useState<string>("");
  const [profileLogoPath, setProfileLogoPath] = useState<string | null>(
    profile?.profile_logo_path || null
  );
  const [governmentIdPath, setGovernmentIdPath] = useState<string | null>(
    profile?.government_id_path || null
  );

  const isDealership = profile?.user_category === "dealership";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormType>({
    resolver: zodResolver(updateProfileValidationSchema),
    mode: "all",
    defaultValues: updateProfileFormDefaultValues(profile as Profile),
  });

  const { getPublicUrl, deleteOldFiles, compressAndUploadFile } =
    useFileUploadHelpers(supabase);

  const updateProfile = async (formData: UpdateProfileFormType) => {
    try {
      if (!profile) return;

      const newProfileLogoPath = imageFile
        ? await compressAndUploadFile({
            id: profile.id,
            file: imageFile,
            bucket: "profile-logos",
            fileNamePrefix: "profile-logo",
          })
        : profileLogoPath;

      try {
        await deleteOldFiles("profile-logos", [profileLogoPath || ""]);
      } catch (err) {
        return handleClientError("deleting old profile logo", err);
      }

      const newGovernmentIdPath = idFile
        ? await compressAndUploadFile({
            id: profile.id,
            file: idFile,
            bucket: "government-ids",
            fileNamePrefix: "government-id",
          })
        : governmentIdPath;

      try {
        await deleteOldFiles("government-ids", [governmentIdPath || ""]);
      } catch (err) {
        return handleClientError("deleting old government ID", err);
      }

      const updatedProfile = {
        id: profile.id,
        email: formData.email || profile.email,
        first_name: formData.firstName || profile.first_name,
        last_name: formData.lastName || profile.last_name,
        phone: formData.phone || profile.phone,
        dealership_name: formData.dealershipName || profile.dealership_name,
        location: formData.location || profile.location,
        address: formData.address || profile.address,
        description: formData.description || profile.description,
        profile_logo_path: newProfileLogoPath || profile.profile_logo_path,
        government_id_path: newGovernmentIdPath || profile.government_id_path,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updatedProfile)
        .eq("id", profile.id);

      if (error) throw error;

      setProfileLogoPath(newProfileLogoPath);
      setGovernmentIdPath(newGovernmentIdPath);

      toastNotifySuccess("Profile updated successfully!");
      router.refresh();
    } catch (error) {
      handleClientError("Error updating profile", error);
    }
  };

  // Generate labels dynamically
  const imgLabel = getLabelText(
    imageFile,
    isSubmitting,
    `${isDealership ? "Business" : "Profile"} logo`,
    `${isDealership ? "Business" : "Profile"} logo`
  );

  const idLabel = getLabelText(
    idFile,
    isSubmitting,
    "Government ID",
    "Government ID"
  );

  return (
    <Form
      onSubmit={handleSubmit(
        async (formData: UpdateProfileFormType) => await updateProfile(formData)
      )}
    >
      <Box marginBottom="md">
        <Typography variant="h3">
          Welcome:{" "}
          {isDealership ? profile.dealership_name : profile?.first_name || ""}
        </Typography>

        <Typography variant="h4">Update your account details</Typography>
        <Typography>
          <i>
            (Note: If you have <b>no profile logo</b>, your listing will not be
            visible on the platform)
          </i>
        </Typography>
      </Box>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        <Box>
          <RenderUploadedFile
            filePath={imagesPreview || profileLogoPath}
            fieleSrc={
              imagesPreview ||
              `${getPublicUrl("profile-logos", profileLogoPath as string)}`
            }
            profileName={profile?.dealership_name || ""}
            alt="Profile Logo"
          />

          <FileInputField
            accept="image/*"
            label={imgLabel}
            name="profileLogoPath"
            disabled={isSubmitting}
            register={{
              ...register("profileLogoPath"),
              onChange: async (e) => {
                setImageFile(e.target.files?.[0] || null);
                setImagesPreview(URL.createObjectURL(e.target.files?.[0]));
              },
            }}
            errors={errors}
          />
        </Box>

        <Box>
          <RenderUploadedFile
            filePath={govtIdPreview || governmentIdPath}
            fieleSrc={
              govtIdPreview ||
              `${getPublicUrl("government-ids", governmentIdPath as string)}`
            }
            alt="Government ID"
          />

          <FileInputField
            accept="image/*,application/pdf"
            label={idLabel}
            name="governmentIdPath"
            disabled={isSubmitting}
            onChange={(e) => setIdFile(e.target.files?.[0] || null)}
            register={{
              ...register("governmentIdPath"),
              onChange: async (e) => {
                setIdFile(e.target.files?.[0] || null);
                setGovtIdPreview(URL.createObjectURL(e.target.files?.[0]));
              },
            }}
            errors={errors}
          />
        </Box>
      </Grid>

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
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

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
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

      <Grid gridTemplateColumns="1fr 1fr" gap="sm">
        {isDealership && (
          <InputField
            label="Dealership name"
            name="dealershipName"
            register={register}
            errors={errors}
          />
        )}

        <SelectField
          label="Location"
          name="location"
          register={register}
          errors={errors}
        >
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

      <InputField
        label="Address"
        name="address"
        register={register}
        errors={errors}
      />

      <TextareaField
        label="Description"
        name="description"
        placeholder="Describe your business..."
        register={register}
        errors={errors}
      />

      <Button marginTop="md" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update profile"}
      </Button>
    </Form>
  );
};
