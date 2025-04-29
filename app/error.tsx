"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Add error logging service integration
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="error-container p-4 rounded-lg bg-red-50 dark:bg-red-900">
      <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
        Something went wrong!
      </h2>
      <p className="text-red-600 dark:text-red-300 mt-2">{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
