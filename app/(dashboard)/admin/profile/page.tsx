"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { ChangePasswordForm } from "@/components/profile/change-password-form"

import { authClient } from "@/lib/auth-client"

export default function ProfilePage() {
  const { data: session } = authClient.useSession()

  const user = session?.user

  const name = user?.name || "User"
  const email = user?.email || ""
  const image = user?.image || undefined

  return (
    <div>
      <DashboardHeader
        title="Profile"
        section="Admin / Account"
      />

      <main className="flex-1 p-[1.375rem]">
        <div className="max-w-[35rem]">
          <ProfileForm
            name={name}
            email={email}
            image={image}
          />

          <div className="mt-3.5">
            <ChangePasswordForm />
          </div>
        </div>
      </main>
    </div>
  )
}