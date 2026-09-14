import Link from "next/link"

import { SiteHeader } from "@/components/layout/header"
import { SiteFooter } from "@/components/layout/footer"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL

  export const dynamic = "force-dynamic"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  status: "Published" | "Draft"
  featured: boolean
  featuredImage: string | null
  categoryId: string | null
  authorId: string | null
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  readTime: number
  category: {
    id: string
    name: string
    slug: string
  } | null
  author: {
    id: string
    name: string
    email: string
    image: string | null
  } | null
}

interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
  blogs: number
}

interface ArticlesResponse {
  data: Article[]
  page: number
  limit: number
  count: number
}

interface CategoriesResponse {
  data: Category[]
}

async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_URL}/api/articles?limit=50`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch articles")
    }

    const result: ArticlesResponse = await response.json()

    return result.data || []
  } catch (error) {
    console.error("Failed to fetch articles:", error)
    return []
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }

    const result: CategoriesResponse = await response.json()

    return result.data || []
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

function getReadTime(readTime: number) {
  return `${readTime} min read`
}

export default async function Home() {
  const [allArticles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ])

  const publishedArticles = allArticles.filter(
    (article) => article.status === "Published"
  )

  const featuredArticle =
    publishedArticles.find((article) => article.featured) || null

  const latestArticles = [...publishedArticles]
    .sort((a, b) => {
      const dateA = new Date(
        a.publishedAt || a.createdAt
      ).getTime()

      const dateB = new Date(
        b.publishedAt || b.createdAt
      ).getTime()

      return dateB - dateA
    })
    .slice(0, 3)

  return (
    <>
      <SiteHeader />

      <main>
        <section className="border-b border-border px-14 py-[5.25rem] pb-[4.75rem]">
          <div className="max-w-[47.5rem]">
            <div className="mb-4 font-mono text-caption tracking-[0.14em] text-accent uppercase">
              Engineering journal
            </div>

            <h1 className="mb-[1.125rem] max-w-[47.5rem] text-[3.625rem] leading-[1.06] font-semibold text-primary text-balance">
              Notes on building things for the web.
            </h1>

            <p className="mb-7 max-w-[35rem] text-h3 leading-[1.6] text-quaternary text-pretty">
              Long-form articles on TypeScript, Next.js, and the parts of
              full-stack work that nobody writes down. Published weekly, no
              newsletter required.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <Button
                className="h-11 rounded-md border border-primary px-[1.375rem] text-[0.90625rem] font-medium"
              >
                <Link href="/listing">Explore Articles</Link>
              </Button>

              <Button
                variant="outline"
                className="h-11 rounded-md border-border-strong bg-surface px-[1.375rem] text-[0.90625rem] font-medium text-text hover:bg-surface-alt"
              >
                <Link href="/listing">Browse Categories</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border px-14 py-16">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="m-0 font-mono text-caption font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Featured
            </h2>
          </div>

          {featuredArticle ? (
            <div className="grid grid-cols-[1.05fr_1fr] items-center gap-7 overflow-hidden rounded-lg border border-border bg-surface">
              <div
                className="relative flex h-80 items-end bg-[#111827] p-[1.125rem]"
                style={
                  featuredArticle.featuredImage
                    ? {
                        backgroundImage: `url(${featuredArticle.featuredImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {!featuredArticle.featuredImage && (
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, #1f2937 0px, #1f2937 12px, #111827 12px, #111827 24px)",
                    }}
                  />
                )}

                {!featuredArticle.featuredImage && (
                  <span className="relative font-mono text-caption tracking-[0.08em] text-gray-400">
                    1600 × 900 · FEATURED IMAGE
                  </span>
                )}
              </div>

              <div className="py-7 pr-8">
                {featuredArticle.category && (
                  <Badge
                    variant="featured"
                    className="mb-3.5 rounded-sm border-0 bg-accent-soft px-[0.5625rem] py-1 text-[0.6875rem] font-semibold tracking-[0.05em] text-accent-ink uppercase hover:bg-accent-soft"
                  >
                    {featuredArticle.category.name}
                  </Badge>
                )}

                <h3 className="mb-3 text-[1.8125rem] leading-[1.15] font-semibold tracking-wide text-primary">
                  {featuredArticle.title}
                </h3>

                <p className="mb-5 max-w-[38rem] text-body leading-[1.6] text-quaternary text-pretty tracking-wide">
                  {featuredArticle.excerpt}
                </p>

                <div className="mb-[1.375rem] flex flex-wrap items-center gap-2.5 text-small text-muted-foreground">
                  <UserAvatar
                    name={featuredArticle.author?.name || "Unknown"}
                    size="sm"
                  />

                  <span className="font-medium text-text">
                    {featuredArticle.author?.name || "Unknown"}
                  </span>

                  <span>·</span>

                  <span>
                    {formatDate(
                      featuredArticle.publishedAt ||
                        featuredArticle.createdAt
                    )}
                  </span>

                  <span>·</span>

                  <span>
                    {getReadTime(featuredArticle.readTime)}
                  </span>
                </div>

                <Button className="h-10 rounded-md bg-primary px-[1.125rem] text-sm font-medium text-primary-foreground">
                  <Link href={`/blog/${featuredArticle.slug}`}>
                    Read Article →
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-10 text-center">
              <p className="text-body text-muted-foreground">
                No featured article available.
              </p>
            </div>
          )}
        </section>

        <section className="border-b border-border px-14 py-16">
          <div className="mb-[1.375rem] flex items-baseline justify-between gap-4">
            <h2 className="m-0 text-h2 font-semibold tracking-wide">
              Latest articles
            </h2>

            <Link
              href="/listing"
              className="text-small text-text hover:text-accent-ink hover:underline hover:underline-offset-4"
            >
              View all →
            </Link>
          </div>

          {latestArticles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="h-auto min-h-[20rem] w-full justify-start whitespace-normal rounded-lg border border-border bg-surface p-0 text-left transition-colors hover:border-primary hover:bg-surface"
                >
                  <div
                    className="relative flex h-40 items-center justify-center border-b border-border bg-muted"
                    style={
                      article.featuredImage
                        ? {
                            backgroundImage: `url(${article.featuredImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    {!article.featuredImage && (
                      <span className="font-mono text-caption tracking-[0.08em] text-subtle">
                        800 × 450
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-[0.5625rem] px-4 pt-4 pb-[1.125rem]">
                    {article.category && (
                      <span className="font-mono text-caption tracking-[0.1em] text-accent-ink uppercase">
                        {article.category.name}
                      </span>
                    )}

                    <h3 className="m-0 text-[1.0625rem] leading-[1.3] font-semibold tracking-wide text-primary">
                      {article.title}
                    </h3>

                    <p className="m-0 text-sm leading-[1.55] text-muted-foreground text-pretty">
                      {article.excerpt}
                    </p>

                    <div className="mt-auto flex items-center gap-2 pt-3 text-[0.78125rem] text-text-subtle">
                      <span className="text-text">
                        {article.author?.name || "Unknown"}
                      </span>

                      <span className="text-subtle">·</span>

                      <span className="text-subtle">
                        {formatDate(
                          article.publishedAt ||
                            article.createdAt
                        )}
                      </span>

                      <span className="text-subtle">·</span>

                      <span className="text-subtle">
                        {getReadTime(article.readTime)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-surface p-10 text-center">
              <p className="text-body text-muted-foreground">
                No published articles available.
              </p>
            </div>
          )}
        </section>

        <section className="border-b border-border px-14 py-16">
          <h2 className="mb-1.5 text-h2 font-semibold tracking-wide">
            Browse by category
          </h2>

          <p className="mb-5 text-body text-muted-foreground">
            Five running threads. Pick one and read backwards.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/listing?category=${category.slug}`}
                className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text transition-colors hover:border-primary"
              >
                <span>{category.name}</span>

                <span className="font-mono text-caption leading-none text-subtle">
                  {category.blogs}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-b border-border px-14 py-16">
          <div className="grid grid-cols-[1.05fr_1fr] items-center gap-7 rounded-lg bg-primary p-10">
            <div>
              <h2 className="mb-2.5 text-2xl font-semibold tracking-wide text-primary-foreground">
                One email, every other Friday.
              </h2>

              <p className="text-body leading-[1.55] text-gray-400">
                New articles and the occasional half-finished idea. Unsubscribe
                whenever.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Input
                type="email"
                placeholder="you@company.com"
                className="h-11 min-w-[180px] flex-1 border-gray-700 bg-gray-800 px-3.5 text-sm text-gray-50 placeholder:text-gray-400"
              />

              <Button className="h-11 rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent-ink">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}