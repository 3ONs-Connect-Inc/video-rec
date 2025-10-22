
import { auth } from "@/firebase/config";
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";

export const requestPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/reset-password`,
  });
};

export const confirmNewPassword = async ({
  oobCode,
  newPassword,
}: {
  oobCode: string;
  newPassword: string;
}) => {
  await verifyPasswordResetCode(auth, oobCode); // Optional: validates the code
  await confirmPasswordReset(auth, oobCode, newPassword);
};
