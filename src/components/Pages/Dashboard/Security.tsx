"use client";

import { Box } from "@/styled-system/jsx";
import { Button, Typography } from "../../ui";
import { SecurityForm } from "./common.styled";
import { InputField } from "../../FormComponents";
import { updatePasswordValidationSchema } from "@/src/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdatePasswordFormType } from "@/src/types";
import { updatePassword } from "@/src/server/actions/auth";
import {
  generateIcon,
  handleClientError,
  StatusCode,
  toastNotifySuccess,
} from "@/src/utils";

export const Security = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormType>({
    resolver: zodResolver(updatePasswordValidationSchema),
    mode: "all",
  });

  const handleUpdatePassword = async (formData: UpdatePasswordFormType) => {
    try {
      const { status, error } = await updatePassword(formData);

      if (status !== StatusCode.SUCCESS || error) {
        handleClientError("updating your password", error);
        return;
      }

      toastNotifySuccess("Password updated successfully");
    } catch (error) {
      handleClientError("updating your password", error);
    }
  };

  return (
    <Box padding="lg">
      <Box>
        <Typography as="h1" variant="h2">
          Security Settings
        </Typography>
      </Box>

      <SecurityForm
        onSubmit={handleSubmit(
          async (formData: UpdatePasswordFormType) =>
            await handleUpdatePassword(formData)
        )}
      >
        <Typography variant="h3">Update Password</Typography>

        <InputField
          name="currentPassword"
          label="Current Password"
          type="password"
          placeholder="Enter your current password"
          register={register}
          errors={errors}
        />

        <InputField
          name="newPassword"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          register={register}
          errors={errors}
        />

        <InputField
          name="confirmNewPassword"
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your new password"
          register={register}
          errors={errors}
        />

        <Box>
          <Button type="submit" disabled={isSubmitting}>
            <Typography
              as="span"
              color="white"
              style={{ marginRight: "0.5rem" }}
            >
              {generateIcon("lock")}
            </Typography>{" "}
            Confirm New Password
          </Button>
        </Box>
      </SecurityForm>
    </Box>
  );
};
