import { Suspense } from "react";

// Wrap the Trails page (client component) in a Suspense boundary for fallback during CSR bailout
export default function TrailsLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
