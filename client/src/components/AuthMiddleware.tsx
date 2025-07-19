import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useAuth } from "../hooks/useAuth";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

export const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <Authenticator
            components={{
              Header() {
                return (
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome to Socinize
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Please sign in to continue
                    </p>
                  </div>
                );
              },
            }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
