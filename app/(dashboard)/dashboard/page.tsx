"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("Logged out successfully.");

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="text-muted-foreground">
        Welcome to your Prose CMS administration panel.
      </p>

      <Button
        type="button"
        variant="destructive"
        onClick={handleLogout}
        className="w-fit"
      >
        Logout
      </Button>
    </div>
  );
}