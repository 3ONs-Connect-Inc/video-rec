
import { db } from "@/firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type UploadResponse = {
  url: string;
  key?: string;
};  

/**
 * Uploads a File to your Cloudflare Worker (which writes to R2).
 * Worker URL is read from NEXT_PUBLIC_CLOUDFLARE_WORKER_URL.
 */
export async function uploadFileToCFWorker(file: File): Promise<UploadResponse> {
  const workerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_WORKER_URL;
  if (!workerUrl) throw new Error("Missing NEXT_PUBLIC_CLOUDFLARE_WORKER_URL env var");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${workerUrl}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json as UploadResponse;
}

/**
 * Save metadata to Firestore. Returns the created document id.
 * Collection: 'clips'
 */
export async function saveClipMetadataToFirestore(data: {
  url: string;
  key?: string | null;
  filename: string;
  size: number;
  mimeType: string;
  userId?: string | null;
}) {
  const col = collection(db, "videos");
  const docRef = await addDoc(col, {
    url: data.url,
    key: data.key || null,
    filename: data.filename,
    size: data.size,
    mimeType: data.mimeType,
    userId: data.userId || null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
