"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BlogsFilters } from "@/components/blogs/blogs-filters"
import { BlogsTable } from "@/components/blogs/blogs-table"
import { BlogDialog } from "@/components/blogs/blog-dialog"
import { BlogPagination } from "@/components/shared/blog-pagination"

import { api } from "@/lib/api"

export interface Blog {
  id: string
  title: string
  slug: string
  category: string
  categoryId: string | null
  status: "Published" | "Draft"
  author: string
  created: string
  updated: string
}

export interface CategoryOption {
  id: string
  name: string
  slug: string
}

interface ArticlesResponse {
  data: any[]
  page: number
  limit: number
  count: number
}

interface CategoriesResponse {
  data: CategoryOption[]
}

const PAGE_SIZE = 9

function formatDate(date: string | null) {
  if (!date) return "—"

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function mapArticleToBlog(article: any): Blog {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: article.category?.name || "Uncategorized",
    categoryId: article.categoryId ?? null,
    status: article.status,
    author: article.author?.name || "Unknown",
    created: formatDate(article.createdAt),
    updated: formatDate(article.updatedAt),
  }
}

export default function BlogsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [blogs, setBlogs] = React.useState<Blog[]>([])
  const [totalBlogs, setTotalBlogs] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  const [categories, setCategories] = React.useState<CategoryOption[]>([])

  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("All statuses")
  const [category, setCategory] = React.useState("All categories")

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [creating, setCreating] = React.useState(false)

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  )

  React.useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        const result = await api.get<CategoriesResponse>(
          "/api/categories"
        )

        if (!cancelled) {
          setCategories(result.data || [])
        }
      } catch (err) {
        console.error("Failed to load categories:", err)
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  const loadBlogs = React.useCallback(async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()

      params.set("page", String(currentPage))
      params.set("limit", String(PAGE_SIZE))

      if (search.trim()) {
        params.set("search", search.trim())
      }

      if (status === "Published") {
        params.set("status", "published")
      } else if (status === "Draft") {
        params.set("status", "draft")
      }

      if (category !== "All categories") {
        const match = categories.find(
          (item) => item.name === category
        )

        if (match) {
          params.set("category", match.slug)
        }
      }

      const result = await api.get<ArticlesResponse>(
        `/api/articles?${params.toString()}`
      )

      setBlogs((result.data || []).map(mapArticleToBlog))
      setTotalBlogs(result.count || 0)
    } catch (err) {
      console.error("Failed to load blogs:", err)

      setBlogs([])
      setTotalBlogs(0)
    } finally {
      setLoading(false)
    }
  }, [search, status, category, currentPage, categories])

  React.useEffect(() => {
    loadBlogs()
  }, [loadBlogs])

  const totalPages = Math.max(
    1,
    Math.ceil(totalBlogs / PAGE_SIZE)
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  function handleCreateBlog() {
    setDialogOpen(true)
  }

  function handleEditBlog(blog: Blog) {
    router.push(`/admin/blogs/${blog.id}/edit`)
  }

  async function handleCreateSave(values: {
    title: string
    categoryId: string
  }) {
    try {
      setCreating(true)

      const slug =
        values.title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-") || `article-${Date.now()}`

      const response = await api.post<{ data: { id: string } }>(
        "/api/articles",
        {
          title: values.title,
          slug,
          content: "",
          status: "draft",
          categoryId: values.categoryId || null,
        }
      )

      setDialogOpen(false)

      router.push(`/admin/blogs/${response.data.id}/edit`)
    } catch (err) {
      console.error("Failed to create blog:", err)
    } finally {
      setCreating(false)
    }
  }

  async function handleDeleteBlog(id: string) {
    try {
      await api.delete(`/api/articles/${id}`)
      loadBlogs()
    } catch (err) {
      console.error("Failed to delete blog:", err)
    }
  }

  async function handleDuplicateBlog(blog: Blog) {
    try {
      await api.post(`/api/articles/${blog.id}/duplicate`, {})
      loadBlogs()
    } catch (err) {
      console.error("Failed to duplicate blog:", err)
    }
  }

  async function handleTogglePublish(blog: Blog) {
    try {
      const nextStatus =
        blog.status === "Published" ? "draft" : "published"

      await api.patch(`/api/articles/${blog.id}`, {
        status: nextStatus,
      })

      loadBlogs()
    } catch (err) {
      console.error("Failed to update blog status:", err)
    }
  }

  function handleSearchChange(value: string) {
    setSearch(value)

    if (currentPage !== 1) {
      window.history.replaceState(null, "", "?page=1")
    }
  }

  function handleStatusChange(value: string) {
    setStatus(value)

    if (currentPage !== 1) {
      window.history.replaceState(null, "", "?page=1")
    }
  }

  function handleCategoryChange(value: string) {
    setCategory(value)

    if (currentPage !== 1) {
      window.history.replaceState(null, "", "?page=1")
    }
  }

  const categoryNames = [
    "All categories",
    ...categories.map((item) => item.name),
  ]

  return (
    <div>
      <DashboardHeader
        title="Blogs"
        section="Admin / Content"
      />

      <main className="flex-1 p-[1.125rem]">
        <div className="mb-[1.125rem] flex items-start justify-between gap-4 mt-3">
          <div>
            <h1 className="m-0 text-h2 font-semibold leading-none tracking-[-0.02em] text-foreground">
              Blogs
            </h1>

            <p className="mt-2 text-small text-muted-foreground">
              Create and manage articles published on your website.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateBlog}
            className="inline-flex h-[2.375rem] shrink-0 items-center justify-center rounded-md bg-primary px-[0.9375rem] text-[0.8125rem] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            + Create Blog
          </button>
        </div>

        <BlogsFilters
          search={search}
          onSearchChange={handleSearchChange}
          status={status}
          onStatusChange={handleStatusChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          categories={categoryNames}
        />

        <BlogsTable
          blogs={blogs}
          totalBlogs={totalBlogs}
          loading={loading}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          onDuplicate={handleDuplicateBlog}
          onTogglePublish={handleTogglePublish}
        />

        {totalPages > 1 && (
            <div className="mt-9 flex justify-center">
              <BlogPagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
      </main>

      <BlogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        saving={creating}
        onSave={handleCreateSave}
      />
    </div>
  )
}
