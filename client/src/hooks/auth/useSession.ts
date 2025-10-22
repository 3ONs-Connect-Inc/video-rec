"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function useSession() {
  const { user, role, loading } = useSelector((state: RootState) => state.session);

  return {
    user,
    role,   
    loading,
  };
}
  