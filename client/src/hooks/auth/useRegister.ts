
import { db } from "@/firebase/config";
import { setUser } from "@/redux/sessionSlice";
import { registerUser } from "@/firebase/auth/register";
import type { RegisterInput } from "@/schemas/validation";
import { useMutation } from "@tanstack/react-query";
import { collection, doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const user = await registerUser(data); // Firebase auth logic

      // Save user info to Firestore
      const userRef = doc(collection(db, "users"), user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        firstName: data.firstName,
        lastName: data.lastName,
        linkedin: data.linkedin || null,
        emailVerified: false,
        role: "user",
        createdAt: new Date().toISOString(),
      });
      return user;
    },
    onSuccess: (user) => {
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || "",
            role: "user", 
        })
      );
      toast.success("Registration in successfully!");
      router.push("/sign-in");
    },
  });
}
