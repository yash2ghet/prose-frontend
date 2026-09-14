// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// import { SidebarProvider } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"


// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()
//   const [checkingAuth, setCheckingAuth] = useState(true)

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const response = await fetch("http://localhost:8080/api/me", {
//           credentials: "include",
//         })

//         if (!response.ok) {
//           router.replace("/login")
//           return
//         }

//         setCheckingAuth(false)
//       } catch (error) {
//         console.error("Session check failed:", error)
//         router.replace("/login")
//       }
//     }

//     checkSession()
//   }, [router])

//   if (checkingAuth) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
//         Checking authentication...
//       </div>
//     )
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />

//       <main className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">

//         <div className="flex-1">
//           {children}
//         </div>
//       </main>
//     </SidebarProvider>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import { api } from "@/lib/api"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.get("/api/me")

        setCheckingAuth(false)
      } catch (error) {
        console.error("Session check failed:", error)
        router.replace("/login")
      }
    }

    checkSession()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking authentication...
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">

        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
