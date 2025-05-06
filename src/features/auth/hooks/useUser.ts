import { useAppSelector } from "@/store";
import { User } from "../api/models";

export function useUser(): User | undefined {
  return useAppSelector((state) => state.auth.user);
}
