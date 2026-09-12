"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { RichTextEditor } from "@/components/editor/rich-text-editor"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

import { api } from "@/lib/api"

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogCategory {
  id: string
  name: string
  slug: string
}

interface BlogAuthor {
  id: string
  name: string
  email: string
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  status: "Draft" | "Published"
  featured: boolean
  featuredImage: string | null
  seoTitle: string | null
  seoDescription: string | null
  categoryId: string | null
  authorId: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  category: BlogCategory | null
  author: BlogAuthor | null
}

interface ArticleResponse {
  data: Blog
}

interface CategoriesResponse {
  data: Category[]
}

export default function EditBlogPage() {
  const params = useParams()
  const router = useRouter()

  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [categories, setCategories] = useState<Category[]>([])

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")

  const [status, setStatus] = useState<"Draft" | "Published">("Draft")
  const [categoryId, setCategoryId] = useState("")
  const [featured, setFeatured] = useState(false)

  const [featuredImage, setFeaturedImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState("")

  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")

  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError("")

        const [articleResponse, categoryResponse] = await Promise.all([
          api.get<ArticleResponse>(`/api/articles/${id}`),
          api.get<CategoriesResponse>("/api/categories"),
        ])

        const article = articleResponse.data

        setCategories(categoryResponse.data)

        setTitle(article.title || "")
        setSlug(article.slug || "")
        setExcerpt(article.excerpt || "")
        setContent(article.content || "")

        setStatus(article.status || "Draft")
        setCategoryId(article.categoryId || "")
        setFeatured(article.featured || false)

        setFeaturedImage(article.featuredImage || null)

        setSeoTitle(article.seoTitle || "")
        setSeoDescription(article.seoDescription || "")

        setUpdatedAt(article.updatedAt || null)
      } catch (err) {
        console.error("Failed to load blog:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load blog."
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const titleCount = seoTitle.length
  const descriptionCount = seoDescription.length
  const excerptCount = excerpt.length

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) => category.id === categoryId
    )
  }, [categories, categoryId])

  const regenerateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

    setSlug(generatedSlug)
  }

  const saveArticle = async (
    nextStatus: "Draft" | "Published"
  ) => {
    if (!title.trim()) {
      setError("Title is required.")
      return
    }

    if (!slug.trim()) {
      setError("Slug is required.")
      return
    }

    if (!content.trim()) {
      setError("Article content is required.")
      return
    }

    if (!categoryId) {
      setError("Please select a category.")
      return
    }

    if (excerpt.length > 200) {
      setError("Excerpt cannot be longer than 200 characters.")
      return
    }

    if (seoTitle.length > 60) {
      setError("SEO title cannot be longer than 60 characters.")
      return
    }

    if (seoDescription.length > 160) {
      setError(
        "SEO description cannot be longer than 160 characters."
      )
      return
    }

    try {
      setSaving(true)
      setError("")

      const response = await api.patch<ArticleResponse>(
        `/api/articles/${id}`,
        {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim() || null,
          content,
          status: nextStatus.toLowerCase(),
          categoryId,
          featured,
          featuredImage,
          seoTitle: seoTitle.trim() || null,
          seoDescription: seoDescription.trim() || null,
        }
      )

      const article = response.data

      setStatus(article.status)
      setUpdatedAt(article.updatedAt)

      if (article.status === "Published") {
        router.push(`/blog/${article.slug}`)
        router.refresh()
        return
      }
    } catch (err) {
      console.error("Failed to save article:", err)

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save article."
      )
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = () => {
    saveArticle("Draft")
  }

  const handlePublish = () => {
    saveArticle("Published")
  }

  const handleRemoveImage = () => {
    setFeaturedImage(null)
    setImageError("")
  }

  const imageInputRef = useRef<HTMLInputElement>(null)

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB

  const handleReplaceClick = () => {
    setImageError("")
    imageInputRef.current?.click()
  }

  const handleFileSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.")
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be smaller than 2MB.")
      return
    }

    setImageError("")

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFeaturedImage(reader.result)
      }
    }

    reader.onerror = () => {
      setImageError("Failed to read that image. Try another file.")
    }

    reader.readAsDataURL(file)
  }

  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not saved yet"

  if (loading) {
    return (
      <main className="flex-1 p-5.5">
        <DashboardHeader
          title="Edit article"
          section="Admin / Blogs"
        />

        <div className="mt-6 rounded-lg border border-border bg-card p-6 text-small text-muted-foreground">
          Loading blog...
        </div>
      </main>
    )
  }

  if (error && !title) {
    return (
      <main className="flex-1 p-5.5">
        <DashboardHeader
          title="Edit article"
          section="Admin / Blogs"
        />

        <div className="mt-6 rounded-lg border border-error/30 bg-card p-6">
          <p className="text-small text-error">
            {error}
          </p>

          <Button
            variant="outline"
            className="mt-4 h-9 px-3.5 text-small"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </main>
    )
  }

  return (
      <div>
        <DashboardHeader
          title="Edit article"
          section="Admin / Blogs"
        />

        {error && (
          <div className="rounded-md border border-error/30 bg-error/5 px-3.5 py-2.5 text-small text-error">
            {error}
          </div>
        )}

        <main className="flex-1 p-[1.125rem]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
              Edit Blog
            </h1>

            <span className="rounded-sm bg-muted px-2 py-0.75 font-mono text-caption font-semibold uppercase tracking-[0.04em] text-muted-foreground">
              {status}
            </span>

            <span className="font-mono text-small text-subtle">
              Last updated {formattedUpdatedAt}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-small text-muted-foreground">
              {saving ? "Saving..." : "All changes saved"}
            </span>

            <Button
              variant="outline"
              className="h-9 px-3.5 text-small"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving && status === "Draft"
                ? "Saving..."
                : "Save Draft"}
            </Button>

            <Button
              variant="outline"
              className="h-9 px-3.5 text-small"
              onClick={() => {
                if (slug) {
                  window.open(
                    `/blog/${slug}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              }}
              disabled={!slug}
            >
              Preview
            </Button>

            <Button
              className="h-9 bg-primary px-4 text-small font-medium text-primary-foreground"
              onClick={handlePublish}
              disabled={saving}
            >
              {saving && status === "Published"
                ? "Publishing..."
                : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <div className="rounded-lg border border-border bg-card p-4.5">
              <Input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter article title..."
                className="h-auto border-0 px-0 pb-3.5 text-[1.625rem] font-semibold tracking-[-0.025em] shadow-none focus-visible:ring-0"
              />

              <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3.5">
                <span className="font-mono text-small text-subtle">
                  prose.dev/blog/
                </span>

                <Input
                  value={slug}
                  onChange={(event) =>
                    setSlug(event.target.value)
                  }
                  className="h-auto min-w-40 flex-1 border-0 bg-transparent px-0 font-mono text-small text-accent-ink shadow-none focus-visible:ring-0"
                />

                <button
                  type="button"
                  onClick={regenerateSlug}
                  className="text-small text-muted-foreground transition-colors hover:text-text"
                >
                  Regenerate
                </button>
              </div>

              <div className="mt-3.5">
                <div className="mb-1.75 flex items-center justify-between">
                  <label className="text-small font-medium text-text">
                    Excerpt
                  </label>

                  <span className="font-mono text-caption text-subtle">
                    {excerptCount} / 200
                  </span>
                </div>

                <Textarea
                  value={excerpt}
                  onChange={(event) =>
                    setExcerpt(event.target.value)
                  }
                  maxLength={200}
                  placeholder="One or two sentences shown on cards and in search results."
                  className="min-h-17.5 resize-y text-small leading-[1.5]"
                />
              </div>
            </div>

            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-3.5">
            <section className="rounded-lg border border-border bg-card p-4">
              <SectionTitle>Settings</SectionTitle>

              <div className="space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-small font-medium text-text">
                    Status
                  </label>

                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(
                        value as "Draft" | "Published"
                      )
                    }
                  >
                    <SelectTrigger className="h-9 text-small">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Draft">
                        Draft
                      </SelectItem>

                      <SelectItem value="Published">
                        Published
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-small font-medium text-text">
                    Category
                  </label>

                  <Select
                    value={categoryId}
                    onValueChange={(value) =>
                      setCategoryId(value ?? "")
                    }
                  >
                    <SelectTrigger className="h-9 text-small">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedCategory && (
                    <p className="mt-1.5 text-caption text-subtle">
                      /{selectedCategory.slug}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <div>
                    <div className="text-small font-medium text-text">
                      Feature this article
                    </div>

                    <div className="text-caption text-subtle">
                      Pins it to the homepage
                    </div>
                  </div>

                  <Switch
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <SectionTitle>Featured image</SectionTitle>

              <div className="h-30 rounded-md bg-surface-alt p-2">
                <div className="flex h-full items-end overflow-hidden rounded-sm border border-border bg-muted/30 p-2">
                  {featuredImage ? (
                    <img
                      src={featuredImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-mono text-caption text-muted-foreground">
                      No featured image
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2.5 flex gap-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelected}
                />

                <Button
                  variant="outline"
                  className="h-8 flex-1 text-caption"
                  type="button"
                  onClick={handleReplaceClick}
                >
                  Replace
                </Button>

                <Button
                  variant="outline"
                  className="h-8 flex-1 border-error/30 text-caption text-error hover:bg-error/5 hover:text-error"
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={!featuredImage}
                >
                  Remove
                </Button>
              </div>

              {imageError && (
                <p className="mt-2 text-caption text-error">
                  {imageError}
                </p>
              )}
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <SectionTitle>SEO</SectionTitle>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-small font-medium text-text">
                    SEO title
                  </label>

                  <span className="font-mono text-caption text-subtle">
                    {titleCount} / 60
                  </span>
                </div>

                <Input
                  value={seoTitle}
                  maxLength={60}
                  onChange={(event) =>
                    setSeoTitle(event.target.value)
                  }
                  className="mb-3.5 h-9 text-small"
                />

                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-small font-medium text-text">
                    SEO description
                  </label>

                  <span className="font-mono text-caption text-subtle">
                    {descriptionCount} / 160
                  </span>
                </div>

                <Textarea
                  value={seoDescription}
                  maxLength={160}
                  onChange={(event) =>
                    setSeoDescription(event.target.value)
                  }
                  className="min-h-16 resize-y text-small leading-[1.5]"
                />

                <div className="mt-3.5 rounded-md border border-border bg-surface-alt p-3">
                  <div className="mb-1 font-mono text-caption text-muted-foreground">
                    prose.dev › blog › {slug}
                  </div>

                  <div className="mb-0.75 text-[0.90625rem] leading-[1.3] text-accent-ink">
                    {seoTitle || "SEO title"}
                  </div>

                  <div className="text-small leading-[1.45] text-muted-foreground">
                    {seoDescription ||
                      "SEO description will appear here."}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <h2 className="mb-3.5 font-mono text-small font-medium uppercase tracking-[0.09em] text-muted-foreground">
      {children}
    </h2>
  )
}