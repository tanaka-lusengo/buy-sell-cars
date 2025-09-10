import { type ZodError } from "zod";
import { StatusCode } from "./constants";
import { toastNotifyError } from "./reactHotToast";

type ParsedZodError = {
  path: string[];
  message: string;
} & ZodError;

// Translate only the most technical/unhelpful error messages
const translateTechnicalError = (message: string): string => {
  // Common Supabase/PostgreSQL errors that are not user-friendly
  if (
    message.includes("JSON object requested") &&
    message.includes("multiple") &&
    message.includes("rows returned")
  ) {
    return "Multiple records found where only one was expected. Please try again or contact support.";
  }

  if (message.includes("duplicate key value violates unique constraint")) {
    // Try to extract constraint name for context
    const constraintMatch = message.match(/constraint "([^"]+)"/);
    if (constraintMatch) {
      const constraint = constraintMatch[1];
      if (constraint.includes("email")) {
        return "An account with this email address already exists.";
      }
      if (constraint.includes("unique")) {
        return "This information already exists in our system.";
      }
    }
    return "This information already exists. Please use different details.";
  }

  if (
    message.includes("connection") &&
    message.toLowerCase().includes("timeout")
  ) {
    return "Connection timeout. Please check your internet connection and try again.";
  }

  if (
    message.includes("permission denied") ||
    message.includes("insufficient privileges")
  ) {
    return "You don't have permission to perform this action.";
  }

  // Handle authentication/signup specific errors
  if (message.includes("User already registered")) {
    return "An account with this email already exists. Please try signing in instead.";
  }

  if (message.includes("Invalid login credentials")) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }

  if (message.includes("Email not confirmed")) {
    return "Please check your email and confirm your account before signing in.";
  }

  if (message.includes("Password should be at least")) {
    return "Password must be at least 6 characters long.";
  }

  // Handle database/server generic errors
  if (
    message.includes("Failed to save") ||
    message.includes("database error")
  ) {
    return "Unable to save your information. Please try again.";
  }

  if (message.includes("Network request failed") || message.includes("fetch")) {
    return "Connection problem. Please check your internet and try again.";
  }

  // Return original message if it's likely user-friendly
  return message;
};

const parseValidationErrorMessages = (error: unknown): string => {
  // Handle Supabase error objects (based on Supabase docs best practices)
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;

    // Check for Supabase error structure first
    if (errorObj.code || errorObj.details || errorObj.hint) {
      // Use hint first (most user-friendly), then details, then message
      const meaningfulMessage =
        errorObj.hint || errorObj.details || errorObj.message;
      if (meaningfulMessage && typeof meaningfulMessage === "string") {
        return translateTechnicalError(meaningfulMessage);
      }
    }

    // Handle nested PostgreSQL errors in Supabase responses
    if (errorObj.message && typeof errorObj.message === "string") {
      return translateTechnicalError(errorObj.message);
    }
  }

  // Handle JavaScript Error objects
  if (error instanceof Error) {
    try {
      // Try parsing as Zod validation errors (array format)
      const errorArray = JSON.parse(error.message);
      if (Array.isArray(errorArray)) {
        const errMessages = errorArray.map(
          (error: ParsedZodError) => `${error.path[0]}: ${error.message}`
        );
        return errMessages.join(", ");
      }
    } catch {
      // Not JSON, return the error message as-is
      return translateTechnicalError(error.message);
    }
  }

  // Handle string errors
  if (typeof error === "string") {
    return translateTechnicalError(error);
  }

  return "An unexpected error occurred";
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

  // Clean up redundant messaging
  const finalMessage =
    errorMessage.includes("Unable to") || errorMessage.includes("Please")
      ? errorMessage // Use the specific error message directly
      : `There was an error ${message} - ${errorMessage}`; // Use the formatted version

  toastNotifyError(finalMessage);
  logErrorMessage(error, message);
};

export const handleServerError = (error: unknown, context: string) => {
  const errorMessage = parseValidationErrorMessages(error);
  logErrorMessage(error, context);

  // Provide context-specific fallback messages for better UX
  let contextualMessage = errorMessage;

  // If the error message is still generic, provide a context-specific one
  if (
    errorMessage === "An unexpected error occurred" ||
    errorMessage.includes("digest")
  ) {
    switch (context) {
      case "signing up (server)":
        contextualMessage =
          "Unable to create your account. Please check your information and try again.";
        break;
      case "signing in (server)":
        contextualMessage =
          "Unable to sign you in. Please check your credentials and try again.";
        break;
      case "updating profile (server)":
        contextualMessage = "Unable to update your profile. Please try again.";
        break;
      case "uploading file (server)":
        contextualMessage = "File upload failed. Please try again.";
        break;
      case "subscribing to newsletter (server)":
        contextualMessage = "Unable to subscribe. Please try again.";
        break;
      default:
        contextualMessage = "Something went wrong. Please try again.";
    }
  }

  return {
    data: null,
    status: StatusCode.INTERNAL_SERVER_ERROR,
    error: contextualMessage,
  };
};
