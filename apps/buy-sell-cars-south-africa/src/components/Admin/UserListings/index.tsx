"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ResponsiveContainer, H2, H3, P } from "~bsc-shared/ui";
import {
  formatToReadableString,
  handleClientError,
  StatusCode,
  toastNotifySuccess,
} from "~bsc-shared/utils";
import { useFileUploadHelpers } from "@/src/hooks";
import { updateProfileAdminValidationSchema } from "@/src/schemas";
import { adminDeleteUser } from "@/src/server/actions/auth";
import type { Profile } from "@/src/types";
import { CategoryType, UpdateProfileAdminFormType } from "@/src/types";
import { Grid, Box, Flex } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { ListingsForm } from "../../Pages/Dashboard/common.styled";
import { ProfileRow } from "./components";

const TABLE_HEADERS = [
  "No.",
  "Actions",
  "Logo",
  "Is Verified?",
  "Email",
  "First Name",
  "Last Name",
  "Dealership Name",
  "Phone",
  "Location",
  "Description",
  "Created On",
  "Updated On",
];

type UserListingsProps = {
  userCategory: CategoryType[number];
  profiles: Profile[];
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const UserListings = ({
  userCategory,
  profiles,
  error,
  status,
}: UserListingsProps) => {
  const supabase = createClient();
  const { getPublicUrl, compressAndUploadFile, deleteOldFiles } =
    useFileUploadHelpers(supabase);
  const { refresh } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileAdminFormType>({
    resolver: zodResolver(updateProfileAdminValidationSchema),
    mode: "all",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [currentProfileImage, setCurrentProfileImage] =
    useState<Profile["profile_logo_path"]>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImagePreview = (file: File | null) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
    setCurrentProfileImage(
      profiles.find((profile) => profile.id === id)?.profile_logo_path || null
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setImagePreview("");
  };

  const handleDeleteClick = async (profileId: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    const { error, status } = await adminDeleteUser(profileId);

    if (status !== StatusCode.SUCCESS || error)
      return handleClientError("deleting profile listing", error);

    toastNotifySuccess("Profile deleted successfully!");
  };

  const handleSave = async (formData: UpdateProfileAdminFormType) => {
    if (!editingId) return console.error("No profile ID provided for editing");

    try {
      if (profileImageFile) {
        const newProfileLogoPath = profileImageFile
          ? await compressAndUploadFile({
              id: editingId,
              file: profileImageFile,
              bucket: "profile-logos",
              fileNamePrefix: "profile-logo",
            })
          : currentProfileImage;

        const { error } = await supabase
          .from("profiles")
          .update({ profile_logo_path: newProfileLogoPath })
          .eq("id", editingId);

        if (error) throw error;

        try {
          await deleteOldFiles("profile-logos", [currentProfileImage || ""]);
        } catch (err) {
          return handleClientError("deleting old profile logo", err);
        }

        setCurrentProfileImage(newProfileLogoPath);
      }

      const updatedProfile = {
        id: editingId,
        is_verified: formData.isVerified === "true" ? true : false,
        first_name: formData.firstName,
        last_name: formData.lastName,
        dealership_name: formData.dealershipName,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        description: formData.description,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updatedProfile)
        .eq("id", editingId);

      if (error) {
        handleClientError("updating profile", error);
        setEditingId(null);
        return;
      }

      setEditingId(null);

      toastNotifySuccess("Profile updated successfully!");
      refresh();
    } catch (error) {
      handleClientError("Error updating profile", error);
    }
  };

  return (
    <Box padding="lg">
      <Flex direction="column" gap="sm" paddingBottom="lg">
        <H2>Client listings: {formatToReadableString(userCategory)}</H2>

        <P>
          Manage your customer&#39;s listing status. You can verify, delete, and
          view details of each listing from here.
        </P>
      </Flex>

      {status !== StatusCode.SUCCESS && error && (
        <ResponsiveContainer>
          <Flex direction="column" paddingY="md" gap="sm">
            <H3 color="error">Error fetching profiles</H3>

            <P color="error">Please try again a later time</P>

            {error === typeof "string" && <P color="error">{error}</P>}
          </Flex>
        </ResponsiveContainer>
      )}

      {status === StatusCode.SUCCESS && profiles.length === 0 && (
        <ResponsiveContainer>
          <Flex direction="column" gap="sm" paddingY="lg">
            <H3 align="center" color="primaryDark">
              There are no profile listings available.
            </H3>
          </Flex>
        </ResponsiveContainer>
      )}

      {status === StatusCode.SUCCESS && profiles.length > 0 && (
        <ListingsForm
          onSubmit={handleSubmit(
            async (formData: UpdateProfileAdminFormType) =>
              await handleSave(formData)
          )}
        >
          <table>
            {/* Table Header */}
            <Grid
              gridTemplateColumns="0.5fr repeat(3, 1fr) 2fr repeat(5, 1fr) 1.5fr repeat(2, 1fr)"
              gap="sm"
              paddingX="md"
              paddingY="sm"
              bg="greyLight"
              borderRadius="1rem"
            >
              {TABLE_HEADERS.map((headerItem) => (
                <Box key={headerItem}>
                  <P>{headerItem}</P>
                </Box>
              ))}
            </Grid>

            {/* Table Body */}
            {profiles.map((profile, index) => (
              <ProfileRow
                key={profile.id}
                count={index + 1}
                imagePreview={imagePreview}
                profileId={profile.id}
                profile={profile}
                editingId={editingId}
                isSubmitting={isSubmitting}
                handleDeleteClick={handleDeleteClick}
                handleStartEdit={handleStartEdit}
                handleCancelEdit={handleCancelEdit}
                register={register}
                errors={errors}
                getPublicUrl={getPublicUrl}
                setProfileImageFile={setProfileImageFile}
                handleImagePreview={handleImagePreview}
              />
            ))}
          </table>
        </ListingsForm>
      )}
    </Box>
  );
};
