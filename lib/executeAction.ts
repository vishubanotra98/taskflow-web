import { isRedirectError } from "next/dist/client/components/redirect-error";
import { json, ZodError } from "zod";

type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

type ActionResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; data?: never };

const executeAction = async <T>({
  actionFn,
  successMessage = "The Action was successful",
}: Options<T>): Promise<ActionResult<T>> => {
  try {
    const res = await actionFn();

    const data = await actionFn();

    return {
      success: true,
      message: successMessage,
      data,
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
