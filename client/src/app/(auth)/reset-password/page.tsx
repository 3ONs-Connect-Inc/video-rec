
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/auth/Header";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password – Inkaer",
  description:
    "Securely reset your Inkaer account password. Follow the instructions to regain access and protect your account.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
          <Header mode="reset-password" />
          <CardContent className="space-y-6">
            <ResetPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
