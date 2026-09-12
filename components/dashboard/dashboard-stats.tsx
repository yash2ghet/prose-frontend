"use client"

export interface DashboardStatsData {
  totalArticles: number
  published: number
  drafts: number
  categories: number
}

interface DashboardStatsProps {
  stats: DashboardStatsData | null
  loading?: boolean
}

export function DashboardStats({ stats, loading }: DashboardStatsProps) {
  const items = [
    {
      label: "Total blogs",
      value: stats?.totalArticles ?? 0,
      description: "Across all categories",
    },
    {
      label: "Published",
      value: stats?.published ?? 0,
      description: "Live on the site",
    },
    {
      label: "Drafts",
      value: stats?.drafts ?? 0,
      description: "Awaiting review",
    },
    {
      label: "Categories",
      value: stats?.categories ?? 0,
      description: "Across all articles",
    },
  ]

  return (
    <div className="mb-[1.625rem] grid grid-cols-1 gap-[0.875rem] sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <div className="mb-[0.625rem] font-mono text-caption uppercase tracking-[0.09em] text-muted-foreground">
            {stat.label}
          </div>

          <div className="text-[1.875rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
            {loading ? "—" : stat.value}
          </div>

          <div className="mt-2 text-small text-muted-foreground">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  )
}
