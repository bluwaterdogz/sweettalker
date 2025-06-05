// withScreenWrapper.tsx
import React from "react";
import { ErrorBoundary } from ".";

export function withErrorBoundary(
  WrappedComponent: React.ComponentType<any>
): React.ComponentType {
  return (props: any) => {
    // You can inject providers, styles, logic here
    return (
      <ErrorBoundary>
        {/* Optional: Global layout, header, etc */}
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
