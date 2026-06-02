import { z } from "zod"

export const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  VOD_API_URL: z.string().url().optional(),
  PEERTUBE_API_URL: z.string().url().optional(),
  DOODSTREAM_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  EXA_API_KEY: z.string().optional(),
  SILLY_TAVERN_API_URL: z.string().url().optional(),
  SILLY_TAVERN_API_KEY: z.string().optional(),
  GOOGLE_ADS_CLIENT_ID: z.string().optional(),
  FB_ADS_PIXEL_ID: z.string().optional(),
  GA_MEASUREMENT_ID: z.string().optional(),
  LOOKER_STUDIO_EMBED_URL: z.string().url().optional(),
  MONITORING_DOMAIN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
