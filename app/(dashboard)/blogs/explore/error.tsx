"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl w-full text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Something went wrong!
        </h2>
        <p className="text-red-600 mb-6">
          We couldn&apos;t load the blogs. Please try again later.
        </p>
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
