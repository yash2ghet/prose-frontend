import Link from "next/link";

const categories = [
  "Technology",
  "Development",
  "Design",
  "Business",
  "Tutorials",
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-alt px-14 py-16">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-8">
        <div>
          <div className="mb-3 flex items-center gap-[0.5625rem]">
            <span className="inline-flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-sm bg-primary text-xs font-bold text-accent">
              P
            </span>

            <span className="text-[0.9375rem] font-semibold">
              Prose
            </span>
          </div>

          <p className="mb-3.5 max-w-[17.5rem] text-small leading-[1.6] text-muted-foreground tracking-wide">
            An engineering journal about full-stack work, published from a
            small CMS built for the purpose.
          </p>

          <div className="flex gap-2">
            <a
              href="#"
              aria-label="X"
              className="inline-flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-md border border-border font-mono text-caption text-subtle transition-colors hover:border-primary hover:text-primary"
            >
              X
            </a>

            <a
              href="#"
              aria-label="GitHub"
              className="inline-flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-md border border-border font-mono text-caption text-subtle transition-colors hover:border-primary hover:text-primary"
            >
              GH
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="inline-flex h-[1.875rem] w-[1.875rem] items-center justify-center rounded-md border border-border font-mono text-[0.625rem] text-subtle transition-colors hover:border-primary hover:text-primary"
            >
              in
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="mb-0.5 font-mono text-caption tracking-[0.12em] text-subtle uppercase">
            Navigate
          </span>

          <Link
            href="/"
            className="text-[0.84375rem] text-text transition-colors hover:underline hover:underline-offset-4"
          >
            Home
          </Link>

          <Link
            href="/listing"
            className="text-[0.84375rem] text-text transition-colors hover:underline hover:underline-offset-4"
          >
            All articles
          </Link>

          <Link
            href="/login"
            className="text-[0.84375rem] text-text transition-colors hover:underline hover:underline-offset-4"
          >
            Admin
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="mb-0.5 font-mono text-caption tracking-[0.12em] text-subtle uppercase">
            Categories
          </span>

          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className="text-[0.84375rem] text-text transition-colors hover:underline hover:underline-offset-4"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-[2.125rem] border-t border-border pt-[1.125rem] text-[0.78125rem] text-subtle">
        © 2026 Prose. All rights reserved.
      </div>
    </footer>
  );
}