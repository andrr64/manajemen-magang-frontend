"use client";
import { WEB_ROUTES } from "@/modules/web-routes";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIam } from "./hooks";

/**
 * AuthGuard ensures that only authenticated users can access the wrapped component.
 * If the user is not authenticated, they will be redirected to the /login page.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useIam();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(WEB_ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}

/**
 * RoleGuard ensures that only users with specific roles can access the wrapped component.
 * It also acts as an AuthGuard.
 * If the user is authenticated but doesn't have the allowed role, they are redirected
 * to their respective dashboard.
 */
export function RoleGuard({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles: string[];
}) {
  const { user, isAuthenticated, isLoading } = useIam();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(WEB_ROUTES.LOGIN);
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      // Redirect unauthorized user to their own dashboard based on their role
      switch (user.role.toLowerCase()) {
        case "mahasiswa":
          router.push(WEB_ROUTES.MAHASISWA_DASHBOARD);
          break;
        case "mentor":
          router.push(WEB_ROUTES.MENTOR_DASHBOARD);
          break;
        default:
          router.push(WEB_ROUTES.HOME);
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Prevent rendering content if not authenticated or not allowed
  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
