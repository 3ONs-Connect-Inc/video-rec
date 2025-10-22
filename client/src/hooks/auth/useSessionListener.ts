"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onSnapshot, doc } from "firebase/firestore";
import { setUser, clearUser, setLoading } from "@/redux/sessionSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";

export function useSessionListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(clearUser());
        return;
      }

      //  Listen live to that user's Firestore doc for role changes
      const userRef = doc(db, "users", firebaseUser.uid);
      const unsubscribeUser = onSnapshot(userRef, (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName ?? "",
            role: data.role || "user",
          })
        );
      });

      return () => unsubscribeUser();
    });

    return () => unsubscribeAuth();
  }, [dispatch]);
}
