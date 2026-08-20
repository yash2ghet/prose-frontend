import { Badge } from "@/components/ui/badge"

type StatusBadgeProps = {
  status: "published" | "draft" | "featured" | "error" | "warning"
}

const statusLabels = {
  published: "Published",
  draft: "Draft",
  featured: "Featured",
  error: "Error",
  warning: "Warning",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status}>
      {statusLabels[status]}
    </Badge>
  )
}