"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface RecentArticle {
  id: string
  title: string
  category: string | null
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

interface RecentBlogsTableProps {
  articles: RecentArticle[]
  loading?: boolean
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export function RecentBlogsTable({
  articles,
  loading,
}: RecentBlogsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-[0.875rem]">
        <h2 className="m-0 text-body font-semibold text-primary">
          Recent blogs
        </h2>

        <Link href="/admin/blogs">
          <Button
            variant="ghost"
            className="h-auto p-0 text-body font-normal text-accent-ink hover:bg-transparent hover:text-accent-ink hover:underline hover:underline-offset-4"
          >
            View all →
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[40rem]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="h-auto px-4 py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Blog
              </TableHead>

              <TableHead className="h-auto px-4 py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Category
              </TableHead>

              <TableHead className="h-auto px-4 py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Status
              </TableHead>

              <TableHead className="h-auto px-4 py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Created
              </TableHead>

              <TableHead className="h-auto px-4 py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Updated
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-6 text-center text-small text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-6 text-center text-small text-muted-foreground"
                >
                  No blogs yet.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow
                  key={article.id}
                  className="border-b border-border hover:bg-transparent"
                >
                  <TableCell className="max-w-[20rem] truncate px-4 py-[0.5625rem] text-small font-medium text-primary">
                    {article.title}
                  </TableCell>

                  <TableCell className="px-4 py-[0.5625rem] text-small text-muted-foreground">
                    {article.category || "Uncategorized"}
                  </TableCell>

                  <TableCell className="px-4 py-[0.5625rem]">
                    {article.status === "published" ? (
                      <Badge
                        variant="published"
                        className="rounded-[0.25rem] border-transparent bg-green-50 px-2 py-[0.1875rem] text-caption font-semibold tracking-[0.04em] text-green-700 uppercase hover:bg-green-50"
                      >
                        Published
                      </Badge>
                    ) : (
                      <Badge
                        variant="draft"
                        className="rounded-[0.25rem] border-transparent bg-muted px-2 py-[0.1875rem] text-caption font-semibold tracking-[0.04em] text-muted-foreground uppercase hover:bg-muted"
                      >
                        Draft
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-4 py-[0.5625rem] text-[0.8125rem] text-muted-foreground">
                    {formatDate(article.createdAt)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap px-4 py-[0.5625rem] text-[0.8125rem] text-muted-foreground">
                    {formatDate(article.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
