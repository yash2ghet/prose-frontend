"use client"

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

import type { Category } from "./categories-table"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onConfirm: () => void
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-lg border-border bg-surface">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold text-foreground">
            Delete category?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              “{category?.name}”
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