"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        setCheckingAuth(false);
      } catch (error) {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex-1 min-h-screen bg-background">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
        </header>

        {children}
      </main>
    </SidebarProvider>
  );
}