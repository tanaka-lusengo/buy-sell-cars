"use server";

import { createClient } from "@/supabase/server";
import {
  AddVehicleFormType,
  AddVehicleDataType,
  AddVehicleImageDataType,
  ListingCategoryType,
  EditVehicleDataType,
  EditVehicleFormType,
  Profile,
  CategoryType,
  VehicleCategoryType,
  VehicleWithImageAndDealer,
} from "@/src/types";
import { handleServerError, StatusCode, shuffleArray } from "@/src/utils";
import {
  addVehicleValidationSchema,
  editVehicleValidationSchema,
} from "@/src/schemas";
import { revalidatePath } from "next/cache";
import {
  SUBSCRIPTION_FEATURE_TYPES,
  SubscriptionTypeNames,
} from "@/src/constants/values";

type AddVehicleProps = {
  profile: Profile;
  formData: AddVehicleFormType;
};

export const addVehicle = async ({ profile, formData }: AddVehicleProps) => {
  try {
    // Init supabase client
    const supabase = await createClient();

    // 1. Count current vehicles for this profile
    const { count, error: countError } = await supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", profile.id);

    if (countError) {
      // Return error if unable to count vehicles
      return { data: null, status: StatusCode.BAD_REQUEST, error: countError };
    }

    // 2. Determine max allowed vehicles based on user category and subscription
    let maxVehicles = 0;

    if (profile?.user_category === "dealership") {
      if (profile?.subscription === SubscriptionTypeNames.StarterShowcase) {
        maxVehicles = 25;
      } else if (
        profile?.subscription === SubscriptionTypeNames.GrowthAccelerator
      ) {
        maxVehicles = 75;
      } else if (
        profile?.subscription === SubscriptionTypeNames.DealershipDominator
      ) {
        maxVehicles = 100;
      }
    } else if (profile?.user_category === "individual") {
      maxVehicles = 2;
    }

    // 3. Check if user is within their allowed range
    if (count !== null && count >= maxVehicles) {
      // Return error if limit reached
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: `You have reached your vehicle listing limit on your current subacription (${maxVehicles}).`,
      };
    }

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
      is_active: true,
    };

    const { data, error } = await supabase
      .from("vehicles")
      .insert(addVehicleData)
      .select();

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    revalidatePath("/dashboard/add-listing/", "page");

    return { data: data[0], status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "adding vehicle (server)");
  }
};

type UpdateVehicleProps = {
  vehicleId: string;
  formData: EditVehicleFormType;
};

export const updateVehicle = async ({
  vehicleId,
  formData,
}: UpdateVehicleProps) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // Validate form data
    const parsedData = editVehicleValidationSchema.parse(formData);

    // Create vehicle data object
    const addVehicleData: EditVehicleDataType = {
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
      is_active: parsedData.isActive === "true" ? true : false,
    };

    const { data, error } = await supabase
      .from("vehicles")
      .update(addVehicleData)
      .eq("id", vehicleId)
      .select();

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }
    revalidatePath("/dashboard/listings/", "page");
    return { data: data[0], status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "updating vehicle (server)");
  }
};

export const deleteVehicle = async (vehicleId: string) => {
  // Initialize Supabase client
  const supabase = await createClient();

  try {
    // 1. Get all image paths for the vehicle from the vehicle_images table
    const { data: imagesData, error: imagesError } = await supabase
      .from("vehicle_images")
      .select("image_path")
      .eq("vehicle_id", vehicleId);

    if (imagesError) {
      // Return error if unable to fetch image paths
      return { data: null, status: StatusCode.BAD_REQUEST, error: imagesError };
    }

    // Extract image paths into an array
    const imagePaths = imagesData.map((image) => image.image_path);

    // 2. Get the spec sheet path for the vehicle
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .select("spec_sheet_path")
      .eq("id", vehicleId)
      .single();

    if (vehicleError) {
      // Return error if unable to fetch vehicle data
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: vehicleError,
      };
    }

    const specSheetPath = vehicleData?.spec_sheet_path;

    // 3. Delete vehicle images from storage bucket
    if (imagePaths.length > 0) {
      const { error: deleteImagesStorageError } = await supabase.storage
        .from("vehicle-images")
        .remove(imagePaths);

      if (deleteImagesStorageError) {
        // Return error if unable to delete images from storage
        return {
          data: null,
          status: StatusCode.BAD_REQUEST,
          error: deleteImagesStorageError,
        };
      }
    }

    // 4. Delete spec sheet file from storage bucket if it exists
    if (specSheetPath) {
      const { error: deleteSpecSheetStorageError } = await supabase.storage
        .from("spec-sheets")
        .remove([specSheetPath]);

      if (deleteSpecSheetStorageError) {
        // Return error if unable to delete spec sheet from storage
        return {
          data: null,
          status: StatusCode.BAD_REQUEST,
          error: deleteSpecSheetStorageError,
        };
      }
    }

    // 5. Delete vehicle images records from vehicle_images table
    const { error: deleteImagesError } = await supabase
      .from("vehicle_images")
      .delete()
      .eq("vehicle_id", vehicleId);

    if (deleteImagesError) {
      // Return error if unable to delete image records
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: deleteImagesError,
      };
    }

    // 6. Delete the vehicle record itself
    const { error: deleteVehicleError } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", vehicleId);

    if (deleteVehicleError) {
      // Return error if unable to delete the vehicle
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: deleteVehicleError,
      };
    }

    // 7. Revalidate the path to update the UI
    revalidatePath("/dashboard/listings/", "page");

    // Return success response
    return { data: null, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "deleting vehicle (server)");
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

  console.info("Saving image paths to database...");
  try {
    const addVehicleImagesData = () =>
      imagePaths.map((url) => {
        return {
          vehicle_id: vehicleId,
          image_path: url,
        } satisfies AddVehicleImageDataType;
      });

    const { error: addVehicleImagesError } = await supabase
      .from("vehicle_images")
      .insert(addVehicleImagesData());

    if (addVehicleImagesError) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: addVehicleImagesError,
      };
    }

    revalidatePath("/dashboard/listings/", "page");

    return { data: null, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "adding vehicle image paths (server)");
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
        error: "spec sheet file path is required",
      };
    }

    const { error: updateVehicleSpecSheetError } = await supabase
      .from("vehicles")
      .update({ spec_sheet_path: specSheetFilePath })
      .eq("id", vehicleId);

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
      "updating vehicle with spec sheet (server)"
    );
  }
};

export const getAllVehiclesByOwnerId = async (ownerId: string) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch vehicle by owner id
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("owner_id", ownerId);

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // fetch vehicle images by vehicle id
    const vehiclesWithImages = await Promise.all(
      data.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicle.id);

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
    return handleServerError(error, "getting vehicles (server)");
  }
};

export const getAllVehicles = async () => {
  // Init supabase client
  const supabase = await createClient();
  try {
    // fetch all vehicles by user category

    const { data, error } = await supabase.from("vehicles").select("*");

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    const vehicleWithImages = await Promise.all(
      data.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicle.id);

        if (imagesError) {
          throw imagesError;
        }

        return { ...vehicle, images };
      })
    );
    return { data: vehicleWithImages, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(
      error,
      "getting vehicles by user category (server)"
    );
  }
};

export const getAllVehiclesByVehicleCategory = async (
  vehicleCategory: VehicleCategoryType[number],
  listingCategory: ListingCategoryType[number]
) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch all vehicles by vehicle category
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("vehicle_category", vehicleCategory)
      .eq("listing_category", listingCategory);

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    const vehicleWithImages = await Promise.all(
      data.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicle.id);

        if (imagesError) {
          throw imagesError;
        }

        return { ...vehicle, images };
      })
    );

    const shuffledVehicleWithImages = shuffleArray(vehicleWithImages);

    return {
      data: shuffledVehicleWithImages,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(
      error,
      "getting vehicles by vehicle category (server)"
    );
  }
};

export const getVehicleById = async (vehicleId: string) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch vehicle by id
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicleId)
      .eq("is_active", true)
      .single();

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // fetch vehicle images by vehicle id
    const { data: images, error: imagesError } = await supabase
      .from("vehicle_images")
      .select("*")
      .eq("vehicle_id", vehicleId);

    if (imagesError) {
      throw imagesError;
    }

    return {
      data: { ...data, images },
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "getting vehicle (server)");
  }
};

export const getAllCarsByListingCategory = async (
  category: ListingCategoryType[number],
  isLandingPage: boolean = false
) => {
  // Init supabase client
  const supabase = await createClient();
  try {
    // fetch all cars
    let response = null;

    if (isLandingPage) {
      response = await supabase
        .from("vehicles")
        .select("*")
        .eq("is_active", true)
        .eq("vehicle_category", "car")
        .eq("listing_category", category)
        .range(0, 99);
    } else {
      response = await supabase
        .from("vehicles")
        .select("*")
        .eq("vehicle_category", "car")
        .eq("listing_category", category);
    }

    const { data, error } = response;

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    // Shuffle and limit the data to 12 items
    const shuffledData = isLandingPage
      ? shuffleArray(data).slice(0, 12)
      : shuffleArray(data);

    // fetch vehicle images by vehicle id
    const vehicleWithImages = await Promise.all(
      shuffledData.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicle.id);

        if (imagesError) {
          throw imagesError;
        }

        return { ...vehicle, images };
      })
    );

    return { data: vehicleWithImages, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "getting cars (server)");
  }
};

type AllListingsByCategoryType = {
  listingCategory: ListingCategoryType[number];
  vehicleCategory: VehicleCategoryType[number];
};

export const getAllVehicleListingsByCategory = async ({
  listingCategory,
  vehicleCategory,
}: AllListingsByCategoryType) => {
  // Init supabase client
  const supabase = await createClient();
  try {
    // fetch all vehicles by listing category and subscription
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("listing_category", listingCategory)
      .eq("vehicle_category", vehicleCategory)
      .neq("is_active", false);

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }
    // fetch vehicle images by vehicle id
    const vehicleWithImages = await Promise.all(
      data.map(async (vehicle) => {
        const { data: images, error: imagesError } = await supabase
          .from("vehicle_images")
          .select("*")
          .eq("vehicle_id", vehicle.id);

        if (imagesError) {
          throw imagesError;
        }

        return { ...vehicle, images };
      })
    );

    return { data: vehicleWithImages, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(
      error,
      "getting subscription feature listings by category (server)"
    );
  }
};

export const getAllDealers = async () => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch all dealers
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .neq("admin", true)
      .not("profile_logo_path", "is", null)
      .order("dealership_name", { ascending: true });

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    return { data, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "getting dealers (server)");
  }
};

export const getAllFeaturedDealersAndVehiclesWithImages = async (
  vehicleCategory: VehicleCategoryType[number],
  listingCategory: ListingCategoryType[number]
) => {
  // Init supabase client
  const supabase = await createClient();
  try {
    // fetch all featured dealers
    const { data: dealers, error: dealersError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_category", "dealership")
      .in("subscription", SUBSCRIPTION_FEATURE_TYPES)
      .neq("admin", true)
      .not("profile_logo_path", "is", null);

    if (dealersError) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: dealersError,
      };
    }

    // For each dealer, fetch up to 3 vehicles and their images
    const vehiclesWithDealer: VehicleWithImageAndDealer[] = (
      await Promise.all(
        dealers.map(async (dealer) => {
          // Fetch up to 3 active cars for sale for this dealer
          const { data: vehicles, error: vehiclesError } = await supabase
            .from("vehicles")
            .select("*")
            .eq("owner_id", dealer.id)
            .eq("is_active", true)
            .eq("listing_category", listingCategory)
            .eq("vehicle_category", vehicleCategory)
            .limit(3);

          if (vehiclesError) {
            throw vehiclesError;
          }

          // For each vehicle, fetch its images and attach dealer info
          const vehiclesWithImagesAndDealer: VehicleWithImageAndDealer[] =
            await Promise.all(
              vehicles.map(async (vehicle) => {
                // Fetch images for this vehicle
                const { data: images, error: imagesError } = await supabase
                  .from("vehicle_images")
                  .select("*")
                  .eq("vehicle_id", vehicle.id);

                if (imagesError) {
                  throw imagesError;
                }

                // Return the vehicle with images and dealer info
                return {
                  ...vehicle,
                  images,
                  dealer: {
                    id: dealer.id,
                    dealership_name: dealer.dealership_name,
                    profile_logo_path: dealer.profile_logo_path,
                    subscription: dealer.subscription,
                  },
                };
              })
            );

          return vehiclesWithImagesAndDealer;
        })
      )
    ).flat(); // Flatten the array so all vehicles are in a single array

    // Shuffle the dealers to randomize the order
    const shuffledDealers = shuffleArray(vehiclesWithDealer);
    // Limit to 6 featured dealers
    const featuredDealers = shuffledDealers.slice(0, 6);
    return {
      data: featuredDealers,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(
      error,
      "getting featured dealers and vehicles with images (server)"
    );
  }
};

export const getAllProfilesByUserCategory = async (
  userCategory: CategoryType[number],
  isAdmin: boolean = false
) => {
  // Init supabase client
  const supabase = await createClient();

  let response;

  try {
    if (isAdmin) {
      // fetch all profiles by user category for admin
      response = supabase
        .from("profiles")
        .select("*")
        .eq("user_category", userCategory)
        .order("dealership_name", { ascending: true });
    } else {
      // fetch all profiles by user category for non-admin
      response = supabase
        .from("profiles")
        .select("*")
        .eq("user_category", userCategory)
        .neq("admin", true)
        .order("dealership_name", { ascending: true });
    }

    const { data, error } = await response;

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    return { data, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(
      error,
      "getting profiles by user category (server)"
    );
  }
};

export const getProfileById = async (profileId: string) => {
  // Init supabase client
  const supabase = await createClient();

  try {
    // fetch profile by id
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .neq("admin", true)
      .single();

    if (error) {
      return { data: null, status: StatusCode.BAD_REQUEST, error };
    }

    return { data, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "getting profile (server)");
  }
};
