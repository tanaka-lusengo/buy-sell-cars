import Image from "next/image";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FileInputField } from "~bsc-shared/components";
import { Typography } from "~bsc-shared/ui";
import {
  formatDate,
  formatMileage,
  formatToReadableString,
} from "~bsc-shared/utils";
import {
  EditVehicleFormType,
  StorageBucket,
  VehicleWithImage,
} from "@/src/types";
import { formatPriceToDollars } from "@/src/utils";
import { Flex, Divider, Box, Grid } from "@/styled-system/jsx";
import { ActionButtons } from "./ActionButtons";
import { EditableInput } from "./EditableInput";

type VehicleRowProps = {
  imagesPreview: string[];
  vehicleId: string;
  vehicle: VehicleWithImage;
  editingId: string | null;
  isSubmitting: boolean;
  handleDeleteClick: (id: string) => void;
  handleStartEdit: (id: string) => void;
  handleCancelEdit: () => void;
  handleImagePreview: (files: FileList | null) => void;
  setVehicleImageFiles: (files: FileList | null) => void;
  register: UseFormRegister<EditVehicleFormType>;
  errors: FieldErrors<EditVehicleFormType>;
  getPublicUrl: (bucket: StorageBucket, path: string) => string;
};

export const VehicleRow = ({
  imagesPreview,
  vehicleId,
  vehicle,
  editingId,
  isSubmitting,
  handleDeleteClick,
  handleStartEdit,
  handleCancelEdit,
  handleImagePreview,
  setVehicleImageFiles,
  register,
  errors,
  getPublicUrl,
}: VehicleRowProps) => {
  return (
    <Box>
      {editingId === vehicleId && imagesPreview.length > 0 && (
        <>
          <Flex direction="column" gap="sm" marginY="md" paddingX="lg">
            <Typography weight="bold">Preview:</Typography>

            <Flex gap="xxs" flexWrap="wrap">
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
          </Flex>
        </>
      )}

      <Grid
        gridTemplateColumns="repeat(2, 1.5fr) repeat(14, 1fr) 2fr repeat(2, 1fr)"
        alignItems="center"
        gap="sm"
        paddingX="md"
        paddingY="sm"
        marginY="sm"
        border="1px solid"
        borderColor="transparent"
        borderRadius="1rem"
        transition="0.2s ease-in-out"
        _hover={{
          backgroundColor: "greyLight",
        }}
      >
        <ActionButtons
          key={`actions-${vehicleId}`}
          vehicleId={vehicleId}
          editingId={editingId}
          isSubmitting={isSubmitting}
          handleDeleteClick={handleDeleteClick}
          handleStartEdit={handleStartEdit}
          handleCancelEdit={handleCancelEdit}
        />
        {editingId === vehicleId ? (
          <Box>
            <FileInputField
              accept="image/*"
              multiple
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
          </Box>
        ) : (
          <Box>
            {vehicle.images?.[0]?.image_path && (
              <Flex gap="sm" key={`actions-${vehicle.id}`} alignItems="center">
                <Image
                  key={`image-${vehicle.id}`}
                  src={getPublicUrl(
                    "vehicle-images",
                    vehicle.images[0]?.image_path || ""
                  )}
                  alt={`${vehicle.make} vehicle image`}
                  width={50}
                  height={50}
                  style={{
                    borderRadius: "4px",
                    objectFit: "cover",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "5rem",
                    height: "5rem",
                  }}
                  quality={70}
                />
                {vehicle.images.length > 1 && (
                  <Typography as="span" weight="bold">
                    Total: {vehicle.images.length}
                  </Typography>
                )}
              </Flex>
            )}
          </Box>
        )}
        {[
          "isActive",
          "vehicleCategory",
          "listingCategory",
          "make",
          "model",
          "year",
          "price",
          "mileage",
          "condition",
          "fuelType",
          "gearBox",
          "doors",
          "seats",
          "location",
          "description",
        ].map((field) => {
          let newFieldName;

          if (field === "isActive") {
            newFieldName = "is_active";
          } else if (field === "vehicleCategory") {
            newFieldName = "vehicle_category";
          } else if (field === "listingCategory") {
            newFieldName = "listing_category";
          } else if (field === "fuelType") {
            newFieldName = "fuel";
          } else if (field === "gearBox") {
            newFieldName = "gear_box";
          } else {
            newFieldName = field;
          }

          const value = vehicle[newFieldName as keyof VehicleWithImage];

          if (editingId === vehicleId) {
            return (
              <EditableInput
                key={`${vehicleId}-${field}`}
                name={field}
                value={String(value)}
                register={register}
                errors={errors}
              />
            );
          } else {
            let displayValue: string;

            if (field === "price") {
              displayValue = formatPriceToDollars(value as number);
            } else if (field === "mileage") {
              displayValue = formatMileage(value as number);
            } else {
              displayValue = formatToReadableString(value as string);
            }
            return (
              <Box
                key={`${vehicleId}-${field}`}
                color={
                  field === "isActive"
                    ? value
                      ? "success"
                      : "error"
                    : undefined
                }
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {displayValue}
              </Box>
            );
          }
        })}

        <Box>
          <Typography>{formatDate(vehicle.created_at || "")}</Typography>
        </Box>
        <Box>
          <Typography>{formatDate(vehicle.updated_at || "")}</Typography>
        </Box>
      </Grid>

      <Divider
        orientation="horizontal"
        marginY="sm"
        color="grey"
        key={`divider-${vehicleId}`}
      />
    </Box>
  );
};
