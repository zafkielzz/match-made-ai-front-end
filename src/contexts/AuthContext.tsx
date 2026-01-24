import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type Role = "guest" | "user" | "hr";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  role: Role;
  user: User | null;
  hydrated: boolean;
  signin: (role: Exclude<Role, "guest">, user?: User) => void;
  signout: () => void;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildDemoUser(role: Exclude<Role, "guest">): User {
  return {
    id: role === "hr" ? "hr_demo" : "user_demo",
    name: role === "hr" ? "Demo HR" : "Demo User",
    email: role === "hr" ? "hr@demo.local" : "user@demo.local",
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("guest");
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load auth from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored) as {
          role?: Role;
          user?: User | null;
        };
        const nextRole: Role = parsed.role ?? "guest";
        const nextUser: User | null = parsed.user ?? null;

        setRole(nextRole);
        setUser(nextUser);
      }
    } catch {
      setRole("guest");
      setUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Ensure invariant: role !== guest => user exists (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    if (role === "guest") return;
    if (user) return;

    setUser(buildDemoUser(role));
  }, [hydrated, role, user]);

  // Persist back to localStorage (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("auth", JSON.stringify({ role, user }));
  }, [hydrated, role, user]);

  const signin = (newRole: Exclude<Role, "guest">, newUser?: User) => {
    setRole(newRole);
    setUser(newUser ?? buildDemoUser(newRole));
  };

  const signout = () => {
    setRole("guest");
    setUser(null);
  };

  const value = useMemo(
    () => ({ role, user, hydrated, signin, signout, setRole }),
    [role, user, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
