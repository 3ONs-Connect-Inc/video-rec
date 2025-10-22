import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import  {Button}  from "@/components/ui/button";
import Link  from "next/link";
import { useEffect } from "react";


interface Props {
  handleSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  isLoading: boolean;
}

const SignInForm = ({
  handleSubmit,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  isLoading,
}: Props) => {
  useEffect(() => {
    // Check if email is in localStorage
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }
  }, [setEmail, setRememberMe]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="label block text-left">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="font-sora"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="label block text-left">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="font-sora pr-10"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col xxs:flex-row xxs:items-center xxs:justify-between gap-2 xxs:gap-0">
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-inkaer-blue bg-gray-100 border-gray-300 rounded focus:ring-inkaer-blue focus:ring-2"
          />
          <Label htmlFor="remember" className="text-xs xs:text-sm font-sora text-gray-600">Remember me</Label>
        </div>
        <Link href="/forgot-password" className="text-xs xs:text-sm font-sora text-inkaer-blue hover:text-inkaer-dark-blue">
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="btn-responsive w-full bg-gradient-inkaer hover:opacity-90 text-white rounded-full"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default SignInForm;