import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";


export const signInUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};
