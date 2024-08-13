import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: null | User;
  setUser: (user: User) => void;
  logout: () => void;
}

//: We can do both like this
//! process 1
// export const useAuthStore = create((set) => ({
//   user: null,
// }));

//! process 2
export const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
