"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { Category } from "./categories-table"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (values: {
    name: string
    slug: string
  }) => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) {
  const [name, setName] = React.useState("")
  const [slug, setSlug] = React.useState("")

  const isEditing = Boolean(category)

  React.useEffect(() => {
    if (category) {
      setName(category.name)
      setSlug(category.slug)
    } else {
      setName("")
      setSlug("")
    }
  }, [category, open])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !slug.trim()) {
      return
    }

    onSave({
      name: name.trim(),
      slug: slug.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[26.25rem] rounded-lg border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="text-h3">
            {isEditing ? "Edit category" : "Add category"}
          </DialogTitle>

          <DialogDescription className="text-small leading-[1.55]">
            Categories group articles on the public site.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-[0.375rem]">
            <Label
              htmlFor="category-name"
              className="text-[0.8125rem] font-medium text-text"
            >
              Category name
            </Label>

            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter category name"
              className="h-[2.375rem] border-[#d1d5db] bg-surface text-sm"
            />
          </div>

          <div className="space-y-[0.375rem]">
            <Label
              htmlFor="category-slug"
              className="text-[0.8125rem] font-medium text-text"
            >
              Slug
            </Label>

            <Input
              id="category-slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="category-slug"
              className="h-[2.375rem] border-[#d1d5db] bg-surface font-mono text-[0.8125rem]"
            />
          </div>

          <DialogFooter className="gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-[2.375rem] px-[0.9375rem] text-[0.8125rem]"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-[2.375rem] px-[0.9375rem] text-[0.8125rem] font-medium"
            >
              {isEditing ? "Save changes" : "Save category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}