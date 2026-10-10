export function ListingSkeleton() {
  return (
    <div className="page-body" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-10 w-2/3 max-w-md" />
      <div className="skeleton mt-4 h-5 w-full max-w-xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-80" />)}
      </div>
    </div>
  );
}
