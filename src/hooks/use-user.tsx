import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useUser = () => {
  const user = useQuery(api.users.currentUser);

  return {
    loading: user === undefined,
    user: user ?? null,
  };
};
