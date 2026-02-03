"use client";

const Card = ({
  title = "Total Issues",
  desc = "Completed this week",
  data = 125,
}) => {
  return (
    <div className="w-full max-w-xs bg-[#1f2937] border border-[#374151] rounded-xl shadow-sm hover:border-[#6366F1] transition-colors duration-200 group overflow-hidden">
      <div className="pt-5 px-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">
            {title}
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {data}
            </h2>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 font-medium">{desc}</p>
      </div>

      <div className="mt-5 h-1 w-full bg-[#6366F1] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default Card;
