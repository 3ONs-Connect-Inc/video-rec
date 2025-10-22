"use client";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { setUser } from "@/redux/sessionSlice";
import { db } from "@/firebase/config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithGoogle } from "@/firebase/auth/socialAuth";

type UserRole = "admin" | "user";

export function useGoogleSignIn(returnTo: string) {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Sign in with Google
      const firebaseUser = await signInWithGoogle();

      // Check if user exists in Firestore
      const userRef = doc(collection(db, "users"), firebaseUser.uid);
      const snapshot = await getDoc(userRef);

      let role: UserRole = "user";

      if (!snapshot.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: "user",
          createdAt: new Date().toISOString(),
        });
      } else {
        role = (snapshot.data().role as UserRole) || "user";
      }
  
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || "",
        role,
      };
    },
    onSuccess: (user) => {
      // Store user in Redux
      dispatch(setUser(user));

      toast.success("Signed in with Google!");
      router.push(user.role === "admin" ? "/admin" : returnTo || "/");
    },
    onError: () => {
      toast.error("Google sign-in failed.");
    },
  });
}
