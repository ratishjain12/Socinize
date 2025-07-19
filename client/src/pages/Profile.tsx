import React from "react";
import { useAuth } from "../contexts/AuthContext";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
          </div>

          <div className="border-b pb-4">
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <p className="mt-1 text-sm text-gray-900">{user?.userId}</p>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Settings
            </h3>
            <div className="space-y-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Change Password
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-3">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
