"use server";

import { revalidatePath } from "next/cache";
import { Tables } from "@/database.types";
import {
  signUpValidationSchema,
  signInValidationSchema,
  subscribeValidationSchema,
  updatePasswordValidationSchema,
} from "@/src/schemas/authValidationSchemas";
import {
  SignUpFormType,
  SignInFormType,
  SubscribeFormType,
  UpdatePasswordFormType,
} from "@/src/types";
import { handleServerError, StatusCode } from "@/src/utils";
import { createClient } from "@/supabase/server";

export const subscribe = async (formData: SubscribeFormType) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = subscribeValidationSchema.parse(formData);

    const { email } = parsedData;

    // Check if the email is already subscribed
    const { data: existingEmail } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .single();

    // If the email is already subscribed, return an error
    if (existingEmail) {
      return {
        status: StatusCode.BAD_REQUEST,
        error: "Already subscribed",
      };
    }

    const { error } = await supabase.from("subscribers").insert({ email });

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/", "layout");

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "subscribing to newsletter (server)");
  }
};

export const signUp = async (formData: SignUpFormType) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = signUpValidationSchema.parse(formData);

    const createUserData: Partial<Tables<"profiles">> = {
      email: parsedData.email,
      first_name: parsedData.firstName,
      last_name: parsedData.lastName,
      phone: parsedData.phone.replace(/\s+/g, ""),
      user_category: parsedData.categoryType,
      dealership_name: parsedData.dealershipName,
      location: parsedData.location,
      description: parsedData.description,
    };

    // Sign up with Supabase Auth and pass user data to the profiles table
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: parsedData.email,
      password: parsedData.password,
      options: {
        data: createUserData,
      },
    });

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/", "layout");

    return { data: user, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "signing up (server)");
  }
};

export const signIn = async (formData: SignInFormType) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = signInValidationSchema.parse(formData);

    const signInUserData = {
      email: parsedData.email,
      password: parsedData.password,
    } satisfies SignInFormType;

    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword(signInUserData);

    if (error || !user) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/", "layout");

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "signing in (server)");
  }
};

export const signOut = async () => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Check if a user's logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.signOut();
    }

    revalidatePath("/", "layout");

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "signing out (server)");
  }
};

/**
 * Fetches the authenticated user and their profile from Supabase.
 * @returns An object containing the user and their profile.
 */
export const fetchUserAndProfile = async () => {
  const supabase = await createClient();

  // Fetch the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  // If a user is authenticated, fetch their profile
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = profileData ?? null;
  }

  return { user, profile };
};

export const resetPassword = async (email: string) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/", "layout");

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "resetting password (server)");
  }
};

export const updatePassword = async (formData: UpdatePasswordFormType) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = updatePasswordValidationSchema.parse(formData);

    const { newPassword, confirmNewPassword } = parsedData;

    // Check if the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "New passwords do not match",
      };
    }

    const { data, error } = await supabase.auth.updateUser({
      password: confirmNewPassword,
    });

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/dashboard/security", "page");

    return { data, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "updating password (server)");
  }
};

export const updateUser = async (userData: Partial<Tables<"profiles">>) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      data: userData,
    });

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/", "layout");

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "updating user (server)");
  }
};
