"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/auth/Header";
import SocialLogin from "@/components/auth/SocialLogin";
import SignInForm from "@/components/auth/SignInForm";
import { useSignIn } from "@/hooks/auth/useSignIn";
import type { RootState } from "@/redux/store";


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useSelector((state: RootState) => state.session.user);

  useEffect(() => {
    if (user) {
      const returnTo = searchParams.get("returnTo");
      router.push(returnTo || "/");
    }
  }, [user, searchParams, router]);

  const signInMutation = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    signInMutation.mutate({ email, password, remember: rememberMe });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-1 xs:p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
          <Header mode="sign-in" />
          <CardContent className="space-y-6">
            <SignInForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              isLoading={signInMutation.isPending}
            />
            <SocialLogin mode="sign-in" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
