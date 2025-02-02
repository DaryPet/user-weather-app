"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import WeatherButton from "@/components/WeatherButton";
import { useRouter } from "next/navigation";
import WeatherLoader from "@/components/WeatherLoader";
import toast from "react-hot-toast";

type User = {
  name: { first: string; last: string };
  email: string;
  gender: string;
  location: {
    city: string;
    country: string;
    coordinates: { latitude: string; longitude: string };
  };
  picture: { large: string };
};

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://randomuser.me/api/?results=5");
      setUsers((prevUsers) => [...prevUsers, ...response.data.results]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const saveUser = (user: User) => {
    const savedUsers = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    if (!savedUsers.some((savedUser: User) => savedUser.email === user.email)) {
      localStorage.setItem("savedUsers", JSON.stringify([...savedUsers, user]));
      toast.success(`${user.name.first} saved!`, {
        style: {
          background: "#22c55e",
          color: "#fff",
        },
      });
    } else {
      toast.error(`${user.name.first} is already saved!`, {
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-800">
      <div className="max-w-4xl w-full items-center justify-center m-auto">
        <h1 className="text-3xl font-extrabold text-center text-cyan-400 mb-6">
          USER LIST
        </h1>
        <div className="flex flex-wrap justify-between">
          <button
            onClick={() => router.push("/saved")}
            className="px-6  mb-6 py-3 bg-emerald-600 hover:bg-emerald-700 transition text-white rounded-lg shadow-md"
          >
            Saved Users
          </button>

          <button
            onClick={fetchUsers}
            className="mb-6 px-6 py-3 bg-cyan-500 text-white rounded-lg shadow-md hover:bg-cyan-700 transition"
          >
            Load More
          </button>
        </div>
      </div>
      {isLoading ? (
        <WeatherLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => {
            return (
              <div
                key={index}
                className="p-4 bg-gray-100 border-gray-600 rounded-lg shadow-xl transform transition-transform duration-200 hover:scale-105"
              >
                <Image
                  src={user.picture.large}
                  alt="Avatar"
                  width={200}
                  height={200}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-cyan-700"
                />
                <h2 className="text-xl font-semibold text-center text-cyan-700">
                  {user.name.first} {user.name.last}
                </h2>
                <p className="text-gray-600 text-center">
                  <strong>Gender:</strong> {user.gender}
                </p>
                <p className="text-gray-600 text-center">{user.email}</p>
                <p className="text-gray-600 text-center">
                  {user.location.city}, {user.location.country}
                </p>
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => saveUser(user)}
                    className="mt-2 px-6 py-3 flex items-center gap-2 rounded-lg bg-emerald-600 text-white 
  hover:bg-emerald-700 active:scale-90 transition-all duration-300 ease-in-out animate-fade-in mx-auto group"
                  >
                    Save
                  </button>
                  <WeatherButton
                    latitude={parseFloat(user.location.coordinates.latitude)}
                    longitude={parseFloat(user.location.coordinates.longitude)}
                    userImage={user.picture.large}
                    userName={`${user.name.first} ${user.name.last}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
