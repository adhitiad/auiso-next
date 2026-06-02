// types/api.ts - API request/response types

import { z } from "zod"
import { Video, Comment, Category, User } from "./models"

// Video List API
export const videoListQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "popular", "trending"]).default("newest"),
  limit: z.coerce.number().min(1).max(50).default(20),
  offset: z.coerce.number().min(0).default(0),
})

export type VideoListQuery = z.infer<typeof videoListQuerySchema>

export interface VideoListResponse {
  videos: Video[]
  total: number
  hasMore: boolean
}

// Video Detail API
export interface VideoDetailResponse {
  video: Video & {
    category: Category
    user: Pick<User, "id" | "name" | "image">
    tags: { id: string; name: string }[]
    stats: {
      views: number
      likes: number
      comments: number
    }
  }
  relatedVideos: Video[]
}

// Comment API
export const createCommentSchema = z.object({
  videoId: z.string().uuid(),
  content: z.string().min(1).max(1000),
  parentId: z.string().uuid().optional(),
})

export type CreateCommentData = z.infer<typeof createCommentSchema>

export interface CommentListResponse {
  comments: (Comment & {
    user: Pick<User, "id" | "name" | "image">
    replies: number
  })[]
  total: number
}

// Search API
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  type: z.enum(["videos", "users", "all"]).default("all"),
  limit: z.coerce.number().min(1).max(20).default(10),
})

export type SearchQuery = z.infer<typeof searchQuerySchema>

export interface SearchResponse {
  videos: Video[]
  users: Pick<User, "id" | "name" | "image">[]
  total: number
}

// Auth API
export interface AuthSession {
  user: {
    id: string
    email: string
    name: string | null
    image: string | null
    role: string
  }
  expires: string
}

// Admin Dashboard API
export interface DashboardStats {
  totalVideos: number
  totalUsers: number
  totalViews: number
  totalRevenue: number
  pendingModeration: number
  dailyViews: { date: string; views: number }[]
  topVideos: Video[]
}

// VOD External API
export interface VodUploadResponse {
  id: string
  status: "processing" | "ready" | "failed"
  url: string | null
  thumbnail: string | null
  error: string | null
}

// Moderation API
export const moderationActionSchema = z.object({
  contentType: z.enum(["VIDEO", "COMMENT", "USER"]),
  contentId: z.string().uuid(),
  action: z.enum(["FLAG", "APPROVE", "REJECT", "BAN"]),
  reason: z.string().optional(),
})

export type ModerationActionData = z.infer<typeof moderationActionSchema>

// Error Response
export interface ApiError {
  error: string
  details?: z.ZodError["flatten"]
  code?: string
}
