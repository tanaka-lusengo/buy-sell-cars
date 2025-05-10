'use server';

import { revalidatePath } from 'next/cache';
import { Tables } from '@/database.types';
import {
  signUpValidationSchema,
  signInValidationSchema,
} from '@/src/schemas/authValidationSchemas';
import { SignUpFormType, SignInFormType } from '@/src/types';
import { handleServerError, StatusCode } from '@/src/utils';
import { createClient } from '@/supabase/server';

export const signUp = async (formData: SignUpFormType) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = signUpValidationSchema.parse(formData);

    const createUserData: Partial<Tables<'profiles'>> = {
      email: parsedData.email,
      first_name: parsedData.firstName,
      last_name: parsedData.lastName,
      phone: parsedData.phone.replace(/\s+/g, ''),
      user_category: parsedData.categoryType,
      dealership_name: parsedData.dealershipName,
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

    revalidatePath('/', 'layout');

    return { data: user, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'signing up (server)');
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

    revalidatePath('/', 'layout');

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'signing in (server)');
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

    revalidatePath('/', 'layout');

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'signing out (server)');
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
      .from('profiles')
      .select('*')
      .eq('id', user.id)
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

    revalidatePath('/', 'layout');

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'resetting password (server)');
  }
};

export const updatePassword = async (password: string) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath('/', 'layout');

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'updating password (server)');
  }
};

export const updateUser = async (userData: Partial<Tables<'profiles'>>) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      data: userData,
    });

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath('/', 'layout');

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'updating user (server)');
  }
};
