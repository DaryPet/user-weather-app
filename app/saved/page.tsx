"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import WeatherButton from "@/components/WeatherButton";
import { useRouter } from "next/navigation";
import WeatherLoader from "@/components/WeatherLoader";
import toast from "react-hot-toast";

type User = {
  name: { first: string; last: string };
  email: string;
  location: {
    city: string;
    country: string;
    coordinates: { latitude: string; longitude: string };
  };
  picture: { large: string };
};

export default function SavedUsersPage() {
  const [savedUsers, setSavedUsers] = useState<User[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("savedUsers") || "[]");

    setSavedUsers(users);
    setIsLoading(false);
  }, []);

  const removeUser = (index: number) => {
    const savedUsers = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    const deletedUser = savedUsers[index];
    savedUsers.splice(index, 1);
    localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
    setSavedUsers([...savedUsers]);
    toast.success(`${deletedUser.name.first} removed!`, {
      style: {
        background: "#f59e0b",
        color: "#fff",
      },
    });
  };

  return (
    <main className="min-h-screen p-6 bg-gray-800">
      <div className="max-w-4xl w-full items-center justify-center m-auto">
        <h1 className="text-3xl font-extrabold text-center text-cyan-400 mb-6">
          SAVED USERS
        </h1>
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-6 py-3 bg-cyan-500 text-white rounded-lg shadow-md hover:bg-cyan-700 transition"
        >
          Home
        </button>
      </div>
      {isLoading ? (
        <WeatherLoader />
      ) : savedUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedUsers.map((user, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 border-gray-600 rounded-lg shadow-xl transform transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src={user.picture.large}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-cyan-700"
                />
                <h2 className="text-xl font-semibold text-center text-cyan-700">
                  {user.name.first} {user.name.last}
                </h2>
                <p className="text-gray-600 text-center">{user.email}</p>
                <p className="text-gray-600 text-center">
                  {user.location.city}, {user.location.country}
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => removeUser(index)}
                    className="mt-2 px-6 py-3 flex items-center gap-2 rounded-lg bg-red-400 text-white 
  hover:bg-red-500 active:scale-90 transition-all duration-300 ease-in-out animate-fade-in mx-auto group"
                  >
                    Delete User
                  </button>
                  <WeatherButton
                    latitude={parseFloat(user.location.coordinates.latitude)}
                    longitude={parseFloat(user.location.coordinates.longitude)}
                    userImage={user.picture.large}
                    userName={`${user.name.first} ${user.name.last}`}
                  />
                </div>
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
