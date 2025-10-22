"use client";
import { useRegister } from "@/hooks/auth/useRegister";
import { RegisterInput, registerSchema } from "@/schemas/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";


export default function RegisterForm() {
  const { register, handleSubmit, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });  
  const mutation = useRegister();
 const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const onSubmit = (values: RegisterInput) => mutation.mutate(values);

  return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="label block text-left">
          First Name
          </Label>
        <Input id="firstName" type="text"
         {...register("firstName")} 
          placeholder="Enter your first name" 
        className="font-sora"
         required 
         />
 {formState.errors.firstName && <p className="text-red-500">{formState.errors.firstName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName" 
        className="label block text-left">
          Last Name</Label>
        <Input id="lastName"
         type="text" 
        {...register("lastName")} 
        placeholder="Enter your last name" 
        className="font-sora" 
        required 
        />
         {formState.errors.lastName && <p className="text-red-500">{formState.errors.lastName.message}</p>}
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="email" 
      className="label block text-left">Email</Label>
      <Input id="email" 
      type="email"
       {...register("email")}
        placeholder="Enter your email"
         className="font-sora" 
         required 
         />
          {formState.errors.email && <p className="text-red-500">{formState.errors.email.message}</p>}
    </div>

    <div className="space-y-2">
      <Label htmlFor="password"
       className="label block text-left">Password</Label>
      <div className="relative">
        <Input id="password"
         type={showPassword ? "text" : "password"}
          {...register("password")} 
           placeholder="Create a password"
            className="font-sora pr-10" 
            required
             />
        <Button type="button" 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
         onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? 
          <EyeOff className="h-4 w-4 text-gray-400"
           /> : <Eye className="h-4 w-4 text-gray-400"
            />}
        </Button>
      </div>
       {formState.errors.password && <p className="text-red-500">{formState.errors.password.message}</p>}
    </div>

    <div className="space-y-2">
      <Label htmlFor="confirmPassword" 
      className="label block text-left">Confirm Password</Label>
      <div className="relative">
        <Input id="confirmPassword"
         type={showConfirmPassword 
         ? "text" : "password"} 
       {...register("confirmPassword")} 
         placeholder="Confirm your password"
          className="font-sora pr-10" 
          required
           />

        <Button type="button" 
        variant="ghost" 
        size="icon" 
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" 
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? 
          <EyeOff className="h-4 w-4 text-gray-400" />
           : <Eye className="h-4 w-4 text-gray-400" />}
        </Button>
      </div>
       {formState.errors.confirmPassword && <p className="text-red-500">{formState.errors.confirmPassword.message}</p>}
    </div>

    <div className="space-y-2">
      <Label htmlFor="linkedin" 
      className="label block text-left">
        LinkedIn Profile 
      <span className="text-gray-400 font-normal">
        (Optional)</span></Label>
      <Input id="linkedin" type="url"
       {...register("linkedin")} 
        placeholder="https://linkedin.com/in/yourprofile"
         className="font-sora" />
          {formState.errors.linkedin && <p className="text-red-500">{formState.errors.linkedin.message}</p>}
    </div>
  
    <Button type="submit"
   disabled={mutation.status === "pending"}
     className="btn-responsive w-full bg-gradient-inkaer hover:opacity-90 text-white rounded-full">
       {mutation.status === "pending" ? "Registering…" : "Create Account"}
      </Button>
      {mutation.status === "error" && (
  <p className="text-red-500">Registration failed. {mutation.error?.message}</p>
)}
  </form>
   );
}
