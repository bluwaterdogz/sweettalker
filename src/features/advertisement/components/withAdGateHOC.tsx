import React, { useEffect } from "react";
import { useAdGate } from "../hooks/useAdGate";

export const withAdGate = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAdGateHOC: React.FC<P> = (props) => {
    const { hasWatchedAd, checkAdStatus } = useAdGate();

    useEffect(() => {
      checkAdStatus();
    }, [checkAdStatus]);

    if (!hasWatchedAd) {
      return (
        // <WithAdGate
        //   onAdComplete={() => {
        //     // The ad status will be updated by the useAdGate hook
        //   }}
        // >
        <WrappedComponent {...props} />
        // </WithAdGate>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithAdGateHOC;
};
