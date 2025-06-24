import { type ZodError } from "zod";
import { StatusCode } from "./constants";
import { toastNotifyError } from "./reactHotToast";

type ParsedZodError = {
  path: string[];
  message: string;
} & ZodError;

const parseValidationErrorMessages = (error: unknown): string => {
  if (error instanceof Error) {
    try {
      const errorArray = JSON.parse(error.message);
      const errMessages = errorArray.map(
        (error: ParsedZodError) => `${error.path[0]}: ${error.message}`
      );
      return errMessages.join(", ");
    } catch {
      return error.message;
    }
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as { message: string }).message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error";
};

export const logErrorMessage = (error: unknown, errorDetail: string): void => {
  console.error(
    `There was an error ${errorDetail} - ${
      error instanceof Error ? error.message : error
    }`
  );
};

export const handleClientError = (message: string, error: unknown) => {
  const errorMessage = parseValidationErrorMessages(error);
  toastNotifyError(`There was an error ${message} - ${errorMessage}`);
  logErrorMessage(error, message);
};

export const handleServerError = (error: unknown, context: string) => {
  const errorMessage = parseValidationErrorMessages(error);
  logErrorMessage(error, context);
  return {
    data: null,
    status: StatusCode.INTERNAL_SERVER_ERROR,
    error: errorMessage,
  };
};
