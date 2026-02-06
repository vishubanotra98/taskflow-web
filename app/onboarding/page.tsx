import { redirect } from "next/navigation";
import { CreateWorkspaceModal } from "@/components/Forms/OnboardingForm/OnboardingForm";
import { auth } from "@/lib/auth";
import { LayoutGrid } from "lucide-react"; // Clean icon for Workspaces

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = session.user.id;

  return (
    <div className="bg-[#111827] w-full h-[100vh]">
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center w-full max-w-[440px] px-8 py-10 bg-[#1f2937] border border-white/5 rounded-2xl shadow-2xl">
          <div className="w-16 h-16 bg-[#0b1220] border border-white/10 rounded-2xl flex items-center justify-center mb-6">
            <LayoutGrid className="w-8 h-8 text-[#6366F1]" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Welcome to Taskflow
          </h1>

          <p className="text-gray-400 mb-10 text-sm leading-relaxed">
            To get started, you&apos;ll need a workspace. This is where your
            teams, projects, and issues will live.
          </p>

          <div className="w-full">
            <CreateWorkspaceModal userId={userId} />
          </div>

          <p className="mt-8 text-xs text-gray-500">
            Have an invite?{" "}
            <button className="text-[#6366F1] font-medium hover:underline transition-all">
              Join existing workspace
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
