import React from "react";
import { Routes, Route } from "react-router-dom";
// import { AuthMiddleware } from "./AuthMiddleware";
import { SidebarLayout } from "./ui/sidebar-layout";
import { Dashboard } from "../pages/dashboard";
import { Profile } from "../pages/profile";
import Landing from "../pages/landing";
import NewDraftPage from "@/pages/new-draft";
import ScheduledPage from "@/pages/Scheduled";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />

      {/* Protected routes with sidebar layout */}
      <Route path='/' element={<SidebarLayout />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/new-draft' element={<NewDraftPage />} />
        <Route path='/all-drafts' element={<AllDraftsPage />} />
        <Route path='/scheduled' element={<ScheduledPage />} />
        <Route path='/published' element={<PublishedPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/logout' element={<LogoutPage />} />
      </Route>
    </Routes>
  );
};

const AllDraftsPage = () => (
  <div className='p-6 md:p-10 w-full'>
    <div className='max-w-7xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>All Drafts</h2>
        <p className='text-gray-600'>View and manage all your drafts here.</p>
      </div>
    </div>
  </div>
);

const PublishedPage = () => (
  <div className='p-6 md:p-10 w-full'>
    <div className='max-w-7xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
          Published Posts
        </h2>
        <p className='text-gray-600'>View your published posts here.</p>
      </div>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className='p-6 md:p-10 w-full'>
    <div className='max-w-7xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Settings</h2>
        <p className='text-gray-600'>Manage your application settings here.</p>
      </div>
    </div>
  </div>
);

const LogoutPage = () => (
  <div className='p-6 md:p-10 w-full'>
    <div className='max-w-7xl mx-auto'>
      <div className='bg-white rounded-lg shadow p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Logout</h2>
        <p className='text-gray-600'>You have been logged out successfully.</p>
      </div>
    </div>
  </div>
);
