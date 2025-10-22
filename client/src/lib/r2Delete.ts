import { toast } from "sonner";

export const deleteFileFromR2 = async (fileUrl: string): Promise<void> => {
  try {
    const url = new URL(fileUrl);
    const key = url.pathname.replace("/files/", ""); // extract R2 key

    const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL}/files/${key}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete file from R2");
    }

    toast.success("Previous image deleted from R2");
  } catch (err) {
    console.error("File deletion failed:", err);
    toast.error("Failed to delete old image from R2");
  }
};
