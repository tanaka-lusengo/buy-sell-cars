"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FileInputField,
  InputField,
  TextareaField,
} from "~bsc-shared/components";
import { SelectField } from "~bsc-shared/components";
import {
  CAR_CONDITIONS,
  FUEL_TYPES,
  GEARBOX_TYPES,
  LISTING_TYPES,
  VEHICLE_CATEGORIES,
} from "~bsc-shared/constants";
import { Button, Typography } from "~bsc-shared/ui";
import {
  handleClientError,
  toastNotifySuccess,
  generateYears,
  toSnakeCase,
  StatusCode,
} from "~bsc-shared/utils";
import { LOCATIONS } from "@/src/constants/values";
import { useFileUploadHelpers } from "@/src/hooks";
import {
  addVehicleValidationSchema,
  addVehicleFormDefaultValues,
} from "@/src/schemas";
import {
  addVehicle,
  updateVehicleWithSpecSheet,
  addVehicleImagePaths,
} from "@/src/server/actions/general";
import { AddVehicleFormType, Profile } from "@/src/types";
import { Divider, Flex, Grid } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { SuspenseLoader } from "../../shared";
import { Form } from "./common.styled";
import { getLabelText } from "./utils/getLabelText";

export const AddListing = ({ profile }: { profile: Profile }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddVehicleFormType>({
    resolver: zodResolver(addVehicleValidationSchema),
    mode: "all",
    defaultValues: addVehicleFormDefaultValues,
  });

  const supabase = createClient();
  const router = useRouter();
  const { compressAndUploadFile } = useFileUploadHelpers(supabase);

  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [vehicleImageFiles, setVehicleImageFiles] = useState<FileList | null>(
    null
  );
  const [specSheetFile, setSpecSheetFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const listingCategory = watch("listingCategory");
  const vehicleCategory = watch("vehicleCategory");

  const isRental = useMemo(
    () => listingCategory === "rental",
    [listingCategory]
  );
  const isUsedCar = useMemo(
    () => vehicleCategory === "used_car",
    [vehicleCategory]
  );
  const isNewCar = useMemo(
    () => vehicleCategory === "new_car",
    [vehicleCategory]
  );

  // Cleanup previews to avoid memory leaks
  useEffect(() => {
    return () => {
      imagesPreview.forEach(URL.revokeObjectURL);
    };
  }, [imagesPreview]);

  // Generate previews when file input changes
  const handleImagePreview = (files: FileList | null) => {
    if (!files) return;
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setImagesPreview(previews);
  };

  const YEARS = useMemo(() => generateYears(), []);

  // Generate labels dynamically
  const imgLabel = getLabelText(
    vehicleImageFiles,
    isSubmitting,
    <>
      Upload Images <br /> (max 10 files)
    </>,
    <>
      Update Images <br /> (max 10 files)
    </>
  );

  const specSheetLabel = getLabelText(
    specSheetFile,
    isSubmitting,
    <>
      Upload Spec Sheet (Optional) <br /> (max 1 file)
    </>,
    <>
      Update Spec Sheet (Optional) <br /> (max 1 file)
    </>
  );

  const uploadListing = async (formData: AddVehicleFormType) => {
    if (!profile) return;

    try {
      setLoading(true);

      // Check if vehicle images are selected
      if (!vehicleImageFiles || vehicleImageFiles.length > 10) {
        handleClientError(
          "uploading your listing",
          "Please upload 1-10 images."
        );
        return;
      }

      // 1. Add vehicle data to the database
      const {
        data: uploadedVehicle,
        status,
        error,
      } = await addVehicle({
        profile,
        formData,
      });

      if (status !== StatusCode.SUCCESS || !uploadedVehicle) {
        handleClientError("uploading your vehicle listing", error);
        return;
      }

      // 2. Compress and upload image files to storage bucket
      const compressedVehicleImageFilePaths = await Promise.all(
        Array.from(vehicleImageFiles).map(async (vehicleImageFile) => {
          try {
            return await compressAndUploadFile({
              file: vehicleImageFile,
              id: uploadedVehicle.id,
              bucket: "vehicle-images",
              fileNamePrefix: "vehicle-image",
            });
          } catch (error) {
            handleClientError(
              "compressing and uploading image files to bucket",
              error
            );
            return null;
          }
        })
      );

      // Filter out null values before setting the state
      const validCompressedVehicleImageFilePaths =
        compressedVehicleImageFilePaths.filter(
          (path): path is string => path !== null
        );

      // 3. Upload the vehicle image paths to the database
      const { error: updateError } = await addVehicleImagePaths({
        vehicleId: uploadedVehicle.id,
        imagePaths: validCompressedVehicleImageFilePaths,
      });

      if (updateError) {
        handleClientError("updating your vehicle images database", updateError);
        return;
      }

      // 4. Check if spec sheet is selected, if so, compress it and upload
      let compressedSpecSheetFilePath: string | null = null;

      if (specSheetFile) {
        compressedSpecSheetFilePath = await compressAndUploadFile({
          file: specSheetFile,
          id: uploadedVehicle.id,
          bucket: "spec-sheets",
          fileNamePrefix: "spec-sheet",
        });

        const { error: updateError } = await updateVehicleWithSpecSheet({
          vehicleId: uploadedVehicle.id,
          specSheetFilePath: compressedSpecSheetFilePath,
        });

        if (updateError) {
          handleClientError("updating your vehicle spec sheet", updateError);
          return;
        }
      }

      toastNotifySuccess("Listing uploaded successfully");
      router.push("/dashboard/listings");
    } catch (error) {
      handleClientError("Uploading your listing", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If loading is true, show the loader
    if (loading) {
      setShowLoader(true);
      // Scroll to top when loading starts
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowLoader(false);
    }
  }, [loading]);

  if (showLoader) {
    return <SuspenseLoader label="Uploading listing..." />;
  }

  const { profile_logo_path, address, description } = profile;

  const restrictAccess = !profile_logo_path || !address || !description;

  return (
    <Form
      onSubmit={handleSubmit(
        async (formData: AddVehicleFormType) => await uploadListing(formData)
      )}
    >
      <Typography variant="h2">List your vehicle details</Typography>

      {restrictAccess ? (
        <Flex
          direction="column"
          gap="md"
          width="100%"
          marginY="md"
          marginX="auto"
        >
          <Typography variant="h3" color="error" align="center">
            <b>Note:</b> You must have a{" "}
            <b>profile logo, address and description</b> to list your vehicle.
          </Typography>

          <Typography align="center" variant="h4">
            Please update your profile in the{" "}
            <Typography
              as="span"
              color="primaryDark"
              style={{ fontSize: "inherit" }}
            >
              <Link
                style={{
                  fontSize: "inherit",
                }}
                href="/dashboard"
              >
                Profile
              </Link>
            </Typography>{" "}
            section.
          </Typography>
        </Flex>
      ) : (
        <>
          <Typography variant="h5">Select your type of listing:</Typography>

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <SelectField
              label="Listing type"
              name="listingCategory"
              register={register}
              errors={errors}
            >
              <option key="listingCategory" value={""}>
                Type of listing
              </option>
              {LISTING_TYPES.map((type) => (
                <option key={type} value={toSnakeCase(type)}>
                  {type}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Vehicle category"
              name="vehicleCategory"
              register={register}
              errors={errors}
            >
              <option key="vehicleCategory" value={""}>
                Vehicle category
              </option>
              {VEHICLE_CATEGORIES.map((type) => (
                <option key={type} value={toSnakeCase(type)}>
                  {type}
                </option>
              ))}
            </SelectField>
          </Grid>

          <Divider marginY="md" color="grey" />

          <Grid gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }} gap="sm">
            <InputField
              name="make"
              placeholder="Make e.g Honda"
              register={register}
              errors={errors}
            />

            <InputField
              name="model"
              placeholder="Model e.g Fit"
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <SelectField name="location" register={register} errors={errors}>
              <option key="location" value={""}>
                Location
              </option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </SelectField>

            <InputField
              name="price"
              type="number"
              decimalNumbers
              placeholder={`Price ($) ${isRental ? "(Per day)" : "(Total)"}`}
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <SelectField name="year" register={register} errors={errors}>
              <option key="year" value={""} color="grey">
                Manufactured year
              </option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </SelectField>

            <SelectField name="condition" register={register} errors={errors}>
              <option key="condition" value={""}>
                Condition
              </option>
              {isUsedCar && (
                <option
                  key={CAR_CONDITIONS[1]}
                  value={toSnakeCase(CAR_CONDITIONS[1])}
                >
                  {CAR_CONDITIONS[1]}
                </option>
              )}
              {isNewCar && (
                <option
                  key={CAR_CONDITIONS[0]}
                  value={toSnakeCase(CAR_CONDITIONS[0])}
                >
                  {CAR_CONDITIONS[0]}
                </option>
              )}
              {!isUsedCar &&
                !isNewCar &&
                CAR_CONDITIONS.map((condition) => {
                  return (
                    <option key={condition} value={toSnakeCase(condition)}>
                      {condition}
                    </option>
                  );
                })}
            </SelectField>
          </Grid>

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <SelectField name="gearBox" register={register} errors={errors}>
              <option key="gearBox" value={""}>
                Gearbox
              </option>
              {GEARBOX_TYPES.map((type) => (
                <option key={type} value={toSnakeCase(type)}>
                  {type}
                </option>
              ))}
            </SelectField>

            <SelectField name="fuelType" register={register} errors={errors}>
              <option key="fuel-type" value={""}>
                Fuel Type
              </option>
              {FUEL_TYPES.map((type) => (
                <option key={type} value={toSnakeCase(type)}>
                  {type}
                </option>
              ))}
            </SelectField>
          </Grid>

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <InputField
              name="mileage"
              type="number"
              placeholder="Mileage (km)"
              register={register}
              errors={errors}
            />

            <InputField
              name="doors"
              type="number"
              placeholder="No. of doors"
              register={register}
              errors={errors}
            />
          </Grid>

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <InputField
              name="seats"
              type="number"
              placeholder="No. of seats"
              register={register}
              errors={errors}
            />
          </Grid>

          <TextareaField
            label="Vehicle Description"
            name="description"
            maxLength={500}
            placeholder="Write a brief description about your vehicle..."
            register={register}
            errors={errors}
          />

          <Grid
            gridTemplateColumns={{ base: "auto", sm: "1fr 1fr" }}
            gap="sm"
            width="100%"
          >
            <FileInputField
              accept="image/*"
              multiple
              label={imgLabel}
              name="vehicleImages"
              disabled={isSubmitting}
              register={{
                ...register("vehicleImages"),
                onChange: async (e) => {
                  setVehicleImageFiles(e.target.files || null);
                  handleImagePreview(e.target.files);
                },
              }}
              errors={errors}
            />

            <FileInputField
              accept="image/*,application/pdf"
              label={specSheetLabel}
              name="specSheetPath"
              disabled={isSubmitting}
              register={{
                ...register("specSheetPath"),
                onChange: async (e) => {
                  setSpecSheetFile(e.target.files?.[0] || null);
                },
              }}
              errors={errors}
            />
          </Grid>

          {imagesPreview.length > 0 && (
            <>
              <Divider marginY="sm" color="primary" />

              <Typography variant="h5">Image preview:</Typography>

              <Flex gap="xxs" flexWrap="wrap" justifyContent="center">
                {imagesPreview.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
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
                ))}
              </Flex>
            </>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload new vehicle"}
          </Button>
        </>
      )}
    </Form>
  );
};
