export default function CategoryLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-muted animate-pulse" />

      <div className="mx-auto max-w-screen-xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-8 w-40 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-[300px] bg-muted rounded-xl animate-pulse" />
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
