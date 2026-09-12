export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  status: string
  featured: boolean
  featuredImage: string | null
  categoryId: string | null
  authorId: string | null
  createdAt: string
  updatedAt: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
}

export interface BlogUser {
  lastName: ReactNode
  firstName: ReactNode
  id: string
  name: string
  email: string
}