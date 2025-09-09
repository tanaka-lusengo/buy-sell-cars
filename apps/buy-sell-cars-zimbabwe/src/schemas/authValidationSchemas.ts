import * as z from "zod";
import { CategoryType } from "../types";

export const subscribeValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const signInValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export const signUpValidationSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, {
      message: "Enter a valid phone number",
    }),
    categoryType: z
      .enum(["individual", "dealership"] satisfies CategoryType, {
        errorMap: () => ({ message: "Category is required" }),
      })
      .optional(),
    dealershipName: z.string().nullable(),
    location: z.string().min(2, {
      message: "Location is required",
    }),
    address: z.string().min(2, {
      message: "Address must be at least 2 characters",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters",
    }),
    profileLogoPath: z.any().refine((file) => file !== undefined, {
      message: "Profile photo is required",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    ({ categoryType, dealershipName }) =>
      categoryType !== "dealership" ||
      (typeof dealershipName === "string" && dealershipName.trim().length > 0),
    {
      message: "Dealership name is required",
      path: ["dealershipName"],
    }
  );

export const updatePasswordValidationSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, {
      message: "New password must be at least 8 characters",
    }),
    confirmNewPassword: z.string().min(8, {
      message: "Confirm password must be at least 8 characters",
    }),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    }
  );
