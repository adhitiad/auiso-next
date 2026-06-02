import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  user: { id: string; name: string | null; email: string; image: string | null; role: string } | null
  isLoading: boolean
  setUser: (user: AuthState["user"]) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    { name: "auth-storage" }
  )
)
