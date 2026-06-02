// types/components.ts - Component prop types

import { ReactNode } from "react"
import { Video, Comment, Category, User } from "./models"

// Layout Components
export interface RootLayoutProps {
  children: ReactNode
}

export interface AdminLayoutProps {
  children: ReactNode
}

// Video Components
export interface VideoCardProps {
  video: Video & {
    category: Pick<Category, "name" | "slug">
    user: Pick<User, "name" | "image">
    stats: { views: number; likes: number }
  }
  variant?: "default" | "compact" | "horizontal"
}

export interface VideoPlayerProps {
  video: Video & {
    stats: { views: number; likes: number; comments: number }
  }
  autoPlay?: boolean
  startTime?: number
  onProgress?: (time: number) => void
  onComplete?: () => void
}

export interface VideoGridProps {
  videos: VideoCardProps["video"][]
  emptyMessage?: string
  loading?: boolean
}

// Comment Components
export interface CommentItemProps {
  comment: Comment & {
    user: Pick<User, "id" | "name" | "image">
    replies: number
  }
  onReply?: (parentId: string) => void
  onDelete?: (commentId: string) => void
}

export interface CommentSectionProps {
  videoId: string
  totalComments: number
}

// Form Components
export interface FormFieldProps {
  name: string
  label: string
  type?: "text" | "email" | "password" | "textarea" | "select" | "file"
  placeholder?: string
  description?: string
  required?: boolean
  disabled?: boolean
}

// Admin Components
export interface DataTableProps<T> {
  data: T[]
  columns: {
    key: keyof T | string
    header: string
    cell?: (item: T) => ReactNode
    sortable?: boolean
  }[]
  onSort?: (key: string, direction: "asc" | "desc") => void
  onRowClick?: (item: T) => void
  pagination?: {
    page: number
    perPage: number
    total: number
    onPageChange: (page: number) => void
  }
}

export interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: ReactNode
  trend?: "up" | "down" | "neutral"
}

// Modal Components
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

// Toast Components
export interface ToastProps {
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
  duration?: number
}

// Navigation Components
export interface NavLinkProps {
  href: string
  label: string
  icon?: ReactNode
  active?: boolean
  badge?: number
}

export interface SidebarProps {
  links: NavLinkProps[]
  user: Pick<User, "name" | "image" | "role">
  collapsed?: boolean
}

// Search Components
export interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  initialValue?: string
  loading?: boolean
}

export interface SearchResultsProps {
  videos: Video[]
  users: Pick<User, "id" | "name" | "image">[]
  query: string
  loading?: boolean
}

// Auth Components
export interface AuthButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export interface UserMenuProps {
  user: Pick<User, "name" | "image" | "email" | "role">
  onLogout: () => void
}
