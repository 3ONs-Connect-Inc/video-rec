import { auth } from "@/firebase/config";
import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";



export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
  linkedin,
}: {    
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  linkedin?: string;
}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: `${firstName} ${lastName}`,
    photoURL: linkedin || undefined,
  });

  return user;
};