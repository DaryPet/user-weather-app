"use client";

import { ClipLoader } from "react-spinners";

export default function UserLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-32">
      <ClipLoader color="#06B6D4" size={50} speedMultiplier={1.2} />
      <p className="mt-2 text-gray-600 text-lg font-semibold">Loading...</p>
    </div>
  );
}
