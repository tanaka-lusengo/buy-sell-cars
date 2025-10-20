"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Button,
  H2,
  H3,
  H4,
  P,
  ResponsiveContainer,
  Span,
} from "~bsc-shared/ui";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
  toastNotifyInfo,
  formatToReadableString,
} from "~bsc-shared/utils";
import { SubscriptionTypeNames } from "@/src/constants/subscription";
import { useFileUploadHelpers } from "@/src/hooks";
import { editVehicleValidationSchema } from "@/src/schemas";
import {
  updateVehicle,
  deleteVehicle,
  addVehicleImagePaths,
} from "@/src/server/actions/general";
import { Profile, type VehicleWithImage } from "@/src/types";
import { EditVehicleFormType } from "@/src/types";
import { Grid, Box, Flex } from "@/styled-system/jsx";
import { createClient } from "@/supabase/client";
import { ListingsForm } from "../common.styled";
import { VehicleRow } from "./components";

const TABLE_HEADERS = [
  "Actions",
  "Images",
  "Active",
  "Category",
  "Type",
  "Make",
  "Model",
  "Year",
  "Price",
  "Mileage (km)",
  "Condition",
  "Fuel Type",
  "Gearbox",
  "Doors",
  "Seats",
  "Location",
  "description",
  "Listed On",
  "Updated On",
];

type ListingsProps = {
  profile: Profile;
  profileSubscription: string | null | undefined;
  vehicles: VehicleWithImage[];
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const Listings = ({
  profile,
  profileSubscription,
  vehicles,
  error,
  status,
}: ListingsProps) => {
  const supabase = createClient();
  const { getPublicUrl, deleteOldFiles, compressAndUploadFile } =
    useFileUploadHelpers(supabase);
  const { push, refresh } = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<EditVehicleFormType>({
    resolver: zodResolver(editVehicleValidationSchema),
    mode: "all",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentVehicleImages, setCurrentVehicleImages] = useState<
    VehicleWithImage["images"]
  >([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [vehicleImageFiles, setVehicleImageFiles] = useState<FileList | null>(
    null
  );

  useEffect(() => {
    return () => imagesPreview.forEach(URL.revokeObjectURL);
  }, [imagesPreview]);

  const handleImagePreview = (files: FileList | null) => {
    if (!files) return;
    setImagesPreview(
      Array.from(files).map((file) => URL.createObjectURL(file))
    );
  };

  const handleStartEdit = (id: string) => {
    setEditingId(id);
    setCurrentVehicleImages(vehicles.find((v) => v.id === id)?.images || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setImagesPreview([]);
  };

  const handleDeleteClick = async (vehicleId: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    const { error, status } = await deleteVehicle(vehicleId);
    if (status !== StatusCode.SUCCESS || error)
      return handleClientError("deleting your vehicle listing", error);
    toastNotifySuccess("Vehicle deleted successfully!");
  };

  const handleSave = async (formData: EditVehicleFormType) => {
    if (!editingId) return console.error("No vehicle ID provided for editing");

    try {
      const {
        data: updatedVehicle,
        error,
        status,
      } = await updateVehicle({ vehicleId: editingId, formData });

      if (status !== StatusCode.SUCCESS || !updatedVehicle) {
        handleClientError("updating your vehicle listing", error);
        return setEditingId(null);
      }

      toastNotifySuccess(
        `${updatedVehicle.make} ${updatedVehicle.model} updated details successfully!`
      );

      if (vehicleImageFiles && vehicleImageFiles.length > 0) {
        if (vehicleImageFiles.length > 10) {
          return handleClientError(
            "uploading your listing",
            "Please upload 1-10 images."
          );
        }

        toastNotifyInfo(
          "Uploading new vehicle images. This may take a few seconds..."
        );

        const filePaths = await Promise.all(
          Array.from(vehicleImageFiles).map(async (file) => {
            try {
              return await compressAndUploadFile({
                file,
                id: updatedVehicle.id,
                bucket: "vehicle-images",
                fileNamePrefix: "vehicle-image",
              });
            } catch (err) {
              handleClientError("uploading image files", err);
              return null;
            }
          })
        );

        const validPaths = filePaths.filter(
          (path): path is string => path !== null
        );

        const { error: dbError } = await addVehicleImagePaths({
          vehicleId: updatedVehicle.id,
          imagePaths: validPaths,
        });

        if (dbError)
          return handleClientError(
            "updating your vehicle images database",
            dbError
          );

        try {
          await deleteOldFiles(
            "vehicle-images",
            currentVehicleImages
              .map((i) => i.image_path)
              .filter(Boolean) as string[]
          );
        } catch (err) {
          return handleClientError("deleting old vehicle images", err);
        }

        setVehicleImageFiles(null);
        setCurrentVehicleImages([]);
        toastNotifySuccess("Vehicle images updated successfully!");
      }

      setEditingId(null);
      refresh();
    } catch (error) {
      handleClientError("saving your vehicle listing", error);
      setEditingId(null);
    }
  };

  // 2. Determine max allowed vehicles based on user category and subscription
  let maxVehicles = 0;

  if (profile?.user_category === "dealership") {
    if (profileSubscription === SubscriptionTypeNames.CommunityAccess) {
      maxVehicles = 20;
    } else if (
      profileSubscription === SubscriptionTypeNames.GrowthAccelerator
    ) {
      maxVehicles = 75;
    } else if (
      profileSubscription === SubscriptionTypeNames.DealershipDominator
    ) {
      maxVehicles = 100;
    }
  } else if (profile?.user_category === "individual") {
    maxVehicles = 2;
  }

  return (
    <Box padding="lg">
      <H2>Your Listings: {vehicles.length}</H2>

      <P>
        Manage your vehicle listings, edit details, and update your images.{" "}
        <br /> On your current plan:{" "}
        <b>
          {profile?.user_category === "dealership"
            ? formatToReadableString(profileSubscription || "")
            : "Individual"}
        </b>
        , you can have up to <b>{maxVehicles}</b> active listings.
      </P>

      <Button onClick={() => push("/dashboard/add-listing")} marginY="md">
        <Span weight="bold" color="white">
          + Add New Listing
        </Span>
      </Button>

      {status !== StatusCode.SUCCESS && error && (
        <ResponsiveContainer>
          <Flex direction="column" paddingY="md" gap="sm">
            <H3 color="error">Error fetching vehicles</H3>

            <P color="error">Please try again a later time</P>

            {error === typeof "string" && <P color="error">{error}</P>}
          </Flex>
        </ResponsiveContainer>
      )}

      {status === StatusCode.SUCCESS && vehicles.length === 0 && (
        <ResponsiveContainer>
          <Flex direction="column" gap="sm" paddingY="lg">
            <H3 align="center" color="primaryDark">
              It looks like you don&#39;t have any listings.
            </H3>
            <H4 align="center">
              No problem, just click the button above to add your first listing.
            </H4>
          </Flex>
        </ResponsiveContainer>
      )}

      {status === StatusCode.SUCCESS && vehicles.length > 0 && (
        <ListingsForm
          onSubmit={handleSubmit(
            async (formData: EditVehicleFormType) => await handleSave(formData)
          )}
        >
          <table>
            {/* Table Header */}
            <Grid
              gridTemplateColumns="repeat(2, 1.5fr) repeat(14, 1fr) 2fr repeat(2, 1fr)"
              gap="sm"
              paddingX="md"
              paddingY="sm"
              bg="greyLight"
              borderRadius="1rem"
            >
              {TABLE_HEADERS.map((headerItem) => (
                <Box key={headerItem}>{headerItem}</Box>
              ))}
            </Grid>

            {/* Table Body */}
            {vehicles.map((vehicle) => (
              <VehicleRow
                key={vehicle.id}
                imagesPreview={imagesPreview}
                vehicleId={vehicle.id}
                vehicle={vehicle}
                editingId={editingId}
                isSubmitting={isSubmitting}
                handleDeleteClick={handleDeleteClick}
                handleStartEdit={handleStartEdit}
                handleCancelEdit={handleCancelEdit}
                register={register}
                errors={errors}
                getPublicUrl={getPublicUrl}
                setVehicleImageFiles={setVehicleImageFiles}
                handleImagePreview={handleImagePreview}
              />
            ))}
          </table>
        </ListingsForm>
      )}
    </Box>
  );
};
