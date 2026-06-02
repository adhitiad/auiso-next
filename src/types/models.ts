// types/models.ts - Prisma model types (derived dari schema)

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: Role
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Video {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  videoUrl: string
  embedUrl: string | null
  duration: number | null
  views: number
  likes: number
  isPublic: boolean
  ageRestricted: boolean
  hasWatermark: boolean
  categoryId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt: Date
}

export interface Comment {
  id: string
  content: string
  videoId: string
  userId: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface VideoStats {
  id: string
  videoId: string
  views: number
  likes: number
  shares: number
  watchTime: number
  updatedAt: Date
}

export interface AdCampaign {
  id: string
  name: string
  type: "GOOGLE_ADS" | "FACEBOOK_PIXEL" | "DIRECT"
  config: Record<string, unknown>
  isActive: boolean
  startDate: Date
  endDate: Date | null
  createdAt: Date
}

export interface RevenueReport {
  id: string
  period: string
  totalRevenue: number
  adRevenue: number
  subscriptionRevenue: number
  videoId: string | null
  createdAt: Date
}

export interface ModerationLog {
  id: string
  action: "FLAG" | "APPROVE" | "REJECT" | "BAN"
  contentType: "VIDEO" | "COMMENT" | "USER"
  contentId: string
  reason: string | null
  moderatorId: string
  createdAt: Date
}

export interface WatchHistory {
  id: string
  userId: string
  videoId: string
  progress: number
  watchedAt: Date
}

export interface Bookmark {
  id: string
  userId: string
  videoId: string
  createdAt: Date
}
