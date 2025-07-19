import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signOut } from "aws-amplify/auth";

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
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
        setUser({
          username: currentUser.username,
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
