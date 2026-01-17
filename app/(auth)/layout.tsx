export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex">
      {/* Left side */}
      <div className="hidden md:flex w-[60%] border-r border-[#1F2937] auth-bg">
        <div className="flex flex-col justify-center px-16 max-w-xl">
          <h1 className="text-3xl font-semibold text-[#E5E7EB] leading-tight">
            Track issues.
            <br />
            Ship faster.
            <br />
            Stay sane.
          </h1>

          <p className="mt-4 text-sm text-[#9CA3AF]">
            A focused workspace for high-performing engineering teams.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div
        className="w-full md:w-[40%] bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0B1220]
 flex items-center justify-center"
      >
        <div className="w-full max-w-md px-10">{children}</div>
      </div>
    </div>
  );
}
