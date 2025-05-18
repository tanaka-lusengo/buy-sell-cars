'use server';

import { createClient } from '@/supabase/server';
import {
  AddVehicleFormType,
  AddVehicleDataType,
  AddVehicleImageDataType,
  ListingCategoryType,
} from '@/src/types';
import { handleServerError, StatusCode } from '@/src/utils';
import { addVehicleValidationSchema } from '@/src/schemas';
import { revalidatePath } from 'next/cache';
import { Tables } from '@/database.types';

type AddVehicleProps = {
  profile: Tables<'profiles'>;
  formData: AddVehicleFormType;
};

export const addVehicle = async ({ profile, formData }: AddVehicleProps) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // Validate form data
    const parsedData = addVehicleValidationSchema.parse(formData);

    // Create vehicle data object
    const addVehicleData: AddVehicleDataType = {
      owner_id: profile.id,
      listing_category: parsedData.listingCategory,
      make: parsedData.make,
      model: parsedData.model,
      location: parsedData.location,
      price: Number(parsedData.price),
      mileage: Number(parsedData.mileage),
      condition: parsedData.condition,
      year: Number(parsedData.year),
      fuel: parsedData.fuelType,
      gear_box: parsedData.gearBox,
      vehicle_category: parsedData.vehicleCategory,
      doors: Number(parsedData.doors),
      seats: Number(parsedData.seats),
      description: parsedData.description,
      spec_sheet_path: null,
    };

    const { data, error } = await supabase
      .from('vehicles')
      .insert(addVehicleData)
      .select();

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath('/', 'layout');

    return { data: data[0], status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'adding vehicle (server)');
  }
};

type AddVehicleImagePathsProps = {
  vehicleId: string;
  imagePaths: string[];
};

export const addVehicleImagePaths = async ({
  vehicleId,
  imagePaths,
}: AddVehicleImagePathsProps) => {
  // Init supabase client
  const supabase = await createClient();

  console.info('Saving image paths to database...');
  try {
    const addVehicleImagesData = () =>
      imagePaths.map((url) => {
        return {
          vehicle_id: vehicleId,
          image_path: url,
        } satisfies AddVehicleImageDataType;
      });

    const { error: addVehicleImagesError } = await supabase
      .from('vehicle_images')
      .insert(addVehicleImagesData());

    if (addVehicleImagesError) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: addVehicleImagesError,
      };
    }

    return { data: null, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'adding vehicle image paths (server)');
  }
};

type UpdateVehicleWithSpecSheetProps = {
  vehicleId: string;
  specSheetFilePath: string | null;
};

export const updateVehicleWithSpecSheet = async ({
  vehicleId,
  specSheetFilePath,
}: UpdateVehicleWithSpecSheetProps) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    if (!specSheetFilePath) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: 'spec sheet file path is required',
      };
    }

    const { error: updateVehicleSpecSheetError } = await supabase
      .from('vehicles')
      .update({ spec_sheet_path: specSheetFilePath })
      .eq('id', vehicleId);

    if (updateVehicleSpecSheetError) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: updateVehicleSpecSheetError,
      };
    }

    return { data: null, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(
      error,
      'updating vehicle with spec sheet (server)'
    );
  }
};

export const getVehicleByOwnerId = async (ownerId: string) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch vehicle by owner id
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // fetch vehicle images by vehicle id
    const vehiclesWithImages = await Promise.all(
      data.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from('vehicle_images')
          .select('*')
          .eq('vehicle_id', vehicle.id);

        if (imagesError) {
          throw imagesError;
        }
        return { ...vehicle, images };
      })
    );

    return {
      data: vehiclesWithImages,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, 'getting vehicles (server)');
  }
};

export const getVehicleById = async (vehicleId: string) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch vehicle by id
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // fetch vehicle images by vehicle id
    const { data: images, error: imagesError } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId);

    if (imagesError) {
      throw imagesError;
    }

    return {
      data: { ...data, images },
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, 'getting vehicle (server)');
  }
};

export const getAllCarsByCategory = async (
  category: ListingCategoryType[number]
) => {
  // Init supabase client
  const supabase = await createClient();
  try {
    // fetch all cars
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('listing_category', category);

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // fetch vehicle images by vehicle id
    const vehicleWithImages = await Promise.all(
      data.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from('vehicle_images')
          .select('*')
          .eq('vehicle_id', vehicle.id);

        if (imagesError) {
          throw imagesError;
        }

        return { ...vehicle, images };
      })
    );

    return { data: vehicleWithImages, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'getting cars (server)');
  }
};

export const getAllDealers = async () => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch all dealers
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_category', 'dealership');

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    return { data, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, 'getting dealers (server)');
  }
};
