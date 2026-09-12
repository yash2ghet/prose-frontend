"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { BlogPagination } from "@/components/shared/blog-pagination";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const ARTICLES_PER_PAGE = 6;

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "Published" | "Draft";
  featured: boolean;
  featuredImage: string | null;
  categoryId: string | null;
  authorId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: number;

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  author: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  blogs: number;
}

interface ArticlesResponse {
  data: Article[];
  page: number;
  limit: number;
  count: number;
  // totalPages: number;
}

interface CategoriesResponse {
  data: Category[];
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function getReadTime(readTime: number) {
  return `${readTime} min read`;
}

async function getArticles({
  search,
  category,
  sort,
  page,
}: {
  search: string;
  category: string;
  sort: string;
  page: number;
}): Promise<ArticlesResponse> {
  try {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(ARTICLES_PER_PAGE));

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category && category !== "All categories") {
      params.set("category", category);
    }

    if (sort && sort !== "newest") {
      params.set("sort", sort);
    }

    const response = await fetch(
      `${API_URL}/api/articles?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const result: ArticlesResponse = await response.json();

    return {
      data: result.data || [],
      page: result.page || page,
      limit: result.limit || ARTICLES_PER_PAGE,
      count: result.count || 0,
    };
  } catch (error) {
    console.error("Failed to fetch articles:", error);

    return {
      data: [],
      page,
      limit: ARTICLES_PER_PAGE,
      count: 0,
    };
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/categories`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const result: CategoriesResponse = await response.json();

    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default function BlogsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "All categories";
  const sort = searchParams.get("sort") ?? "newest";

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page") ?? "1")
  );

  const [searchValue, setSearchValue] = React.useState(search);

  const [articles, setArticles] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  const [totalArticles, setTotalArticles] = React.useState(0);

  const [loading, setLoading] = React.useState(true);
  const [categoryLoading, setCategoryLoading] =
    React.useState(true);

  React.useEffect(() => {
    setSearchValue(search);
  }, [search]);


  React.useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        setCategoryLoading(true);

        const result = await getCategories();

        if (!cancelled) {
          setCategories(result);
        }
      } finally {
        if (!cancelled) {
          setCategoryLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadArticles() {
      try {
        setLoading(true);

        const result = await getArticles({
          search,
          category,
          sort,
          page: currentPage,
        });

        if (!cancelled) {
          setArticles(result.data);
          setTotalArticles(result.count);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadArticles();

    return () => {
      cancelled = true;
    };
  }, [search, category, sort, currentPage]);

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();

      router.push(
        queryString
          ? `${pathname}?${queryString}`
          : pathname
      );
    },
    [pathname, router, searchParams]
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== search) {
        updateParams({
          search: searchValue.trim() || null,
          page: "1",
        });
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    searchValue,
    search,
    updateParams,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalArticles / ARTICLES_PER_PAGE)
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  return (
    <>
      <SiteHeader />

      <main>
        <section className="px-14 py-16">
          <div className="mb-[1.625rem]">
            <h1 className="mb-2 text-h1 leading-none font-semibold tracking-wide">
              Latest Articles
            </h1>

            <p className="max-w-[32.5rem] text-body tracking-wide text-muted-foreground">
              Everything published so far, newest first.
              Filter by category or search the archive.
            </p>
          </div>

          <div className="mb-2.5 grid grid-cols-[1fr_190px_210px] gap-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-small text-subtle size-3" />

              <Input
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Search articles…"
                className="h-10 border-[#d1d5db] bg-surface pl-8 text-sm"
              />
            </div>

            <Select
              value={category}
              onValueChange={(value) =>
                updateParams({
                  category:
                    value === "All categories"
                      ? null
                      : value,
                  page: "1",
                })
              }
              disabled={categoryLoading}
            >
              <SelectTrigger className="h-10 w-full rounded-md border-[#d1d5db] bg-surface px-2.5 text-sm text-text hover:border-primary focus-visible:border-primary focus-visible:ring-0">
                <SelectValue
                  placeholder="All categories"
                />
              </SelectTrigger>

              <SelectContent
                align="start"
                className="rounded-md border border-[#d1d5db] bg-surface p-1 shadow-md"
              >
                <SelectItem
                  value="All categories"
                  className="rounded-sm px-2.5 py-2 text-sm text-text hover:bg-primary/10 focus:bg-primary/10"
                >
                  All categories
                </SelectItem>

                {categories.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.slug}
                    className="rounded-sm px-2.5 py-2 text-sm text-text hover:bg-primary/10 focus:bg-primary/10"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(value) =>
                updateParams({
                  sort:
                    value === "newest"
                      ? null
                      : value,
                  page: "1",
                })
              }
            >
              <SelectTrigger className="h-10 w-full rounded-md border-[#d1d5db] bg-surface px-2.5 text-sm text-text hover:border-primary focus-visible:border-primary focus-visible:ring-0">
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                align="start"
                className="w-[var(--anchor-width)] rounded-md border border-[#d1d5db] bg-surface p-1 shadow-md"
              >
                <SelectItem
                  value="newest"
                  className="rounded-sm px-2.5 py-2 text-sm text-text hover:bg-primary/10 focus:bg-primary/10"
                >
                  Newest first
                </SelectItem>

                <SelectItem
                  value="oldest"
                  className="rounded-sm px-2.5 py-2 text-sm text-text hover:bg-primary/10 focus:bg-primary/10"
                >
                  Oldest first
                </SelectItem>

                <SelectItem
                  value="updated"
                  className="rounded-sm px-2.5 py-2 text-sm text-text hover:bg-primary/10 focus:bg-primary/10"
                >
                  Most recently updated
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-[1.375rem] font-mono text-caption tracking-widest text-subtle">
            {totalArticles}{" "}
            {totalArticles === 1
              ? "article"
              : "articles"}{" "}
            · page {safeCurrentPage} of {totalPages}
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: ARTICLES_PER_PAGE }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex min-h-[20rem] flex-col overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    <div className="h-40 animate-pulse border-b border-border bg-muted" />

                    <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-[1.125rem]">
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />

                      <div className="h-5 w-full animate-pulse rounded bg-muted" />

                      <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />

                      <div className="mt-auto h-3 w-3/5 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                )
              )}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="flex min-h-[20rem] w-full flex-col overflow-hidden rounded-lg border border-border bg-surface p-0 text-left transition-colors hover:border-primary"
                >
                  <div
                    className="relative flex h-40 items-center justify-center border-b border-border bg-muted"
                    style={
                      article.featuredImage
                        ? {
                            backgroundImage: `url(${article.featuredImage})`,
                            backgroundSize: "cover",
                            backgroundPosition:
                              "center",
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
                      {article.excerpt ||
                        "No description available."}
                    </p>

                    <div className="mt-auto flex items-center gap-2 pt-3 text-[0.78125rem] text-text-subtle">
                      <span className="text-text">
                        {article.author?.name ||
                          "Unknown"}
                      </span>

                      <span className="text-subtle">
                        ·
                      </span>

                      <span className="text-subtle">
                        {formatDate(
                          article.publishedAt ||
                            article.createdAt
                        )}
                      </span>

                      <span className="text-subtle">
                        ·
                      </span>

                      <span className="text-subtle">
                        {getReadTime(
                          article.readTime
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-border bg-surface px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No articles found.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-9 flex justify-center">
              <BlogPagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}