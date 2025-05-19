import { ApplicationError } from "@/services/base/errors";
import { ErrorMessage } from "../components";
import { Loader } from "../components";

export const useErrorLoadingUi = (
  children: React.ReactNode,
  {
    loading,
    error,
    message,
  }: {
    loading: boolean;
    error: string | null;
    message: string;
  }
) => {
  if (loading) return <Loader />;
  if (error) {
    return (
      <ErrorMessage
        error={new ApplicationError(error || message || "Error loading data")}
      />
    );
  }
  return children;
};
