import { credentials_signIn, google_signin } from "@/actions/auth.actions";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Signin() {
  const session = await auth();
  console.log("session:", session);
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

      <form action={credentials_signIn} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Email address"
          className="primary-input"
        />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          className="primary-input"
        />

        <button type="submit" className="button-primary">
          Sign in
        </button>
      </form>

      <div className="relative flex items-center">
        <div className="grow border-t border-[#1F2937]" />
        <span className="mx-3 text-xs text-[#6B7280]">or</span>
        <div className="grow border-t border-[#1F2937]" />
      </div>

      <form action={google_signin}>
        <button type="submit" className="google-auth-btn cursor-pointer">
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
