import { isRedirectError } from "next/dist/client/components/redirect-error";
import { ZodError } from "zod";

type ActionResponse<T> =
  | { success: true; message: string; data?: T }
  | { success: false; message: string };

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

export const executeAction = async <T>({
  actionFn,
  successMessage = "Success",
}: Options<T>): Promise<ActionResponse<T>> => {
  try {
    
    const data = await actionFn();

    return {
      success: true,
      message: successMessage,
      data,
    };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof ZodError) {
      const parsedError = JSON.parse(error.message);
      return {
        success: false,
        message: parsedError[0].message || "Invalid Input",
      };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};
