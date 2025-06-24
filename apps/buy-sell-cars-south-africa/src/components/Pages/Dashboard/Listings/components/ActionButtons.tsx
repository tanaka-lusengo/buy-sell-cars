import { BeatLoader } from "react-spinners";
import { Button } from "~bsc-shared/ui";
import { tokens } from "@/src/styles";
import { Flex } from "@/styled-system/jsx";

type ActionButtonsProps = {
  vehicleId: string;
  editingId: string | null;
  isSubmitting: boolean;
  handleDeleteClick: (id: string) => void;
  handleStartEdit: (id: string) => void;
  handleCancelEdit: () => void;
};

export const ActionButtons = ({
  vehicleId,
  editingId,
  isSubmitting,
  handleDeleteClick,
  handleStartEdit,
  handleCancelEdit,
}: ActionButtonsProps) => {
  return (
    <Flex gap="sm" alignItems="flex-start">
      {editingId && editingId === vehicleId ? (
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
            onClick={() => handleDeleteClick(vehicleId)}
            size="sm"
          >
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => handleStartEdit(vehicleId)}
            size="sm"
          >
            Edit
          </Button>
        </>
      )}
    </Flex>
  );
};
