"use client"

import * as React from "react"

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

export type Blog = {
  id: string
  title: string
  category: string
  status: string
  author: string
  created: string
  updated: string
}

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  blog: Blog | null
  onConfirm: () => void
}

export function DeleteDialog({
  open,
  onOpenChange,
  blog,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-lg border-border bg-surface">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-foreground">
            Delete blog?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              “{blog?.title}”
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="mt-0 h-9 rounded-md border-input bg-background px-3 text-sm hover:bg-accent">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="h-9 rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}