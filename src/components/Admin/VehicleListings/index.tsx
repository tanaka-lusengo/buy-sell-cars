"use client";

import { useEffect, useState } from "react";
import { Grid, Box, Flex } from "@/styled-system/jsx";
import { useRouter } from "next/navigation";
import { ResponsiveContainer, Typography } from "@/src/components/ui";
import { ListingsForm } from "../../Pages/Dashboard/common.styled";
import { type VehicleWithImage } from "@/src/types";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
  toastNotifyInfo,
} from "@/src/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/supabase/client";
import { useFileUploadHelpers } from "@/src/hooks";
import { useForm } from "react-hook-form";
import { editVehicleValidationSchema } from "@/src/schemas";
import { EditVehicleFormType } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateVehicle,
  deleteVehicle,
  addVehicleImagePaths,
} from "@/src/server/actions/general";
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

type VehicleListingsProps = {
  vehicles: VehicleWithImage[];
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const VehicleListings = ({
  vehicles,
  error,
  status,
}: VehicleListingsProps) => {
  const supabase = createClient();
  const { getPublicUrl, deleteOldFiles, compressAndUploadFile } =
    useFileUploadHelpers(supabase);
  const { refresh } = useRouter();

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

  return (
    <Box padding="lg">
      <Flex direction="column" gap="sm" paddingBottom="lg">
        <Typography as="h1" variant="h2">
          Vehicle Listings
        </Typography>

        <Typography>
          Manage your customer&#39;s vehicle listings. You can edit, delete, and
          view details of each listing from here.
        </Typography>
      </Flex>

      {status !== StatusCode.SUCCESS && error && (
        <ResponsiveContainer>
          <Flex direction="column" paddingY="md" gap="sm">
            <Typography as="h2" variant="h3" color="error">
              Error fetching vehicles
            </Typography>

            <Typography color="error">Please try again a later time</Typography>

            {error === typeof "string" && (
              <Typography color="error">{error}</Typography>
            )}
          </Flex>
        </ResponsiveContainer>
      )}

      {status === StatusCode.SUCCESS && vehicles.length === 0 && (
        <ResponsiveContainer>
          <Box paddingY="lg">
            <Typography variant="h3" align="center" color="primaryDark">
              There are no vehicle listings available.
            </Typography>
          </Box>
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
