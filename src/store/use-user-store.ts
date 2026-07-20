import { create } from "zustand";
import { User } from "@/types";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: async () => {
    const res = await fetch("/api/user/me");
    if (res.ok) {
      const user: User = await res.json();
      set({ user });
    }
  },
  updateProfile: async (data) => {
    const res = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const user: User = await res.json();
      set({ user });
    }
  },
}));
