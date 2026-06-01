import { Skeleton } from "@/components/ui/skeleton";

export default function PostsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-4 shadow-sm">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
