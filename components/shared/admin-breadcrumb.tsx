import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function AdminBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/admin">
            Admin
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          /
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink href="/admin/blogs">
            Blogs
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          /
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>
            Edit
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}