'use client';

export interface ChapterLoaderProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ChapterLoader({
  isLoading,
  error,
  onRetry,
}: ChapterLoaderProps) {
  if (!isLoading && !error) return null;

  return (
    <div className="flex justify-center py-12">
      {isLoading && (
        <div className="flex flex-col items-center gap-4">
          {/* Skeleton Loader */}
          <div className="w-full max-w-2xl space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Loading next chapter...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-center">
          <p className="text-sm text-red-700">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 rounded bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
