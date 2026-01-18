import { google_signin } from "@/actions/auth.actions";
import Image from "next/image";

export default async function GoogleAuthButton() {
  return (
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
  );
}
