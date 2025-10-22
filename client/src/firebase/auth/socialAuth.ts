import { auth } from "@/firebase/config";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};
