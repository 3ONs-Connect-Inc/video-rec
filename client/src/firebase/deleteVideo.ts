
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { deleteFileFromR2 } from "@/lib/r2Delete";

/**
 * Deletes a video document from Firestore and its file from Cloudflare R2.
 * @param videoId Firestore document ID
 * @param currentUserRole User role (must be "admin")
 */
export const deleteVideoFromFirestoreAndR2 = async (
  videoId: string,
  currentUserRole: string
): Promise<void> => {
  if (currentUserRole !== "admin") {
    throw new Error("Unauthorized: Only admins can delete videos.");
  }

  try {
    // 🔹 1. Get video doc
    const videoRef = doc(db, "videos", videoId);
    const snap = await getDoc(videoRef);

    if (!snap.exists()) throw new Error("Video not found.");

    const data = snap.data();
    const fileUrl = data?.url;

    // 🔹 2. Delete file from R2 first
    if (fileUrl) await deleteFileFromR2(fileUrl);

    // 🔹 3. Delete Firestore document
    await deleteDoc(videoRef);

    console.log(`✅ Video ${videoId} deleted successfully.`);
  } catch (err) {
    console.error("❌ Error deleting video:", err);
    throw err;
  }
};
