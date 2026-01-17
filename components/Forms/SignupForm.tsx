"use client";

import { Input } from "../ui/input";
import { signUpAction } from "@/actions/auth.actions";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState({});

  const handleSignup = async (formData: FormData) => {
    try {
      setLoading(true);
      const res = await signUpAction(formData);

      if (res?.success) {
        router.push("/sign-in");
        toast.success("Account created successfully.");
      }

      if (!res?.success) {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Server Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSignup} className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Input
          type="text"
          name="firstName"
          placeholder="First name"
          className="primary-input"
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last name"
          className="primary-input"
        />
      </div>

      <Input
        type="email"
        name="email"
        placeholder="Email address"
        className="primary-input"
      />

      <Input
        type="password"
        name="password"
        placeholder="Password"
        className="primary-input"
      />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        className="primary-input"
      />

      <button type="submit" className="button-primary" disabled={loading}>
        "Create account"
      </button>
    </form>
  );
}
