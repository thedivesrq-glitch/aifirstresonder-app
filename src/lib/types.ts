import { PlatformId, ContentTone } from './platforms'

export interface GenerateRequest {
  topic: string
  tone: ContentTone
  platforms: PlatformId[]
  keywords?: string[]
  targetAudience?: string
  callToAction?: string
  includeHashtags?: boolean
  includeEmojis?: boolean
}

export interface GenerateResponse {
  posts: Record<PlatformId, string>
  suggestedHashtags: string[]
  suggestedEmojis: string[]
  contentWarnings: string[]
}

export interface CreatePostRequest {
  content: string
  platforms: PlatformId[]
  scheduledAt?: string
  platformContent?: Partial<Record<PlatformId, string>>
  hashtags?: string[]
  mentions?: string[]
  mediaUrls?: string[]
  tone?: ContentTone
  topic?: string
  aiGenerated?: boolean
  title?: string
}

export interface PostWithPlatforms {
  id: string
  title: string | null
  content: string
  platforms: string[]
  status: string
  scheduledAt: Date | null
  publishedAt: Date | null
  hashtags: string[]
  mentions: string[]
  mediaUrls: string[]
  tone: string | null
  topic: string | null
  aiGenerated: boolean
  createdAt: Date
  updatedAt: Date
  platformPosts: {
    id: string
    platform: string
    content: string
    status: string
    publishedAt: Date | null
    analytics: Record<string, number> | null
  }[]
}
