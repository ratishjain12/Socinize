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
      <Route path="/" element={<Landing />} />

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
