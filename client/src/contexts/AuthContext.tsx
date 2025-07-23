import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser, signOut, fetchUserAttributes } from "aws-amplify/auth";

interface User {
  username: string;
  email?: string;
  userId: string;
  signInDetails?: unknown;
  attributes?: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();

    // Set up periodic auth state check every 5 seconds
    const interval = setInterval(() => {
      if (!isLoading) {
        checkAuthState();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        const userAttributes = await fetchUserAttributes();
        setUser({
          username: userAttributes.name ?? "",
          userId: currentUser.userId,
          signInDetails: currentUser.signInDetails,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("User not authenticated:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuthState = async () => {
    setIsLoading(true);
    await checkAuthState();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signOut: handleSignOut,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
