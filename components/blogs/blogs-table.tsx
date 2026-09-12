"use client"

import * as React from "react"
import {
  Copy,
  Ellipsis,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"

import type { Blog } from "@/app/(dashboard)/admin/blogs/page"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DeleteDialog } from "./delete-dialog"
// import { BlogPagination } from "@/components/shared/blog-pagination"

interface BlogsTableProps {
  blogs: Blog[]
  totalBlogs: number
  loading?: boolean
  onEdit: (blog: Blog) => void
  onDelete: (id: string) => void
  onDuplicate: (blog: Blog) => void
  onTogglePublish: (blog: Blog) => void
}

export function BlogsTable({
  blogs,
  totalBlogs,
  loading,
  onEdit,
  onDelete,
  onDuplicate,
  onTogglePublish,
}: BlogsTableProps) {
  const [selected, setSelected] = React.useState<string[]>([])
  const [deleteBlog, setDeleteBlog] = React.useState<Blog | null>(null)

  const allSelected =
    blogs.length > 0 && selected.length === blogs.length

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelected(blogs.map((blog) => blog.id))
    } else {
      setSelected([])
    }
  }

  function toggleBlog(id: string, checked: boolean) {
    setSelected((current) =>
      checked
        ? [...current, id]
        : current.filter((item) => item !== id)
    )
  }

  function confirmDelete() {
    if (!deleteBlog) return

    onDelete(deleteBlog.id)

    setSelected((current) =>
      current.filter((id) => id !== deleteBlog.id)
    )

    setDeleteBlog(null)
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <Table className="min-w-[65rem]">
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
                <TableHead className="h-[2.5rem] w-[3rem] px-[0.9375rem]">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      toggleAll(checked === true)
                    }
                    aria-label="Select all blogs"
                  />
                </TableHead>

                <TableHead className="h-[2.5rem] px-[0.5rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  Title
                </TableHead>

                <TableHead className="h-[2.5rem] w-[8.125rem] px-[0.5rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  Category
                </TableHead>

                <TableHead className="h-[2.5rem] w-[8.125rem] px-[0.5rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  Status
                </TableHead>

                <TableHead className="h-[2.5rem] w-[8.125rem] px-[0.5rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  Author
                </TableHead>

                <TableHead className="h-[2.5rem] w-[8.125rem] px-[0.5rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    Created
                  </span>
                </TableHead>

                <TableHead className="h-[2.5rem] w-[8.125rem] px-[0.5rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  Updated
                </TableHead>

                <TableHead className="h-[2.5rem] w-[3.5rem] px-[0.5rem] text-center font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
                  ...
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-[12rem] text-center text-small text-muted-foreground"
                  >
                    Loading blogs...
                  </TableCell>
                </TableRow>
              ) : blogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-[12rem] text-center text-small text-muted-foreground"
                  >
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                blogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    className="border-b border-border hover:bg-muted/20"
                  >
                    <TableCell className="px-[0.9375rem] py-1">
                      <Checkbox
                        checked={selected.includes(blog.id)}
                        onCheckedChange={(checked) =>
                          toggleBlog(blog.id, checked === true)
                        }
                        aria-label={`Select ${blog.title}`}
                      />
                    </TableCell>

                    <TableCell className="px-[0.5rem] py-[0.6875rem]">
                      <div className="flex min-w-0 items-center gap-[0.75rem]">
                        
                        <div className="min-w-0 max-w-[23rem]">
                          <div className="line-clamp-2 text-[0.8125rem] font-semibold leading-[1.25rem] text-primary">
                            {blog.title}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-[0.5rem] py-[0.6875rem] text-[0.8125rem] text-muted-foreground">
                      {blog.category}
                    </TableCell>

                    <TableCell className="px-[0.5rem] py-[0.6875rem]">
                      {blog.status === "Published" ? (
                        <Badge
                          variant="published"
                          className="rounded-[0.25rem] border-transparent bg-green-50 px-[0.5rem] py-[0.1875rem] text-[0.656rem] font-semibold tracking-[0.05em] text-green-700 uppercase hover:bg-green-50"
                        >
                          Published
                        </Badge>
                      ) : (
                        <Badge
                          variant="draft"
                          className="rounded-[0.25rem] border-transparent bg-muted px-[0.5rem] py-[0.1875rem] text-[0.656rem] font-semibold tracking-[0.05em] text-muted-foreground uppercase hover:bg-muted"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="px-[0.5rem] py-[0.6875rem] text-[0.8125rem] text-muted-foreground">
                      {blog.author}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-[0.5rem] py-[0.6875rem] text-[0.8125rem] text-muted-foreground">
                      {blog.created}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-[0.5rem] py-[0.6875rem] text-[0.8125rem] text-muted-foreground">
                      {blog.updated}
                    </TableCell>

                    <TableCell className="px-[0.5rem] py-[0.6875rem] text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex size-[1.75rem] items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted focus:bg-muted data-[state=open]:bg-muted"
                          aria-label={`Actions for ${blog.title}`}
                        >
                          <Ellipsis className="size-[0.875rem]" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-[10rem]"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `/blog/${blog.slug}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                          >
                            <Eye />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onEdit(blog)}
                          >
                            <Pencil />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onDuplicate(blog)}
                          >
                            <Copy />
                            Duplicate
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onTogglePublish(blog)}
                          >
                            {blog.status === "Published"
                              ? "Unpublish"
                              : "Publish"}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteBlog(blog)}
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>

      <DeleteDialog
        open={deleteBlog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteBlog(null)
          }
        }}
        blog={deleteBlog}
        onConfirm={confirmDelete}
      />
    </>
  )
}