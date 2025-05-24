"use client";

import { useState } from "react";
import { Grid, Box, Divider, Flex } from "@/styled-system/jsx";
import { useRouter } from "next/navigation";
import { Button, ResponsiveContainer, Typography } from "@/src/components/ui";
import { ListingsForm } from "./common.styled";
import { type VehicleWithImage } from "@/src/types";
import {
  formatMileage,
  formatPriceToDollars,
  formatToReadableString,
  handleClientError,
  StatusCode,
  toastNotifySuccess,
  toSnakeCase,
} from "@/src/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { formatDate } from "@/src/utils";
import { createClient } from "@/supabase/client";
import { useFileUploadHelpers } from "@/src/hooks";
import Image from "next/image";
import { InputField, SelectField, TextareaField } from "../../FormComponents";
import {
  CAR_CONDITIONS,
  FUEL_TYPES,
  GEARBOX_TYPES,
  VEHICLE_CATEGORIES,
  LISTING_TYPES,
  LOCATIONS,
} from "@/src/constants/values";
import { UseFormRegister, FieldErrors, useForm } from "react-hook-form";
import { editVehicleValidationSchema } from "@/src/schemas";
import { EditVehicleFormType } from "@/src/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateVehicle, deleteVehicle } from "@/src/server/actions/general";
import { BeatLoader } from "react-spinners";
import { tokens } from "@/src/styles";

const SELECT_OPTIONS: Record<string, string[]> = {
  isActive: ["true", "false"],
  condition: CAR_CONDITIONS,
  fuelType: FUEL_TYPES,
  gearBox: GEARBOX_TYPES,
  vehicleCategory: VEHICLE_CATEGORIES,
  listingCategory: LISTING_TYPES,
  location: LOCATIONS,
};

const EditableCell = ({
  value,
  name,
  register,
  errors,
}: {
  value: string | number | boolean;
  name: string;
  register: UseFormRegister<EditVehicleFormType>;
  errors: FieldErrors<EditVehicleFormType>;
}) => {
  const numericFields = ["year", "price", "mileage", "doors", "seats"];
  const selectOptions = SELECT_OPTIONS[name];

  if (selectOptions) {
    // Filter out the current value so it doesn't appear twice in the dropdown
    const filteredOptions = selectOptions.filter((option) => {
      // Convert both option and value to string for comparison
      const optionValue = LOCATIONS.includes(option)
        ? option
        : toSnakeCase(option);

      return String(optionValue) !== String(value);
    });

    return (
      <SelectField name={name} register={register} errors={errors}>
        <option key={name} value={String(value)}>
          {formatToReadableString(value as string | number | boolean)}
        </option>
        {filteredOptions.map((option) => (
          <option
            key={option}
            value={LOCATIONS.includes(option) ? option : toSnakeCase(option)}
          >
            {formatToReadableString(option)}
          </option>
        ))}
      </SelectField>
    );
  }

  if (name === "description") {
    return (
      <TextareaField
        name={name}
        maxLength={500}
        defaultValue={String(value)}
        register={register}
        errors={errors}
      />
    );
  }

  return (
    <InputField
      type={numericFields.includes(name) ? "number" : "text"}
      name={name}
      defaultValue={String(value)}
      register={register}
      errors={errors}
    />
  );
};

type ListingsProps = {
  vehicles: VehicleWithImage[];
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const Listings = ({ vehicles, error, status }: ListingsProps) => {
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<EditVehicleFormType>({
    resolver: zodResolver(editVehicleValidationSchema),
    mode: "all",
  });

  const successStatus = status === StatusCode.SUCCESS;

  const { push } = useRouter();

  const supabase = createClient();

  const { getPublicUrl } = useFileUploadHelpers(supabase);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleStartEdit = (id: string) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (formData: EditVehicleFormType) => {
    if (!editingId) {
      console.error("No vehicle ID provided for editing");
      return;
    }

    const { data, error, status } = await updateVehicle({
      vehicleId: editingId,
      formData,
    });

    if (status !== StatusCode.SUCCESS || !data) {
      handleClientError("updating your vehicle listing", error);
      setEditingId(null);
      return;
    }

    toastNotifySuccess(`${data.make} ${data.model} updated successfully!`);
    setEditingId(null);
  };

  const handleDelete = async (vehicleId: string) => {
    const { error, status } = await deleteVehicle(vehicleId);

    if (status !== StatusCode.SUCCESS || error) {
      handleClientError("deleting your vehicle listing", error);
      return;
    }

    toastNotifySuccess("Vehicle deleted successfully!");
  };

  const handleDeleteClick = (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      handleDelete(vehicleId);
    }
  };

  return (
    <>
      <Typography as="h1" variant="h2">
        Your Listings
      </Typography>

      <Button onClick={() => push("/dashboard/add-listing")} marginY="md">
        <Typography as="span" weight="bold" color="white">
          + Add New Listing
        </Typography>
      </Button>

      {!successStatus && Boolean(error) && (
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

      {successStatus && vehicles.length === 0 && (
        <ResponsiveContainer>
          <Flex direction="column" gap="sm" paddingY="lg">
            <Typography variant="h3" align="center" color="primaryDark">
              It looks like you don&#39;t have any listings.
            </Typography>
            <Typography variant="h4" align="center">
              No problem, just click the button above to add your first listing.
            </Typography>
          </Flex>
        </ResponsiveContainer>
      )}

      {successStatus && vehicles.length > 0 && (
        <ListingsForm
          onSubmit={handleSubmit(
            async (formData: EditVehicleFormType) => await handleSave(formData)
          )}
        >
          <table>
            {/* Table Header */}
            <Grid
              gridTemplateColumns="repeat(16, 1fr) 2fr repeat(2, 1fr)"
              gap="sm"
              paddingX="md"
              paddingY="sm"
              bg="greyLight"
              borderRadius="1rem"
            >
              {[
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
              ].map((headerItem) => (
                <Box key={headerItem}>{headerItem}</Box>
              ))}
            </Grid>

            {/* Table Body */}
            {vehicles.map((vehicle) => (
              <Box key={vehicle.id}>
                <Grid
                  gridTemplateColumns="repeat(16, 1fr) 2fr repeat(2, 1fr)"
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
                  <Flex
                    key={`actions-${vehicle.id}`}
                    gap="sm"
                    alignItems="flex-start"
                  >
                    {editingId && editingId === vehicle.id ? (
                      <>
                        <Button
                          type="submit"
                          bg="success"
                          _hover={{
                            opacity: 0.8,
                            bg: "success",
                          }}
                          size="sm"
                          disabled={isSubmitting}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCancelEdit}
                          size="sm"
                          variant="ghost"
                          width="fit-content"
                        >
                          {isSubmitting ? (
                            <BeatLoader
                              size={5}
                              speedMultiplier={1.5}
                              color={tokens.colors.primary.value}
                            />
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          bg="error"
                          _hover={{
                            opacity: 0.8,
                            bg: "error",
                          }}
                          onClick={() => handleDeleteClick(vehicle.id)}
                          size="sm"
                        >
                          Delete
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleStartEdit(vehicle.id)}
                          size="sm"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </Flex>
                  <Box>
                    {vehicle.images?.[0]?.image_path && (
                      <Flex
                        gap="sm"
                        key={`actions-${vehicle.id}`}
                        alignItems="end"
                      >
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
                          }}
                        />
                        {vehicle.images.length > 1 && (
                          <Typography as="span" variant="body2" weight="bold">
                            x{vehicle.images.length}
                          </Typography>
                        )}
                      </Flex>
                    )}
                  </Box>
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

                    const value =
                      vehicle[newFieldName as keyof VehicleWithImage];

                    if (editingId === vehicle.id) {
                      return (
                        <EditableCell
                          key={`${vehicle.id}-${field}`}
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
                          key={`${vehicle.id}-${field}`}
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

                  <Box>{formatDate(vehicle.created_at || "")}</Box>
                  <Box>{formatDate(vehicle.updated_at || "")}</Box>
                </Grid>

                <Divider
                  orientation="horizontal"
                  marginY="sm"
                  color="grey"
                  key={`divider-${vehicle.id}`}
                />
              </Box>
            ))}
          </table>
        </ListingsForm>
      )}
    </>
  );
};
