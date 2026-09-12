"use client"

import * as React from "react"

import type { CategoryOption } from "@/app/(dashboard)/admin/blogs/page"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface BlogDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryOption[]
  saving?: boolean
  onSave: (values: {
    title: string
    categoryId: string
  }) => void
}

export function BlogDialog({
  open,
  onOpenChange,
  categories,
  saving,
  onSave,
}: BlogDialogProps) {
  const [title, setTitle] = React.useState("")
  const [categoryId, setCategoryId] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setTitle("")
      setCategoryId(categories[0]?.id ?? "")
    }
  }, [open, categories])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) return

    onSave({
      title: title.trim(),
      categoryId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[31.25rem]">
        <DialogHeader>
          <DialogTitle>
            Create blog
          </DialogTitle>

          <DialogDescription>
            Give it a title and category — you&apos;ll write the
            content in the full editor next.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-[1.125rem]"
        >
          <div className="space-y-[0.4375rem]">
            <Label htmlFor="blog-title">
              Title
            </Label>

            <Input
              id="blog-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter blog title"
              className="h-[2.5rem]"
              autoFocus
            />
          </div>

          <div className="space-y-[0.4375rem]">
            <Label>
              Category
            </Label>

            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? "")}
            >
              <SelectTrigger className="h-[2.5rem]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {categories.length === 0 && (
              <p className="text-caption text-subtle">
                No categories yet — you can add one from the
                Categories page, or leave this blank.
              </p>
            )}
          </div>

          <DialogFooter className="pt-[0.5rem]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create blog"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
