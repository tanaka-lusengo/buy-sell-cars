"use server";

import { revalidatePath } from "next/cache";
import {
  handleServerError,
  logErrorMessage,
  StatusCode,
} from "~bsc-shared/utils";
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
  Profile,
  LogSubscriptionType,
} from "@/src/types";
import { createClient, createClientServiceRole } from "@/supabase/server";
import { logSubscription } from "./payment";

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

export const hasAlreadySubscribed = async (email: string) => {
  try {
    const supabase = await createClient();

    const { data: existingEmail } = await supabase
      .from("subscribers")
      .select("email")
      .eq("email", email)
      .single();

    return { hasSubscribed: !!existingEmail };
  } catch (error) {
    logErrorMessage(error, "checking email subscription (server)");
    return { hasSubscribed: false };
  }
};

export const signUp = async (formData: SignUpFormType) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = signUpValidationSchema.parse(formData);

    const createUserData: Partial<Profile> = {
      email: parsedData.email,
      first_name: parsedData.firstName,
      last_name: parsedData.lastName,
      phone: parsedData.phone.replace(/\s+/g, ""),
      user_category: parsedData.categoryType,
      dealership_name: parsedData.dealershipName || null,
      location: parsedData.location || null,
      description: parsedData.description || null,
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

    if (error || !user) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // If user creation is successful, log subscription if individual
    if (createUserData.user_category === "individual") {
      const subscriptionData = {
        profile_id: user.id,
        email: user.email || "",
        subscription_name: "Individual Plan (Free)",
        start_time: new Date().toISOString(),
      };

      const { status, error: subscriptionError } = await logSubscription(
        user,
        subscriptionData as LogSubscriptionType
      );

      if (status !== StatusCode.SUCCESS) {
        console.error("Error subscribing user:", subscriptionError);
      }
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
 * Checks if a user has an active subscription in the subscriptions table
 * @param profileId - The ID of the profile to check for active subscriptions
 * @returns Boolean indicating if the user has an active subscription
 */
export const hasActiveSubscription = async (profileId: string) => {
  try {
    const supabase = await createClient();

    const { data: subscriptionData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .eq("status", "active")
      .single();

    return !!subscriptionData;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
  }
};

/**
 * Checks if a user has an active subscription in the subscriptions table
 * @param profileId - The ID of the profile to check for active subscriptions
 * @returns Boolean indicating if the user has an active subscription
 */
export const hasSubscription = async (profileId: string) => {
  try {
    const supabase = await createClient();

    const { data: subscriptionData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("profile_id", profileId)
      .single();

    return !!subscriptionData;
  } catch (error) {
    console.error("Error checking subscription:", error);
    return false;
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

export const fetchUserProfile = async (userId: string) => {
  const supabase = await createClient();

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return profileData ?? null;
};

export const fetchAllProfiles = async () => {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error("Error fetching all profiles:", error);
    return [];
  }

  return profiles ?? [];
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

/**
 * Deletes the authenticated user's profile from the database and signs them out.
 * @returns An object indicating the status and any error encountered.
 */
export const deleteProfile = async () => {
  try {
    // Init supabase client
    const supabase = await createClientServiceRole();

    // Get the currently authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no user is authenticated, return an error
    if (userError || !user) {
      return {
        status: StatusCode.BAD_REQUEST,
        error: "User not authenticated",
      };
    }

    // Delete the user's profile from the 'profiles' table
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (profileError) {
      return { status: StatusCode.BAD_REQUEST, error: profileError };
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    if (authError) {
      return { status: StatusCode.BAD_REQUEST, error: authError };
    }

    // Sign the user out after deleting their profile
    await supabase.auth.signOut();

    // Revalidate the homepage layout
    revalidatePath("/", "layout");

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "deleting profile (server)");
  }
};

/**
 * Deletes a user and their profile by user ID. Intended for admin use.
 * Requires Supabase service role privileges for auth.admin.deleteUser.
 * @param userId - The ID of the user to delete.
 * @returns An object indicating the status and any error encountered.
 */
export const adminDeleteUser = async (userId: string) => {
  try {
    // Init supabase client
    const supabase = await createClientServiceRole();

    // Delete the user's profile from the 'profiles' table
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      // Return error if profile deletion fails
      return { status: StatusCode.BAD_REQUEST, error: profileError };
    }

    // Delete the user from Supabase Auth
    // Note: This requires service role privileges
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      // Return error if auth deletion fails
      return { status: StatusCode.BAD_REQUEST, error: authError };
    }

    // Optionally, revalidate any relevant paths if needed
    revalidatePath("/", "layout");

    // Return success status
    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    // Handle unexpected errors
    return handleServerError(error, "admin deleting user (server)");
  }
};
