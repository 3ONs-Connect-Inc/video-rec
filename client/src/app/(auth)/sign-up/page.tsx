import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/auth/Header";
import { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import SocialLogin from "@/components/auth/SocialLogin";

export const metadata: Metadata = {
  title: "Create Account – Inkaer",
  description:
    "Sign up for Inkaer to access powerful hiring tools and connect with top engineering talent. Join our platform in just a few steps.",
  robots: {
    index: false,  
    follow: false,
  },
  openGraph: {
    type: "website",
    title: "Create Account – Inkaer",
    description:
      "Sign up for Inkaer to access powerful hiring tools and connect with top engineering talent.",
    siteName: "Inkaer",
  },
};

export default function CreateAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-1 xs:p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
          <Header mode="sign-up" />
          <CardContent className="space-y-6">
            <RegisterForm />
            <SocialLogin mode="sign-up" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
