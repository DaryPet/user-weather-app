"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import WeatherButton from "@/components/WeatherButton";

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

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api/?results=5");
      setUsers((prevUsers) => [...prevUsers, ...response.data.results]);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveUser = (user: User) => {
    const savedUsers = JSON.parse(localStorage.getItem("savedUsers") || "[]");
    savedUsers.push(user);
    localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <button
        onClick={fetchUsers}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Load More
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <div key={index} className="p-4 bg-white rounded shadow">
            <Image
              src={user.picture.large}
              alt="Avatar"
              width={200}
              height={200}
              className="w-24 h-24 rounded-full mx-auto"
              layout="intrinsic"
            />
            <h2 className="text-xl font-semibold text-center">
              {user.name.first} {user.name.last}
            </h2>
            <p className="text-gray-600 text-center">{user.email}</p>
            <p className="text-gray-600 text-center">
              {user.location.city}, {user.location.country}
            </p>
            <button
              onClick={() => saveUser(user)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
            <WeatherButton
              latitude={parseFloat(user.location.coordinates.latitude)}
              longitude={parseFloat(user.location.coordinates.longitude)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
