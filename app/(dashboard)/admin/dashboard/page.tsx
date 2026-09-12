"use client"

import * as React from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import {
  DashboardStats,
  type DashboardStatsData,
} from "@/components/dashboard/dashboard-stats"
import {
  RecentBlogsTable,
  type RecentArticle,
} from "@/components/dashboard/recent-blogs-table"

import { api } from "@/lib/api"

interface DashboardResponse {
  data: {
    stats: DashboardStatsData
    recentArticles: RecentArticle[]
  }
}

export default function DashboardPage() {
  const [stats, setStats] = React.useState<DashboardStatsData | null>(
    null
  )

  const [recentArticles, setRecentArticles] = React.useState<
    RecentArticle[]
  >([])

  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      try {
        setLoading(true)

        const result = await api.get<DashboardResponse>(
          "/api/dashboard"
        )

        if (!cancelled) {
          setStats(result.data.stats)
          setRecentArticles(result.data.recentArticles || [])
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        section="Admin"
      />

      <div className="flex-1 p-[1.375rem]">
        <DashboardStats stats={stats} loading={loading} />

        <RecentBlogsTable
          articles={recentArticles}
          loading={loading}
        />
      </div>
    </div>
  )
}
