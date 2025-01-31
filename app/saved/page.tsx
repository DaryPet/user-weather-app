"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type User = {
  name: { first: string; last: string };
  email: string;
  location: { city: string; country: string };
  picture: { large: string };
};

export default function SavedUsersPage() {
  const [savedUsers, setSavedUsers] = useState<User[]>([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    setSavedUsers(users);
  }, []);

  const removeUser = (index: number) => {
    const savedUsers = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    savedUsers.splice(index, 1);
    localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
    setSavedUsers([...savedUsers]);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Saved Users</h1>

      {savedUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedUsers.map((user, index) => (
              <div key={index} className="p-4 bg-white rounded shadow">
                <Image
                  src={user.picture.large}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto"
                />
                <h2 className="text-xl font-semibold text-center">
                  {user.name.first} {user.name.last}
                </h2>
                <p className="text-gray-600 text-center">{user.email}</p>
                <p className="text-gray-600 text-center">
                  {user.location.city}, {user.location.country}
                </p>
                <button
                  onClick={() => removeUser(index)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete User
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-600">There are no saved users yet</p>
      )}
    </main>
  );
}
