import React from "react";

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
        <p className="text-gray-600">
          This is your dashboard. You can see this page because you're
          authenticated!
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Feature 1</h3>
            <p className="text-blue-700 text-sm mt-2">
              Your first feature description
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900">Feature 2</h3>
            <p className="text-green-700 text-sm mt-2">
              Your second feature description
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Feature 3</h3>
            <p className="text-purple-700 text-sm mt-2">
              Your third feature description
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
