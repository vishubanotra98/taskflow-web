import { isRedirectError } from "next/dist/client/components/redirect-error";
import { json, ZodError } from "zod";

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

const executeAction = async <T>({
  actionFn,
  successMessage = "The Action was successful",
}: Options<T>): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await actionFn();

    if (
      res &&
      typeof res === "object" &&
      "success" in res &&
      "message" in res
    ) {
      return res as { success: boolean; message: string };
    }

    return {
      success: true,
      message: successMessage,
    };
  } catch (e: any) {
    if (isRedirectError(e)) {
      throw e;
    }

    if (e.type === "AuthError") {
      return {
        success: false,
        message: e.message,
      };
    }

    if (e instanceof ZodError) {
      const parsedError = JSON.parse(e.message);
      return {
        success: false,
        message: parsedError[0].message || "Invalid Input",
      };
    }

    return {
      success: false,
      message: "An error occurred during executing the action.",
    };
  }
};

export { executeAction };
