"use client";

const Card = ({
  title = "Total Issues",
  desc = "Completed this week",
  data = 0,
  className = "",
}) => {
  return (
    <div
      className={`flex-1 min-w-[200px] bg-[#1f2937] border border-white/5 rounded-xl shadow-lg hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden ${className}`}
    >
      <div className="pt-6 px-6 pb-6">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-3xl font-bold text-[#e5e7eb] tracking-tight">
              {data.toLocaleString()}
            </h2>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-400/80 font-medium flex items-center gap-1.5">
          {desc}
        </p>
      </div>

      <div className="h-[2px] w-full bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
};

export default Card;
