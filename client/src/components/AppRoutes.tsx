import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthMiddleware } from "./AuthMiddleware";
import { Header } from "./Header";
import { Dashboard } from "../pages/Dashboard";
import { Profile } from "../pages/Profile";
import Landing from "../pages/Landing";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />

      <Route
        path='/dashboard'
        element={
          // <AuthMiddleware>
          // <main>
          <Dashboard />
          // </main>
          // </AuthMiddleware>
        }
      />
      <Route
        path='/new-draft'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    New Draft
                  </h2>
                  <p className='text-gray-600'>
                    Create a new social media draft here.
                  </p>
                </div>
              </div>
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path='/all-drafts'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    All Drafts
                  </h2>
                  <p className='text-gray-600'>
                    View and manage all your drafts here.
                  </p>
                </div>
              </div>
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path='/scheduled'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Scheduled Posts
                  </h2>
                  <p className='text-gray-600'>
                    Manage your scheduled posts here.
                  </p>
                </div>
              </div>
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path='/published'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Published Posts
                  </h2>
                  <p className='text-gray-600'>
                    View your published posts here.
                  </p>
                </div>
              </div>
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path='/profile'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <Profile />
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path='/settings'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Settings
                  </h2>
                  <p className='text-gray-600'>
                    Manage your application settings here.
                  </p>
                </div>
              </div>
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path='/logout'
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='bg-white rounded-lg shadow p-6'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Logout
                  </h2>
                  <p className='text-gray-600'>
                    You have been logged out successfully.
                  </p>
                </div>
              </div>
            </main>
          </AuthMiddleware>
        }
      />
    </Routes>
  );
};
