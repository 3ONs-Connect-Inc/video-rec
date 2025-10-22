
import { Metadata } from "next";
import SignIn from "./SignIn";

export const metadata: Metadata = {
  title: "Sign In to Your Account – Inkaer",
  description:
    "Sign in to your Inkaer account to access powerful hiring tools and manage your profile securely.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    title: "Sign In to Your Account – Inkaer",
    description:
      "Sign in to your Inkaer account to access powerful hiring tools and manage your profile securely.",
    siteName: "Inkaer",
  },
};

export default function SignInPage() {
  return <SignIn/>;
}