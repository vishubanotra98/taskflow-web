"use client";

import { credentials_signIn } from "@/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SignInSchema, signInSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (data: SignInSchema) => {
    setLoading(true);
    const res = await credentials_signIn(data);
    if (!res?.success) {
      toast.error(res?.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="flex flex-col gap-3"
      >
        <div>
          <Input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className="primary-input"
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
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`primary-input ${errors.password ? "error" : ""}`}
            required
          />
          <div className=" absolute top-[30%] right-5">
            {showPassword ? (
              <EyeOff
                color="#6b7280"
                size={14}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                color="#6b7280"
                size={14}
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          {errors.password && (
            <p className="mt-0.5 ml-0.5 text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit" className="button-primary" disabled={loading}>
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <Spinner color="#ffffff" />
              <span>Signing In</span>
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
