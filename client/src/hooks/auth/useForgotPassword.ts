


import { requestPasswordReset } from "@/firebase/auth/forgotPassword";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useForgotPassword = () =>
  useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => toast.success("Reset email sent!"),
    onError: (e: any) => toast.error(e.message || "Error"),
  });
