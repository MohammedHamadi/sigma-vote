"use client";

// TODO: Implement client-side auth hook

export function useAuth() {
  // TODO: Read auth state from cookie/context
  return {
    isAuthenticated: false,
    user: null,
    role: null,
  };
}
