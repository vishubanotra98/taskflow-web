const IssueLoading = () => {
  return (
    <div className="mx-auto flex h-[70vh] w-[90%] items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="size-8 animate-spin rounded-full border-2 border-default border-t-brand" />

        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-primary">Loading issue</p>

          <p className="mt-1 text-xs text-secondary">
            Fetching issue details...
          </p>
        </div>
      </div>
    </div>
  );
};

export default IssueLoading;
