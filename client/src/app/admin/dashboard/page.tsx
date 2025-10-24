"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import UserVideoTable from "@/components/admin/UserVideoTable";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-3xl font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          👥 User Video Dashboard
        </motion.h1>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Back to Recorder
        </Link>
      </div>

      <UserVideoTable />
    </div>
  );
}
