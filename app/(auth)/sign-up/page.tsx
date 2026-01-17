import { google_signin } from "@/actions/auth.actions";
import { SignupForm } from "@/components/Forms/SignupForm";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await auth();
  if (session) redirect("/");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-[#E5E7EB]">
          Create your Taskflow account
        </h1>
        <p className="text-sm text-[#9CA3AF]">Get started in under a minute.</p>
      </div>
      <SignupForm />
      <div className="relative flex items-center">
        <div className="grow border-t border-[#1F2937]" />
        <span className="mx-3 text-xs text-[#6B7280]">or</span>
        <div className="grow border-t border-[#1F2937]" />
      </div>

      <form action={google_signin}>
        <button type="submit" className="google-auth-btn">
          <Image
            src="/assets/Google_Logo.png"
            alt="Google"
            width={16}
            height={16}
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
}
