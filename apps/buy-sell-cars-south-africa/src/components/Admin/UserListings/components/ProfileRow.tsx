import Image from "next/image";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FileInputField } from "~bsc-shared/components/FormComponents";
import { Typography } from "~bsc-shared/ui";
import { formatToReadableString, formatDate } from "~bsc-shared/utils";
import defaultUserIcon from "@/public/images/default-user-icon.png";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import {
  Profile,
  StorageBucket,
  UpdateProfileAdminFormType,
} from "@/src/types";
import { Flex, Divider, Box, Grid } from "@/styled-system/jsx";
import { ActionButtons } from "./ActionButtons";
import { EditableInput } from "./EditableInput";

type ProfileRowProps = {
  count: number;
  imagePreview: string;
  profileId: string;
  profile: Profile;
  editingId: string | null;
  isSubmitting: boolean;
  handleDeleteClick: (id: string) => void;
  handleStartEdit: (id: string) => void;
  handleCancelEdit: () => void;
  handleImagePreview: (file: File | null) => void;
  setProfileImageFile: (file: File | null) => void;
  register: UseFormRegister<UpdateProfileAdminFormType>;
  errors: FieldErrors<UpdateProfileAdminFormType>;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const ProfileRow = ({
  count,
  imagePreview,
  profileId,
  profile,
  editingId,
  isSubmitting,
  handleDeleteClick,
  handleStartEdit,
  handleCancelEdit,
  handleImagePreview,
  setProfileImageFile,
  register,
  errors,
  getPublicUrl,
}: ProfileRowProps) => {
  return (
    <Box>
      {editingId === profileId && imagePreview && (
        <>
          <Flex direction="column" gap="sm" marginY="md" paddingX="lg">
            <Typography weight="bold">Preview:</Typography>

            <Flex gap="xxs" flexWrap="wrap">
              <Image
                src={imagePreview}
                alt="Profile Image Preview"
                width={80}
                height={80}
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
                quality={70}
              />
            </Flex>
          </Flex>
        </>
      )}

      <Grid
        gridTemplateColumns="0.5fr repeat(3, 1fr) 2fr repeat(5, 1fr) 1.5fr repeat(2, 1fr)"
        alignItems="center"
        gap="sm"
        paddingX="md"
        paddingY="sm"
        marginY="sm"
        border="1px solid"
        borderColor="transparent"
        borderRadius="1rem"
        transition="0.2s ease-in-out"
        _hover={{
          backgroundColor: "greyLight",
        }}
      >
        <Box>
          <Typography>{count}</Typography>
        </Box>

        <ActionButtons
          key={`actions-${profileId}`}
          profileId={profileId}
          editingId={editingId}
          isSubmitting={isSubmitting}
          handleDeleteClick={handleDeleteClick}
          handleStartEdit={handleStartEdit}
          handleCancelEdit={handleCancelEdit}
        />

        {editingId === profileId ? (
          <Box>
            <FileInputField
              accept="image/*"
              name="profileLogoPath"
              disabled={isSubmitting}
              register={{
                ...register("profileLogoPath"),
                onChange: async (e) => {
                  const file = e.target.files?.[0] || null;
                  setProfileImageFile(file);
                  handleImagePreview(file);
                },
              }}
              errors={errors}
            />
          </Box>
        ) : (
          <Box>
            {profile.profile_logo_path && (
              <Flex gap="sm" key={`actions-${profile.id}`} alignItems="center">
                <Image
                  key={`image-${profile.id}`}
                  src={
                    profile.profile_logo_path
                      ? getPublicUrl("profile-logos", profile.profile_logo_path)
                      : defaultUserIcon
                  }
                  alt={`${profile.first_name} ${profile.last_name} profile image`}
                  width={50}
                  height={50}
                  style={{
                    borderRadius: "4px",
                    objectFit: DEALER_LOGOS_TO_CONTAIN.includes(
                      String(profile?.dealership_name)
                    )
                      ? "contain"
                      : "cover",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "5rem",
                    height: "5rem",
                  }}
                  quality={70}
                />
              </Flex>
            )}
          </Box>
        )}

        {[
          "isVerified",
          "email",
          "firstName",
          "lastName",
          "dealershipName",
          "phone",
          "location",
          "description",
          "subscription",
        ].map((field) => {
          let newFieldName;

          if (field === "isVerified") {
            newFieldName = "is_verified";
          } else if (field === "firstName") {
            newFieldName = "first_name";
          } else if (field === "lastName") {
            newFieldName = "last_name";
          } else if (field === "dealershipName") {
            newFieldName = "dealership_name";
          } else {
            newFieldName = field;
          }

          const value = profile[newFieldName as keyof Profile];

          const isEmailField = field === "email";

          const displayValue = isEmailField
            ? String(value)
            : formatToReadableString(value ?? "");

          if (editingId === profileId) {
            return (
              <EditableInput
                key={`${profileId}-${field}`}
                name={field}
                value={value ?? ""}
                register={register}
                errors={errors}
              />
            );
          } else {
            return (
              <Box
                key={`${profileId}-${field}`}
                color={
                  field === "isVerified"
                    ? value
                      ? "success"
                      : "error"
                    : undefined
                }
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
                title={displayValue}
              >
                {displayValue}
              </Box>
            );
          }
        })}

        <Box>
          <Typography>{formatDate(profile.created_at || "")}</Typography>
        </Box>
        <Box>
          <Typography>{formatDate(profile.updated_at || "")}</Typography>
        </Box>
      </Grid>

      <Divider
        orientation="horizontal"
        marginY="sm"
        color="grey"
        key={`divider-${profileId}`}
      />
    </Box>
  );
};
