import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type BlogPaginationProps = {
  currentPage: number
  totalPages: number
}

export function BlogPagination({
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  return (
    <Pagination className="mx-0 justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Math.max(1, currentPage - 1)}`}
          />
        </PaginationItem>

        {Array.from(
          { length: totalPages },
          (_, index) => index + 1
        ).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`?page=${page}`}
              isActive={page === currentPage}
              className="size-[2rem]"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={`?page=${Math.min(
              totalPages,
              currentPage + 1
            )}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}