// types/forms.ts - Form validation types

import { z } from "zod"

// Video Upload Form
export const videoUploadSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .optional(),
  categoryId: z.string().uuid("Pilih kategori yang valid"),
  tags: z
    .array(z.string().min(1).max(20))
    .max(10, "Maksimal 10 tag")
    .optional(),
  thumbnail: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, "Ukuran thumbnail maksimal 5MB")
    .refine((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type), "Format harus JPG, PNG, atau WebP")
    .optional(),
  videoFile: z
    .instanceof(File)
    .refine((f) => f.size <= 500 * 1024 * 1024, "Ukuran video maksimal 500MB")
    .refine((f) => ["video/mp4", "video/webm", "video/ogg"].includes(f.type), "Format harus MP4, WebM, atau OGG"),
  isPublic: z.boolean().default(true),
  ageRestricted: z.boolean().default(false),
  hasWatermark: z.boolean().default(false),
})

export type VideoUploadData = z.infer<typeof videoUploadSchema>

// Video Edit Form
export const videoEditSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(2000).optional(),
  categoryId: z.string().uuid(),
  tags: z.array(z.string()).max(10).optional(),
  thumbnailUrl: z.string().url().optional(),
  isPublic: z.boolean(),
  ageRestricted: z.boolean(),
})

export type VideoEditData = z.infer<typeof videoEditSchema>

// Category Form
export const categoryFormSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof categoryFormSchema>

// Comment Form
export const commentFormSchema = z.object({
  content: z.string().min(1, "Komentar tidak boleh kosong").max(1000, "Komentar maksimal 1000 karakter"),
  parentId: z.string().uuid().optional(),
})

export type CommentFormData = z.infer<typeof commentFormSchema>

// Ad Campaign Form
export const adCampaignSchema = z.object({
  name: z.string().min(3).max(100),
  type: z.enum(["GOOGLE_ADS", "FACEBOOK_PIXEL", "DIRECT"]),
  config: z.record(z.string()),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
})

export type AdCampaignData = z.infer<typeof adCampaignSchema>

// User Profile Form
export const profileFormSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  image: z.string().url().optional(),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

// Search Form
export const searchFormSchema = z.object({
  query: z.string().min(1).max(100),
})

export type SearchFormData = z.infer<typeof searchFormSchema>

// Login Form (untuk non-OAuth login jika diperlukan)
export const loginFormSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
