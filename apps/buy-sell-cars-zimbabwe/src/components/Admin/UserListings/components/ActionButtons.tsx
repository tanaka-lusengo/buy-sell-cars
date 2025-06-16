import { Button } from "@/src/components/ui";
import { tokens } from "@/src/styles";
import { Flex } from "@/styled-system/jsx";
import { BeatLoader } from "react-spinners";

type ActionButtonsProps = {
  profileId: string;
  editingId: string | null;
  isSubmitting: boolean;
  handleDeleteClick: (id: string) => void;
  handleStartEdit: (id: string) => void;
  handleCancelEdit: () => void;
};

export const ActionButtons = ({
  profileId,
  editingId,
  isSubmitting,
  handleDeleteClick,
  handleStartEdit,
  handleCancelEdit,
}: ActionButtonsProps) => {
  return (
    <Flex gap="sm" alignItems="flex-start">
      {editingId && editingId === profileId ? (
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
            onClick={() => handleDeleteClick(profileId)}
            size="sm"
          >
            Delete
          </Button>
          <Button
            type="button"
            onClick={() => handleStartEdit(profileId)}
            size="sm"
          >
            Edit
          </Button>
        </>
      )}
    </Flex>
  );
};
