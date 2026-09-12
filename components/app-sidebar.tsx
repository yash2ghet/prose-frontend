"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Tags,
  User,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const navigation = [
  {
    number: "01",
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    number: "02",
    title: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
  {
    number: "03",
    title: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    number: "04",
    title: "Profile",
    href: "/admin/profile",
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="border-none bg-primary"
    >
      <SidebarHeader className="h-14 border-b border-white/10 bg-primary p-0">
        <div className="flex h-14 items-center gap-2.5 px-4">
          {/* Logo */}
          <div className="flex size-[1.375rem] shrink-0 items-center justify-center rounded-sm bg-accent text-[0.75rem] font-bold text-primary">
            P
          </div>

          <span className="truncate text-[0.906rem] font-semibold text-primary-foreground group-data-[collapsible=icon]:hidden">
            Prose
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-primary">
        <SidebarMenu className="gap-0.5 px-2.5 py-3">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(`${item.href}/`))

            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  // isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    "h-auto min-h-8 rounded-md px-2.5 py-2",
                    "gap-2.5 text-[0.844rem] font-normal",
                    "text-primary-foreground/60",
                    "hover:bg-white/10 hover:text-primary-foreground",
                    "group-data-[collapsible=icon]:justify-center",
                    "group-data-[collapsible=icon]:px-0"
                  )}
                >
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-2.5"
                  >
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[0.688rem]",
                        "text-primary-foreground/40",
                        "group-data-[collapsible=icon]:hidden"
                      )}
                    >
                      {item.number}
                    </span>

                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        "hidden group-data-[collapsible=icon]:block"
                      )}
                    />

                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 bg-primary p-0">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

function UserMenu() {
  const { state } = useSidebar()

  const { data: session } = authClient.useSession()

  const [logoutOpen, setLogoutOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const user = session?.user

  const name = user?.name || "User"
  const email = user?.email || ""

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      const { error } = await authClient.signOut()

      if (error) {
        console.error("Logout failed:", error)
        setIsLoggingOut(false)
        return
      }

      window.location.replace("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full outline-none">
          <div
            className={cn(
              "flex items-center gap-2.5 px-3.5 py-3",
              "text-left transition-colors",
              "hover:bg-white/5",
              state === "collapsed" && "justify-center px-0"
            )}
          >
            <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-[0.688rem] font-semibold text-primary-foreground">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={name}
                  className="size-full object-cover"
                />
              ) : (
                initials || "U"
              )}
            </div>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-[0.813rem] font-medium text-primary-foreground">
                {name}
              </div>

              <div className="truncate text-[0.688rem] text-primary-foreground/50">
                {email}
              </div>
            </div>

            <span className="font-mono text-[0.688rem] text-primary-foreground/50 group-data-[collapsible=icon]:hidden">
              EXIT
            </span>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="end"
          className="w-48"
        >
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-accent-soft focus:text-destructive"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>

            <AlertDialogDescription>
              You will need to sign in again to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-accent-soft text-primary hover:bg-accent-soft/90"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}