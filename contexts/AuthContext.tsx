"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePhoto?: string;
  bio?: string;
  interests?: string[];
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --------------------------------------------------
  // Fetch current user
  // --------------------------------------------------

  const fetchMe = useCallback(async (): Promise<User | null> => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    return data.user ?? null;
  }, []);

  // --------------------------------------------------
  // Refresh Access Token
  // --------------------------------------------------

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      return res.ok;
    } catch {
      return false;
    }
  }, []);

  // --------------------------------------------------
  // Refresh User
  // --------------------------------------------------

  const refreshUser = useCallback(async () => {
    try {
      let currentUser = await fetchMe();

      if (!currentUser) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          currentUser = await fetchMe();
        }
      }

      setUser(currentUser);
    } catch (err) {
      console.error("Auth refresh failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchMe, refreshAccessToken]);

  // --------------------------------------------------
  // INITIAL AUTH CHECK (THIS WAS MISSING)
  // --------------------------------------------------

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const logout = useCallback(async () => {
    try {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      setUser(null);
      setLoading(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }, []);

  // --------------------------------------------------
  // Auto Refresh Access Token
  // --------------------------------------------------

  useEffect(() => {
    if (!user) return;

    refreshIntervalRef.current = setInterval(() => {
      void refreshAccessToken();
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user, refreshAccessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}