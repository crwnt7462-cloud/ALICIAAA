import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Check if admin mode is enabled via environment variable
  const isAdminMode = import.meta.env.VITE_ADMIN_MODE === "true";
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !isAdminMode, // Don't fetch user in admin mode
  });

  // If admin mode is enabled, return a mock admin user
  if (isAdminMode) {
    return {
      user: {
        id: "admin-dev-user",
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        profileImageUrl: null
      },
      isLoading: false,
      isAuthenticated: true,
    };
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
