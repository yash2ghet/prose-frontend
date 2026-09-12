"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/shared/user-avatar"

import { authClient } from "@/lib/auth-client"

type ProfileFormProps = {
  name: string
  email: string
  image?: string
}

export function ProfileForm({
  name,
  email,
  image,
}: ProfileFormProps) {
  const [profileName, setProfileName] = React.useState(name)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    setProfileName(name)
  }, [name])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setSuccess(false)

    const trimmed = profileName.trim()

    if (!trimmed) {
      setError("Name is required.")
      return
    }

    try {
      setSaving(true)

      const result = await authClient.updateUser({
        name: trimmed,
      })

      if (result.error) {
        setError(
          result.error.message || "Failed to update profile."
        )
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error("Failed to update profile:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-5 flex items-center gap-3.5">
        <UserAvatar
          name={name}
          image={image}
          size="lg"
        />

        <div>
          <div className="text-base font-semibold text-foreground">
            {name}
          </div>

          <div className="text-small text-muted-foreground">
            {email}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-3.5 rounded-md border border-error/30 bg-error/5 px-3 py-2 text-small text-error">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3.5 rounded-md border border-green-600/30 bg-green-50 px-3 py-2 text-small text-green-700">
            Profile updated.
          </div>
        )}

        <div className="mb-3.5">
          <label
            htmlFor="profile-name"
            className="mb-1.5 block text-[0.8125rem] font-medium text-text"
          >
            Name
          </label>

          <Input
            id="profile-name"
            value={profileName}
            onChange={(event) => {
              setProfileName(event.target.value)
              setError("")
              setSuccess(false)
            }}
            className="h-[2.375rem] text-sm"
          />
        </div>

        <div className="mb-[1.125rem]">
          <label
            htmlFor="profile-email"
            className="mb-1.5 block text-[0.8125rem] font-medium text-text"
          >
            Email
          </label>

          <Input
            id="profile-email"
            value={email}
            disabled
            className="h-[2.375rem] bg-surface-alt text-sm text-subtle"
          />
        </div>

        <Button
          type="submit"
          className="h-[2.375rem] px-4 text-[0.8125rem] font-medium"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </div>
  )
}
