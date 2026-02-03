import Card from "@/components/ui/Card/Card";
import { Users } from "lucide-react";
import { UserPlus } from "lucide-react";

export default async function Dashboard() {
  return (
    <div className="my-4">
      <header>
        <div className="flex justify-between items-center">
          <h3 className=" text-2xl font-semibold text-[#e5e7eb]">
            Workspace Name
          </h3>
          <div className="flex items-center gap-2">
            <button className="button-primary flex items-center gap-1.5">
              <Users className="mb-0.5" size={14} />
              Create Team
            </button>
            <button className="button-primary flex items-center gap-1.5">
              <UserPlus className="mb-0.5" size={14} />
              Invite Member
            </button>
          </div>
        </div>
      </header>

      <main className="mt-12">
        <div className="card-container">
          <h4 className="font-semibold text-[#e5e7eb]">Workspace Summary</h4>
          <div className="mt-2 flex items-center gap-3.5">
            <Card />
            <Card />
            <Card />
            <Card />
          </div>
        </div>
      </main>
    </div>
  );
}
