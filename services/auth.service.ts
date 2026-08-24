import { API, axiosClient } from "@/apiConstant/apiConstant";
import {
  OtpVerificationInterface,
  SignInInterface,
  SignupPayloadInterface,
} from "@/types/types";

export const signUpService = async (payload: SignupPayloadInterface) => {
  try {
    const res = await axiosClient.post(`${API.AUTH.SIGN_UP}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const signInService = async (payload: SignInInterface) => {
  try {
    const res = await axiosClient.post(`${API.AUTH.SIGN_IN}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const otpVerificationService = async (
  payload: OtpVerificationInterface,
) => {
  try {
    const res = await axiosClient.post(`${API.AUTH.OTP_VERIFICATION}`, payload);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const logoutService = async () => {
  try {
    const res = await axiosClient.post(`${API.AUTH.LOGOUT}`);
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export const githubStatusService = async (workspaceId: string) => {
  try {
    const res = await axiosClient.get(
      `${`/auth/github/status/${workspaceId}`}`,
    );
    return res?.data;
  } catch (error) {
    throw error;
  }
};
