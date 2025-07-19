import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthMiddleware } from "./AuthMiddleware";
import { Header } from "./Header";
import { Home } from "../pages/Home";
import { Dashboard } from "../pages/Dashboard";
import { Profile } from "../pages/Profile";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public route - no authentication required */}
      <Route path="/" element={<Home />} />

      {/* Protected routes - wrapped in AuthMiddleware */}
      <Route
        path="/dashboard"
        element={
          <AuthMiddleware>
            <main>
              <Dashboard />
            </main>
          </AuthMiddleware>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthMiddleware>
            <Header />
            <main>
              <Profile />
            </main>
          </AuthMiddleware>
        }
      />
    </Routes>
  );
};
