"use client";

import { Input } from "../../ui/Input/input";
import { signUpAction } from "@/actions/auth.actions";
import { useState } from "react";
import { Spinner } from "../../ui/Spinner/spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterUserWithConfirmSchema,
  registerUserWithConfirmSchema,
} from "@/lib/schema";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerUserWithConfirmSchema),
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleSignup = async (formData: RegisterUserWithConfirmSchema) => {
    setLoading(true);
    const res = await signUpAction(formData);

    if (res?.success) {
      const email = res.data?.email;
      router.push(`/account-verification?email=${email}`);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div>
          <Input
            {...register("firstName")}
            type="text"
            placeholder="First name"
            required
            className="primary-input"
          />
          {errors.firstName && (
            <p className="mt-0.5 ml-0.5 text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Input
            {...register("lastName")}
            type="text"
            required
            placeholder="Last name"
            className="primary-input"
          />
          {errors.lastName && (
            <p className="mt-0.5 ml-0.5 text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          {...register("email")}
          type="email"
          placeholder="Email address"
          className={`primary-input ${errors.email ? "error" : ""}`}
          required
        />
        {errors.email && (
          <p className="mt-0.5 ml-0.5 text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          {...register("password")}
          type={showPassword.password ? "text" : "password"}
          placeholder="Password"
          className={`primary-input ${errors.password ? "error" : ""}`}
          required
        />
        <div className=" absolute top-[30%] right-5">
          {showPassword.password ? (
            <EyeOff
              color="#6b7280"
              size={14}
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, password: false }))
              }
            />
          ) : (
            <Eye
              color="#6b7280"
              size={14}
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, password: true }))
              }
            />
          )}
        </div>
        {errors.password && (
          <p className="mt-0.5 ml-0.5 text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          {...register("confirmPassword")}
          type={showPassword.confirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          className={`primary-input ${errors.confirmPassword ? "error" : ""}`}
          required
        />
        <div className=" absolute top-[30%] right-5">
          {showPassword.confirmPassword ? (
            <EyeOff
              color="#6b7280"
              size={14}
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirmPassword: false }))
              }
            />
          ) : (
            <Eye
              color="#6b7280"
              size={14}
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirmPassword: true }))
              }
            />
          )}
        </div>
        {errors.confirmPassword && (
          <p className="mt-0.5 ml-0.5 text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button type="submit" className="button-primary" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-1">
            <Spinner color="#ffffff" />
            <span>Creating Account</span>
          </span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
