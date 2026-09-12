"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export interface Category {
  id: string
  name: string
  slug: string
  blogs: number
  created: string
}

interface CategoriesTableProps {
  categories: Category[]
  loading?: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function CategoriesTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="overflow-x-auto">
        <Table className="min-w-[40rem]">
          <TableHeader>
            <TableRow className="bg-surface-alt hover:bg-surface-alt">
              <TableHead className="h-auto px-[0.875rem] py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Name
              </TableHead>

              <TableHead className="h-auto px-[0.875rem] py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Slug
              </TableHead>

              <TableHead className="h-auto px-[0.875rem] py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Blogs
              </TableHead>

              <TableHead className="h-auto px-[0.875rem] py-[0.5625rem] font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Created
              </TableHead>

              <TableHead className="h-auto px-[0.875rem] py-[0.5625rem] text-right font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                className="border-b border-border hover:bg-transparent"
              >
                <TableCell className="px-[0.875rem] py-[0.5625rem] text-[0.84375rem] font-medium text-foreground">
                  {category.name}
                </TableCell>

                <TableCell className="px-[0.875rem] py-[0.5625rem] font-mono text-[0.78125rem] text-muted-foreground">
                  {category.slug}
                </TableCell>

                <TableCell className="px-[0.875rem] py-[0.5625rem] text-[0.8125rem] text-muted-foreground">
                  {category.blogs}
                </TableCell>

                <TableCell className="whitespace-nowrap px-[0.875rem] py-[0.5625rem] text-[0.8125rem] text-muted-foreground">
                  {category.created}
                </TableCell>

                <TableCell className="px-[0.875rem] py-[0.5625rem] text-right">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onEdit(category)}
                    className="mr-1.5 h-7 rounded-[0.3125rem] px-2.5 text-[0.78125rem] font-normal text-text"
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onDelete(category)}
                    className="h-7 rounded-[0.3125rem] border-red-200 px-2.5 text-[0.78125rem] font-normal text-red-700 hover:bg-red-50 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {!loading && categories.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-small text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}

            {loading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-small text-muted-foreground"
                >
                  Loading categories...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}