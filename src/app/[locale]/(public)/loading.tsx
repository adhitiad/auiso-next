import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col space-y-4 items-center gap-4 [--radius:1.2rem]"
          >
            <div className="w-full h-48 bg-muted animate-pulse rounded" />
            <Badge variant="outline">
              <Spinner data-icon="inline-start text-white dark:text-black text-foreground" />
              Processing
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Loading;
