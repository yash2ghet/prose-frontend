"use client"

import Link from "next/link"
import { Search, X } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-6 border-b border-border bg-background/94 px-14 backdrop-blur-[6px]">

      <Link
        href="/admin/dashboard"
        className="flex items-center gap-[0.5625rem]"
      >
        <span className="inline-flex size-[1.375rem] items-center justify-center rounded-sm bg-primary text-[0.75rem] font-bold text-accent">
          P
        </span>

        <span className="text-base font-semibold tracking-[-0.01em] text-text">
          Prose
        </span>
      </Link>

      <nav className="flex items-center gap-[1.625rem] text-sm text-text">
        <Link
          href="/"
          className="transition-all hover:text-text hover:underline hover:underline-offset-4"
        >
          Home
        </Link>

        <Link
          href="/listing"
          className="transition-all hover:text-text hover:underline hover:underline-offset-4"
        >
          Listing
        </Link>
      </nav>

      <div className="flex items-center gap-2.5">

        {searchOpen ? (
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3">
            <Search className="size-3.5 text-text-muted" />

            <input
              autoFocus
              type="search"
              placeholder="Search..."
              className="w-32 bg-transparent text-[0.8125rem] text-text outline-none placeholder:text-text-muted"
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-text-muted transition-colors hover:text-text"
              aria-label="Close search"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-md",
              "border border-border bg-surface-alt px-3",
              "text-[0.8125rem] text-text-muted",
              "transition-colors hover:bg-surface hover:text-text"
            )}
          >
            <Search className="size-3.5" />
            <span>Search</span>
          </button>
        )}

      </div>
    </header>
  )
}