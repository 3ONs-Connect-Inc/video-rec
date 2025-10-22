"use client";

import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import { setUser } from "@/redux/sessionSlice";
import { doc, getDoc } from "firebase/firestore";

export function useSignIn() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      remember,
    }: { email: string; password: string; remember: boolean }) => {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      if (remember) {
        localStorage.setItem("userEmail", email);
      } else {
        localStorage.removeItem("userEmail");
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    },
    onSuccess: async (user) => {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      const role = snap.exists() ? snap.data().role || "user" : "user";
      
      dispatch(
        setUser({
          uid: user.uid,
          email: user.email!,
          displayName: user.displayName || "",
          role,
        })
      );

      toast.success("Sign in successful!");
      router.push(role === "admin" ? "/admin" : "/");
    },
    onError: (error: any) => {
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    },
  });
}
