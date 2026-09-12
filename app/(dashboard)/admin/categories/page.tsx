"use client"

import * as React from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  CategoriesTable,
  type Category,
} from "@/components/categories/categories-table"
import { CategoryDialog } from "@/components/categories/category-dialog"
import { DeleteCategoryDialog } from "@/components/categories/delete-category-dialog"
import { Button } from "@/components/ui/button"

import { api } from "@/lib/api"

interface CategoriesResponse {
  data: {
    id: string
    name: string
    slug: string
    blogs: number
    createdAt: string
  }[]
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default function CategoriesPage() {
  const [categories, setCategories] =
    React.useState<Category[]>([])

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] =
    React.useState<Category | null>(null)

  const [deleteCategory, setDeleteCategory] =
    React.useState<Category | null>(null)

  const loadCategories = React.useCallback(async () => {
    try {
      setLoading(true)
      setError("")

      const result = await api.get<CategoriesResponse>(
        "/api/categories"
      )

      setCategories(
        (result.data || []).map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          blogs: item.blogs,
          created: formatDate(item.createdAt),
        }))
      )
    } catch (err) {
      console.error("Failed to load categories:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load categories."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadCategories()
  }, [loadCategories])

  function handleAddCategory() {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  function handleEditCategory(category: Category) {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  async function handleSaveCategory(values: {
    name: string
    slug: string
  }) {
    try {
      if (editingCategory) {
        await api.patch(
          `/api/categories/${editingCategory.id}`,
          values
        )
      } else {
        await api.post("/api/categories", values)
      }

      setDialogOpen(false)
      setEditingCategory(null)

      loadCategories()
    } catch (err) {
      console.error("Failed to save category:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save category."
      )
    }
  }

  function handleDeleteCategory(category: Category) {
    setDeleteCategory(category)
  }

  async function confirmDelete() {
    if (!deleteCategory) return

    try {
      await api.delete(`/api/categories/${deleteCategory.id}`)

      setDeleteCategory(null)

      loadCategories()
    } catch (err) {
      console.error("Failed to delete category:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete category."
      )

      setDeleteCategory(null)
    }
  }

  return (
    <div>
      <DashboardHeader
        title="Categories"
        section="Admin / Content"
      />

      <main className="flex-1 p-[1.375rem]">
        <div className="mb-[1.125rem] mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="m-0 text-h2 font-semibold leading-none tracking-[-0.02em] text-foreground">
              Categories
            </h1>

            <p className="mt-2 text-small text-muted-foreground">
              Group articles so readers can browse by topic.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleAddCategory}
            className="h-[2.375rem] shrink-0 rounded-md bg-primary px-4 text-[0.8125rem] font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Add Category
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-error/30 bg-error/5 px-3.5 py-2.5 text-small text-error">
            {error}
          </div>
        )}

        <CategoriesTable
          categories={categories}
          loading={loading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </main>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryDialog
        open={deleteCategory !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCategory(null)
          }
        }}
        category={deleteCategory}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
