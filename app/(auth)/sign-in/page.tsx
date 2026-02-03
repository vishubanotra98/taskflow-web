import { SignInForm } from "@/components/Forms/AuthForm/SignInForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GoogleAuthButton from "@/components/ui/Button/GoogleAuthButton";
import Link from "next/link";

export default async function Signin() {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#E5E7EB]">
          Sign in to Taskflow
        </h1>
        <p className="text-sm text-[#9CA3AF]">
          Welcome back. Enter your details to continue.
        </p>
      </div>

      <SignInForm />

      <div className="relative flex items-center">
        <div className="grow border-t border-[#1F2937]" />
        <span className="mx-3 text-xs text-[#6B7280]">or</span>
        <div className="grow border-t border-[#1F2937]" />
      </div>

      <div>
        <GoogleAuthButton />
        <div className=" mt-4 flex justify-center items-center gap-2">
          <p className="text-sm text-[#9CA3AF]">Don't have an account ?</p>
          <Link className="text-sm text-zinc-300 underline" href={"/sign-up"}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
