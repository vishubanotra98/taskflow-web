import TaskBarChart from "@/components/Chart/BarChart";
import Card from "@/components/ui/Card/Card";
import { Users, UserPlus, CheckCircle2, PlusCircle } from "lucide-react";

const activities = [
  {
    id: 1,
    user: "Raj",
    action: "completed",
    task: "Fix login bug",
    time: "2m ago",
    icon: <CheckCircle2 size={12} className="text-green-400" />,
  },
  {
    id: 2,
    user: "Priya",
    action: "created",
    task: "Design homepage",
    time: "1h ago",
    icon: <PlusCircle size={12} className="text-blue-400" />,
  },
];

export default async function Dashboard({ params }: any) {
  return (
    <div className="min-h-screen bg-[#111827] px-6 pb-10 text-[#e5e7eb]">
      <header className="flex justify-between items-center mb-12">
        <h3 className="text-2xl font-semibold">Workspace Name</h3>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-medium transition-colors">
            <Users size={14} />
            Create Team
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-medium transition-colors">
            <UserPlus size={14} />
            Invite Member
          </button>
        </div>
      </header>

      <main className="space-y-10">
        <section>
          <h4 className="font-semibold mb-4">Workspace Summary</h4>
          <div className="flex flex-wrap gap-4">
            <Card
              title="Teams"
              data={1}
              className="bg-[#1f2937] border-white/5"
            />
            <Card
              title="Issues"
              data={100}
              className="bg-[#1f2937] border-white/5"
            />
            <Card
              title="Members"
              data={5}
              className="bg-[#1f2937] border-white/5"
            />
            <Card
              title="Members"
              data={5}
              className="bg-[#1f2937] border-white/5"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h4 className="font-semibold mb-4">Task Completion</h4>
            <div className="bg-[#1f2937] p-6 rounded-xl border border-white/5 h-[300px]">
              <TaskBarChart />
            </div>
          </div>

          <div className="h-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="font-semibold">Recent Activity</h4>
            </div>
            <div className=" bg-[#1f2937] border border-white/5 rounded-xl p-5 h-full">
              <ul className="relative space-y-6 before:absolute before:left-[9px]  before:w-[1px]">
                {activities.map((item) => (
                  <li
                    key={item.id}
                    className="relative pl-8 flex flex-col gap-1"
                  >
                    <div className="absolute left-0 top-1 w-[20px] h-[20px] bg-[#111827] border border-white/10 rounded-full flex items-center justify-center z-10">
                      {item.icon}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-white">
                        {item.user}
                      </span>
                      <span className="text-gray-400"> {item.action} </span>
                      <span className="text-indigo-400 hover:underline cursor-pointer">
                        {item.task}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
