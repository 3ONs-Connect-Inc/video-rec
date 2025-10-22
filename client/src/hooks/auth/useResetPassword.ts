
import { confirmNewPassword } from "@/firebase/auth/forgotPassword";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useResetPassword = () =>
  useMutation({
    mutationFn: confirmNewPassword,
    onSuccess: () => toast.success("Password changed successfully!"),
    onError: (e: any) => toast.error(e.message || "Error"),
  });
