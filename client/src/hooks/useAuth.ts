export function useAuth() {
  // Always return a mock user without authentication
  return {
    user: {
      id: "demo-user",
      email: "demo@beautyapp.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null
    },
    isLoading: false,
    isAuthenticated: true,
  };
}
