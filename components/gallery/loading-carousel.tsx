import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCarousel() {
  return (
    <div className="space-y-6">
      {/* Image skeleton */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Navigation buttons skeleton */}
      <div className="flex justify-between px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Indicators skeleton */}
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-1.5 w-3 rounded-full" />
        ))}
      </div>

      {/* Button skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-12 w-40 rounded-md" />
      </div>
    </div>
  );
}
