"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import UserVideoModal from "./UserVideoModal";

interface UserInfo {
  userId: string;
  firstname: string;
  lastname: string;
  videoCount: number;
}

export default function UserVideoTable() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realtime user data
    const usersRef = collection(db, "users");
    const videosRef = collection(db, "videos");

    // Maintain local caches
    let userMap = new Map<string, { firstname: string; lastname: string; displayName?: string }>();
    let videoCount: Record<string, number> = {};

    // Helper to recompute and set combined list
    const updateUserList = () => {
      const list: UserInfo[] = Array.from(userMap.entries())
        .filter(([id]) => videoCount[id])
        .map(([id, info]) => {
          let { firstname, lastname } = info;

          // 🧠 Handle Google users with displayName only
          if ((!firstname || firstname.toLowerCase() === "unknown") && info.displayName) {
            const parts = info.displayName.split(" ");
            firstname = parts[0] || "Unknown";
            lastname = parts.slice(1).join(" ") || "";
          }

          return {
            userId: id,
            firstname: firstname || "Unknown",
            lastname: lastname || "",
            videoCount: videoCount[id],
          };
        });

      setUsers(list);
      setLoading(false);
    };

    // 👤 Listen for user changes
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const userId = change.doc.id;

        if (change.type === "removed") {
          userMap.delete(userId);
        } else {
          userMap.set(userId, {
            firstname: data.firstName || "Unknown",
            lastname: data.lastName || "",
            displayName: data.displayName || "",
          });
        }
      });
      updateUserList();
    });

    // 🎥 Listen for video changes
    const unsubscribeVideos = onSnapshot(videosRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = change.doc.data();
        const userId = data.userId;
        if (!userId) return;

        if (change.type === "removed") {
          videoCount[userId] = Math.max((videoCount[userId] || 1) - 1, 0);
        } else if (change.type === "added") {
          videoCount[userId] = (videoCount[userId] || 0) + 1;
        }
      });
      updateUserList();
    });

    // Cleanup on unmount
    return () => {
      unsubscribeUsers();
      unsubscribeVideos();
    };
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <motion.div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mr-3" />
        Loading users...
      </div>
    );

  if (users.length === 0)
    return (
      <div className="text-center py-12 text-gray-500">
        No users have uploaded videos yet.
      </div>
    );

  return (
    <>
      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                First Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Last Name
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Videos
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u, i) => (
              <motion.tr
                key={u.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">{u.firstname}</td>
                <td className="px-4 py-3">{u.lastname}</td>
                <td className="px-4 py-3 text-center font-medium">{u.videoCount}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <UserVideoModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </>
  );
}
