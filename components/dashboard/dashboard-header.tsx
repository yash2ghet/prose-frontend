"use client"

import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"

interface DashboardHeaderProps {
  title?: string
  section?: string
  viewSiteHref?: string
}

export function DashboardHeader({
  title = "Dashboard",
  section = "Admin",
  viewSiteHref = "/",
}: DashboardHeaderProps) {
  const { data: session } = authClient.useSession()

  const user = session?.user

  const name = user?.name || "User"

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-5">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="-ml-1" />

        <div className="h-5 w-px bg-border" />

        <div className="min-w-0">
          <div className="font-mono text-caption uppercase tracking-[0.09em] text-muted-foreground">
            {section}
          </div>

          <div className="truncate text-[0.938rem] font-semibold tracking-[-0.01em] text-foreground">
            {title}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <Link
          href={viewSiteHref}
          className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-[0.813rem] font-normal text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View site 
        </Link>

        <Avatar className="size-[1.875rem]">
          {user?.image && (
            <AvatarImage
              src={user.image}
              alt={name}
            />
          )}

          <AvatarFallback className="bg-muted text-[0.688rem] font-semibold text-foreground">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}