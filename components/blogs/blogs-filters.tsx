"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BlogsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function BlogsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  categories,
}: BlogsFiltersProps) {
  return (
    <div className="mb-[1.625rem] grid grid-cols-[minmax(0,1fr)_7rem_7.625rem_5.8125rem] gap-[0.5rem]">
      <div className="relative min-w-0">
        <Search className="pointer-events-none absolute left-[0.6875rem] top-1/2 size-[0.75rem] -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search blogs..."
          className="h-[2.25rem] border-[#d1d5db] bg-surface pl-[1.875rem] text-small placeholder:text-muted-foreground/70"
        />
      </div>

      <Select
        value={status}
        onValueChange={(value) =>
            onStatusChange(value ?? "All statuses")
        }
      >
        <SelectTrigger className="h-[2.25rem] w-full rounded-md border-[#d1d5db] bg-surface px-[0.6875rem] text-small text-text hover:border-primary focus-visible:border-primary focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          align="start"
          className="w-[var(--anchor-width)] rounded-md border border-[#d1d5db] bg-surface p-1 shadow-md"
        >
          <SelectItem
            value="All statuses"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            All statuses
          </SelectItem>

          <SelectItem
            value="Published"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            Published
          </SelectItem>

          <SelectItem
            value="Draft"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            Draft
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={category}
        onValueChange={(value) =>
            onCategoryChange(value ?? "All categories")
        }
      >
        <SelectTrigger className="h-[2.25rem] w-full rounded-md border-[#d1d5db] bg-surface px-[0.6875rem] text-small text-text hover:border-primary focus-visible:border-primary focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          align="start"
          className="w-[var(--anchor-width)] rounded-md border border-[#d1d5db] bg-surface p-1 shadow-md"
        >
          {categories.map((item) => (
            <SelectItem
              key={item}
              value={item}
              className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
            >
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue="all">
        <SelectTrigger className="h-[2.25rem] w-full rounded-md border-[#d1d5db] bg-surface px-[0.6875rem] text-small text-text hover:border-primary focus-visible:border-primary focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>

        <SelectContent
          align="end"
          className="w-[var(--anchor-width)] rounded-md border border-[#d1d5db] bg-surface p-1 shadow-md"
        >
          <SelectItem
            value="all"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            All columns
          </SelectItem>

          <SelectItem
            value="title"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            Title
          </SelectItem>

          <SelectItem
            value="category"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            Category
          </SelectItem>

          <SelectItem
            value="author"
            className="rounded-sm px-[0.625rem] py-[0.5rem] text-small text-text hover:bg-primary/10 focus:bg-primary/10"
          >
            Author
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}