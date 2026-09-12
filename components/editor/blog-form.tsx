"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { api } from "@/lib/api"
import {
  Blog,
  BlogCategory,
  BlogTag,
  BlogUser,
} from "@/lib/types"

import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

interface BlogFormProps {
  mode: "create" | "edit"
  blogSlug?: string
}

export function BlogForm({
  mode,
  blogSlug,
}: BlogFormProps) {
  const router = useRouter()

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [users, setUsers] = useState<BlogUser[]>([])

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)

  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")

  const [featuredImage, setFeaturedImage] = useState("")

  const [categoryId, setCategoryId] = useState("")
  const [authorId, setAuthorId] = useState("")

  const [status, setStatus] = useState("draft")
  const [featured, setFeatured] = useState(false)

  const [seoTitle, setSeoTitle] = useState("")
  const [seoDescription, setSeoDescription] = useState("")

  const [loading, setLoading] = useState(mode === "edit")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function loadOptions() {
      try {
        const [categoriesResponse, usersResponse] =
          await Promise.all([
            api.get<{ items: BlogCategory[] }>(
              "/blog-categories?limit=100"
            ),

            api.get<{ items: BlogUser[] }>(
              "/blog-users?limit=100"
            ),
          ])

        setCategories(categoriesResponse.items)
        setUsers(usersResponse.items)

        if (mode === "create") {
          if (categoriesResponse.items.length > 0) {
            setCategoryId(String(categoriesResponse.items[0].id))
          }

          if (usersResponse.items.length > 0) {
            setAuthorId(String(usersResponse.items[0].id))
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load form options"
        )
      }
    }

    loadOptions()
  }, [mode])

  useEffect(() => {
    if (mode !== "edit" || !blogSlug) {
      return
    }

    async function loadBlog() {
      try {
        setLoading(true)
        setError(null)

        const blog = await api.get<
          Blog & {
            tags?: { id: number }[]
            tagIds?: number[]
            seoTitle?: string
            seoDescription?: string
          }
        >(`/blogs/${blogSlug}`)

        setTitle(blog.title)
        setSlug(blog.slug)
        setSlugTouched(true)

        setExcerpt(blog.excerpt ?? "")
        setContent(blog.content ?? "")

        setFeaturedImage(blog.featuredImage ?? "")

        setCategoryId(String(blog.categoryId))
        setAuthorId(String(blog.authorId))

        setStatus(blog.status)
        setFeatured(blog.featured)

        setSeoTitle(blog.seoTitle ?? "")
        setSeoDescription(blog.seoDescription ?? "")
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load blog"
        )
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [mode, blogSlug])

  function handleTitleChange(value: string) {
    setTitle(value)

    if (!slugTouched) {
      setSlug(slugify(value))
    }

    if (!seoTitle) {
      setSeoTitle(value)
    }
  }

  function regenerateSlug() {
    setSlug(slugify(title))
    setSlugTouched(false)
  }

  async function handleSubmit(
    nextStatus?: string
  ) {
    setSaving(true)
    setSaved(false)
    setError(null)

    const finalStatus = nextStatus ?? status

    if (!title.trim()) {
      setError("Title is required.")
      setSaving(false)
      return
    }

    if (!slug.trim()) {
      setError("Slug is required.")
      setSaving(false)
      return
    }

    if (!content.trim()) {
      setError("Content is required.")
      setSaving(false)
      return
    }

    if (!categoryId) {
      setError("Please select a category.")
      setSaving(false)
      return
    }

    if (!authorId) {
      setError("Please select an author.")
      setSaving(false)
      return
    }

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || undefined,
      content,
      featuredImage: featuredImage.trim() || undefined,
      categoryId: Number(categoryId),
      authorId: Number(authorId),
      status: finalStatus,
      featured,
    }

    if (seoTitle.trim()) {
      payload.seoTitle = seoTitle.trim()
    }

    if (seoDescription.trim()) {
      payload.seoDescription = seoDescription.trim()
    }

    try {
      if (mode === "create") {
        payload.createdBy = Number(authorId)

        await api.post<Blog>("/blogs", payload)
      } else {
        payload.updatedBy = Number(authorId)

        await api.put<Blog>(
          `/blogs/${blogSlug}`,
          payload
        )
      }

      setStatus(finalStatus)
      setSaved(true)

      router.push("/admin/blogs")
      router.refresh()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save blog"
      )
    } finally {
      setSaving(false)
    }
  }

  function handlePreview() {
    if (!slug) {
      setError("Add a slug before previewing.")
      return
    }

    window.open(
      `/blog/${slug}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  function handleRemoveImage() {
    setFeaturedImage("")
  }

  const excerptCount = excerpt.length
  const seoTitleCount = seoTitle.length
  const seoDescriptionCount = seoDescription.length

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          String(category.id) === categoryId
      ),
    [categories, categoryId]
  )

  const selectedAuthor = useMemo(
    () =>
      users.find(
        (user) =>
          String(user.id) === authorId
      ),
    [users, authorId]
  )

  if (loading) {
    return (
      <main className="flex-1 p-5.5">
        <DashboardHeader
          title="Blogs"
          section="Admin / Content"
        />

        <div className="flex min-h-80 items-center justify-center">
          <p className="text-small text-muted-foreground">
            Loading blog...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-5.5">
      <div className="space-y-4">
        <DashboardHeader
          title="Blogs"
          section="Admin / Content"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
              {mode === "edit" ? "Edit Blog" : "Create Blog"}
            </h1>

            <span className="rounded-sm bg-muted px-2 py-0.75 font-mono text-caption font-semibold uppercase tracking-[0.04em] text-muted-foreground">
              {status}
            </span>

            {selectedCategory && (
              <span className="font-mono text-small text-subtle">
                {selectedCategory.name}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {saved && (
              <span className="text-small text-success">
                All changes saved
              </span>
            )}

            {error && (
              <span className="max-w-72 text-small text-error">
                {error}
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              className="h-9 px-3.5 text-small"
              disabled={saving}
              onClick={() =>
                handleSubmit("draft")
              }
            >
              {saving ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-9 px-3.5 text-small"
              onClick={handlePreview}
            >
              Preview
            </Button>

            <Button
              type="button"
              className="h-9 bg-primary px-4 text-small font-medium text-primary-foreground"
              disabled={saving}
              onClick={() =>
                handleSubmit("published")
              }
            >
              {saving ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-3.5">
            <section className="rounded-lg border border-border bg-card p-4.5">
              <Input
                value={title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
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
                  onChange={(event) => {
                    setSlug(event.target.value)
                    setSlugTouched(true)
                  }}
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
                    setExcerpt(
                      event.target.value
                    )
                  }
                  maxLength={200}
                  placeholder="One or two sentences shown on cards and in search results."
                  className="min-h-17.5 resize-y text-small leading-[1.5]"
                />
              </div>
            </section>

            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-3.5">
            <section className="rounded-lg border border-border bg-card p-4">
              <SectionTitle>
                Settings
              </SectionTitle>

              <div className="space-y-3.5">
                <div>
                  <label className="mb-1.5 block text-small font-medium text-text">
                    Status
                  </label>

                  <Select
                    value={status}
                    onValueChange={(value) =>
                      setStatus(value ?? "draft")
                    }
                  >
                    <SelectTrigger className="h-9 text-small">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="draft">
                        Draft
                      </SelectItem>

                      <SelectItem value="published">
                        Published
                      </SelectItem>

                      <SelectItem value="scheduled">
                        Scheduled
                      </SelectItem>

                      <SelectItem value="archived">
                        Archived
                      </SelectItem>

                      <SelectItem value="private">
                        Private
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
                      {categories.map(
                        (category) => (
                          <SelectItem
                            key={category.id}
                            value={String(
                              category.id
                            )}
                          >
                            {category.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-small font-medium text-text">
                    Author
                  </label>

                  <Select
                    value={authorId}
                    onValueChange={(value) =>
                      setAuthorId(value ?? "")
                    }
                  >
                    <SelectTrigger className="h-9 text-small">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>

                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem
                          key={user.id}
                          value={String(user.id)}
                        >
                          {user.firstName}{" "}
                          {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    onCheckedChange={
                      setFeatured
                    }
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <SectionTitle>
                Featured image
              </SectionTitle>

              {featuredImage ? (
                <>
                  <div className="overflow-hidden rounded-md border border-border">
                    <img
                      src={featuredImage}
                      alt={title || "Featured image"}
                      className="h-30 w-full object-cover"
                    />
                  </div>

                  <Input
                    value={featuredImage}
                    onChange={(event) =>
                      setFeaturedImage(
                        event.target.value
                      )
                    }
                    className="mt-2.5 h-8 text-caption"
                    placeholder="Featured image URL"
                  />

                  <div className="mt-2.5 flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 flex-1 text-caption"
                      onClick={() =>
                        document
                          .getElementById(
                            "featured-image-url"
                          )
                          ?.focus()
                      }
                    >
                      Replace
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 flex-1 border-error/30 text-caption text-error hover:bg-error/5 hover:text-error"
                      onClick={
                        handleRemoveImage
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-30 items-center justify-center rounded-md border border-dashed border-border bg-surface-alt">
                    <span className="text-small text-subtle">
                      No featured image
                    </span>
                  </div>

                  <Input
                    id="featured-image-url"
                    value={featuredImage}
                    onChange={(event) =>
                      setFeaturedImage(
                        event.target.value
                      )
                    }
                    placeholder="Paste image URL..."
                    className="mt-2.5 h-8 text-caption"
                  />
                </>
              )}
            </section>

            <section className="rounded-lg border border-border bg-card p-4">
              <SectionTitle>
                SEO
              </SectionTitle>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-small font-medium text-text">
                    SEO title
                  </label>

                  <span className="font-mono text-caption text-subtle">
                    {seoTitleCount} / 60
                  </span>
                </div>

                <Input
                  value={seoTitle}
                  maxLength={60}
                  onChange={(event) =>
                    setSeoTitle(
                      event.target.value
                    )
                  }
                  placeholder="SEO title"
                  className="mb-3.5 h-9 text-small"
                />

                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-small font-medium text-text">
                    SEO description
                  </label>

                  <span className="font-mono text-caption text-subtle">
                    {seoDescriptionCount} / 160
                  </span>
                </div>

                <Textarea
                  value={seoDescription}
                  maxLength={160}
                  onChange={(event) =>
                    setSeoDescription(
                      event.target.value
                    )
                  }
                  placeholder="SEO description"
                  className="min-h-16 resize-y text-small leading-[1.5]"
                />

                <div className="mt-3.5 rounded-md border border-border bg-surface-alt p-3">
                  <div className="mb-1 font-mono text-caption text-muted-foreground">
                    prose.dev › blog ›{" "}
                    {slug || "your-blog-slug"}
                  </div>

                  <div className="mb-0.75 line-clamp-2 text-[0.90625rem] leading-[1.3] text-accent-ink">
                    {seoTitle ||
                      title ||
                      "Your SEO title"}
                  </div>

                  <div className="line-clamp-3 text-small leading-[1.45] text-muted-foreground">
                    {seoDescription ||
                      excerpt ||
                      "Your SEO description"}
                  </div>
                </div>
              </div>
            </section>

            {selectedAuthor && (
              <section className="rounded-lg border border-border bg-card p-4">
                <SectionTitle>
                  Author
                </SectionTitle>

                <div className="text-small font-medium text-text">
                  {selectedAuthor.firstName}{" "}
                  {selectedAuthor.lastName}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
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