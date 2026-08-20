import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyTitle,
} from "@/components/ui/empty"

type EmptyBlogsProps = {
  onCreate?: () => void
}

export function EmptyBlogs({ onCreate }: EmptyBlogsProps) {
  return (
    <Empty>
      <EmptyTitle>No blogs yet.</EmptyTitle>

      <EmptyDescription>
        Create your first blog to get started.
      </EmptyDescription>

      <Button
        size="sm"
        onClick={onCreate}
      >
        Create your first blog
      </Button>
    </Empty>
  )
}