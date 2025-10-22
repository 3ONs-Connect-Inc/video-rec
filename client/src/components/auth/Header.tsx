"use client";

import Link from "next/link";
import Image from "next/image";
import { CardHeader, CardTitle } from "@/components/ui/card";

type HeaderProps = {
  mode: "sign-in" | "sign-up" | "forgot-password" | "reset-password";
};

export default function Header({ mode }: HeaderProps) {
  const renderContent = () => {
    switch (mode) {
      case "sign-up":
        return (
          <>
            <CardTitle className="section-title">Create Account</CardTitle>
            <p className="section-subtitle">
              Join Inkaer and showcase your skills
            </p>
          </>
        );
      case "forgot-password":
        return (
          <>
            <CardTitle className="section-title">Forgot Password?</CardTitle>
            <p className="section-subtitle">
              Please enter your email address, and we will send a password reset
              link to this email.
            </p>
          </>
        );
      case "reset-password":
        return (
          <>
            <CardTitle className="section-title">Reset Password</CardTitle>
            <p className="section-subtitle">Enter your new password below.</p>
          </>
        );
      case "sign-in":
      default:
        return (
          <>
            <CardTitle className="section-title">Welcome Back</CardTitle>
            <p className="section-subtitle">
              Sign in to your Inkaer account
            </p>
          </>
        );
    }
  };

  return (
    <CardHeader className="text-center space-y-4">
      <div className="flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/logoDark.svg"
            alt="Inkaer"
            width={100}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>
      {renderContent()}
    </CardHeader>
  );
}
