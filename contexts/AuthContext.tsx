"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
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

// Access tokens are short-lived (15m). Refresh a little before that so an
// in-progress session never gets kicked to /sign-in mid-use.
const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMe = async (): Promise<User | null> => {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return data.user ?? null;
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  // Tries /api/auth/me; if that comes back empty, it might just be that the
  // 15-minute access token expired while the 30-day refresh token is still
  // good - so refresh once and try again before concluding the user is
  // actually logged out.
  const refreshUser = async () => {
    try {
      let currentUser = await fetchMe();

      if (!currentUser) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          currentUser = await fetchMe();
        }
      }

      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // While a session is active, proactively refresh the access token every
  // 10 minutes so it never actually gets a chance to expire mid-session.
  useEffect(() => {
    if (user) {
      refreshIntervalRef.current = setInterval(() => {
        refreshAccessToken();
      }, REFRESH_INTERVAL_MS);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user]);

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
