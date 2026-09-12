import Link from "next/link"

import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"

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
  readTime: string
  category: BlogCategory | null
  author: BlogAuthor | null
}

interface BlogResponse {
  data: Blog
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080"

async function getBlog(slug: string): Promise<Blog> {
  const response = await fetch(
    `${API_URL}/api/articles/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Article not found")
    }

    throw new Error("Failed to fetch article")
  }

  const data: BlogResponse = await response.json()

  return data.data
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let article: Blog

  try {
    article = await getBlog(slug)
  } catch {
    return (
      <>
        <SiteHeader />

        <main className="mx-auto max-w-[50rem] px-6 py-20">
          <h1 className="text-display text-primary">
            Article not found
          </h1>

          <p className="mt-3 text-body text-muted-foreground">
            This article does not exist or has not been published.
          </p>

          <Link
            href="/blog"
            className="mt-6 inline-block text-small text-accent-ink hover:underline"
          >
            ← Back to Blogs
          </Link>
        </main>

        <SiteFooter />
      </>
    )
  }

  const authorName =
    article.author?.name || "Unknown author"

  const categoryName =
    article.category?.name || "Uncategorized"

  const publishedDate =
    article.publishedAt || article.createdAt

  return (
    <>
      <SiteHeader />

      <main>
        <article className="mx-auto max-w-[50rem] px-6 pt-10 pb-20">
          <Link
            href="/blog"
            className="text-small text-muted-foreground hover:underline hover:underline-offset-4"
          >
            ← Back to Blogs
          </Link>

          <header className="mt-[1.625rem]">
            <Badge
              variant="featured"
              className="rounded-sm border-0 bg-accent-soft px-[0.5625rem] py-1 text-caption font-semibold tracking-[0.05em] text-accent-ink uppercase hover:bg-accent-soft"
            >
              {categoryName}
            </Badge>

            <h1 className="mt-4 mb-3.5 text-display leading-[1.1] text-primary text-balance tracking-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="mb-[1.375rem] text-[1.125rem] leading-[1.55] text-quaternary text-pretty tracking-tight">
                {article.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2.5 border-b border-border pb-6 text-small text-muted-foreground">
              <UserAvatar
                name={authorName}
                size="sm"
              />

              <span className="font-medium text-text">
                {authorName}
              </span>

              <span>·</span>

              <span>
                {formatDate(publishedDate)}
              </span>

              <span>·</span>

              <span>{article.readTime}</span>
            </div>
          </header>

          <div className="blog-featured-image relative my-[1.625rem] flex min-h-[23.75rem] items-end overflow-hidden rounded-lg bg-muted">
            {article.featuredImage ? (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, #1f2937 0px, #1f2937 12px, #111827 12px, #111827 24px)",
                }}
              />
            )}

            {!article.featuredImage && (
              <span className="relative p-4 font-mono text-caption tracking-[0.08em] text-gray-400">
                1600 × 900 · FEATURED IMAGE
              </span>
            )}
          </div>

          <div
            className="font-serif text-article leading-[1.72] text-text"
            dangerouslySetInnerHTML={{
              __html: article.content,
            }}
          />

          <section className="mt-11 flex items-start gap-4 rounded-lg border border-border bg-surface-alt p-5">
            <UserAvatar
              name={authorName}
              size="lg"
            />

            <div>
              <h2 className="mb-1 text-[0.9375rem] font-semibold text-primary">
                {authorName}
              </h2>

              <p className="m-0 text-sm leading-[1.55] text-muted-foreground">
                {article.author?.email ||
                  "Author of this article."}
              </p>
            </div>
          </section>

          <section className="mt-11">
            <Link
              href="/blog"
              className="inline-flex h-10 items-center rounded-md border border-border-strong bg-surface px-[1.125rem] text-sm font-medium text-text transition-colors hover:bg-surface-alt"
            >
              ← Back to Blogs
            </Link>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  )
}