"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { authClient } from "@/lib/auth-client"

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] =
    React.useState("")

  const [newPassword, setNewPassword] =
    React.useState("")

  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    setError("")
    setSuccess(false)

    if (!currentPassword || !newPassword) {
      setError("Both fields are required.")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.")
      return
    }

    try {
      setSaving(true)

      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      })

      if (result.error) {
        setError(
          result.error.message ||
            "Failed to update password."
        )
        return
      }

      setCurrentPassword("")
      setNewPassword("")
      setSuccess(true)
    } catch (err) {
      console.error("Failed to change password:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update password."
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-3.5 text-[0.90625rem] font-semibold text-foreground">
        Change password
      </h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-3.5 rounded-md border border-error/30 bg-error/5 px-3 py-2 text-small text-error">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3.5 rounded-md border border-green-600/30 bg-green-50 px-3 py-2 text-small text-green-700">
            Password updated.
          </div>
        )}

        <div className="mb-3.5">
          <label
            htmlFor="current-password"
            className="mb-1.5 block text-[0.8125rem] font-medium text-text"
          >
            Current password
          </label>

          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value)
              setError("")
              setSuccess(false)
            }}
            placeholder="••••••••"
            className="h-[2.375rem] text-sm"
            autoComplete="current-password"
          />
        </div>

        <div className="mb-[1.125rem]">
          <label
            htmlFor="new-password"
            className="mb-1.5 block text-[0.8125rem] font-medium text-text"
          >
            New password
          </label>

          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value)
              setError("")
              setSuccess(false)
            }}
            placeholder="••••••••"
            className="h-[2.375rem] text-sm"
            autoComplete="new-password"
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="h-[2.375rem] px-4 text-[0.8125rem] font-normal"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  )
}
