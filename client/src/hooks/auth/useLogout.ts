import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/firebase/config";
import { clearUser } from "@/redux/sessionSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      toast.success("You have signed out successfully");
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Failed to log out. Please try again.");
    }
  };
};

export default useLogout;
