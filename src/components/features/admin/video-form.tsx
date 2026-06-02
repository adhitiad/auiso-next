"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createVideo, updateVideo } from "@/app/actions/videos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Loader2, UploadCloud } from "lucide-react"

export interface Category {
  id: string
  name: string
  slug: string
}

export interface VideoFormProps {
  categories: Category[]
  hasAiTagging: boolean
  initialData?: Record<string, unknown> // Video data if editing
}

export function VideoForm({ categories, hasAiTagging, initialData }: VideoFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState<string>((initialData?.title as string) || "")
  const [slug, setSlug] = useState<string>((initialData?.slug as string) || "")
  const [synopsis, setSynopsis] = useState<string>((initialData?.synopsis as string) || "")
  const [summary, setSummary] = useState<string>((initialData?.summary as string) || "")
  const [thumbnail, setThumbnail] = useState<string>((initialData?.thumbnail as string) || "")
  const [videoPlatform, setVideoPlatform] = useState<string>((initialData?.videoPlatform as string) || "DOODSTREAM")
  const [videoId, setVideoId] = useState<string>((initialData?.videoId as string) || "")
  const [duration, setDuration] = useState<string>((initialData?.duration as number)?.toString() || "")
  const [isFeatured, setIsFeatured] = useState<boolean>((initialData?.isFeatured as boolean) || false)
  
  // Parse existing tags/categories for edit mode
  const existingTags = (initialData?.tags as Array<{tag: {name: string}}> | undefined)?.map((t) => t.tag.name).join(", ") || ""
  const existingCategoryIds = (initialData?.categories as Array<{categoryId: string}> | undefined)?.map((c) => c.categoryId) || []

  const [tags, setTags] = useState(existingTags)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set(existingCategoryIds))

  // AI states
  const [isSuggestingTags, setIsSuggestingTags] = useState(false)
  const [isSuggestingSummary, setIsSuggestingSummary] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([])

  const handleCategoryToggle = (id: string) => {
    const next = new Set(selectedCategoryIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedCategoryIds(next)
  }

  const handleSuggestTags = async () => {
    if (!title) return alert("Title required")
    setIsSuggestingTags(true)
    try {
      const res = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: synopsis })
      })
      const data = await res.json()
      if (data.tags) setSuggestedTags(data.tags)
      if (data.categories) setSuggestedCategories(data.categories)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSuggestingTags(false)
    }
  }

  const handleSuggestSummary = async () => {
    if (!title || !synopsis) return alert("Title and Synopsis required")
    setIsSuggestingSummary(true)
    try {
      const res = await fetch("/api/suggest-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: synopsis })
      })
      const data = await res.json()
      if (data.summary) setSummary(data.summary)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSuggestingSummary(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const payload = {
      id: initialData?.id,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      synopsis,
      summary,
      thumbnail,
      duration: duration ? parseInt(duration) : null,
      videoPlatform,
      videoId,
      isFeatured,
      tags,
      categoryIds: Array.from(selectedCategoryIds)
    }

    let result
    if (isEditing) {
      result = await updateVideo(payload)
    } else {
      result = await createVideo(payload)
    }

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/videos")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/50 p-6 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h2 className="text-xl font-bold">{isEditing ? "Edit Video" : "Add New Video"}</h2>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Video"}
        </Button>
      </div>

      {error && <div className="p-4 bg-red-500/20 text-red-300 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generated if empty" />
          </div>
          <div>
            <Label>Synopsis</Label>
            <Textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows={4} />
          </div>
          <div>
            <div className="flex justify-between">
              <Label>Summary (Short)</Label>
              {hasAiTagging && (
                <Button type="button" variant="ghost" size="sm" onClick={handleSuggestSummary} disabled={isSuggestingSummary}>
                  {isSuggestingSummary ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1 text-purple-400" />} AI
                </Button>
              )}
            </div>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Thumbnail URL</Label>
            <Input value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} required type="url" />
            {thumbnail && <img src={thumbnail} alt="Preview" className="mt-2 h-32 rounded object-cover" />}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Video Platform</Label>
              <Input value={videoPlatform} onChange={(e) => setVideoPlatform(e.target.value)} placeholder="DOODSTREAM" />
            </div>
            <div className="flex-1">
              <Label>Video ID</Label>
              <Input value={videoId} onChange={(e) => setVideoId(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Duration (seconds)</Label>
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            <Label htmlFor="featured">Featured Video</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center">
          <Label>Tags (comma separated)</Label>
          {hasAiTagging && (
            <Button type="button" variant="ghost" size="sm" onClick={handleSuggestTags} disabled={isSuggestingTags}>
              {isSuggestingTags ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1 text-purple-400" />} Auto Tag
            </Button>
          )}
        </div>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} />
        {suggestedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map(tag => (
              <Badge key={tag} className="cursor-pointer" onClick={() => setTags(tags ? `${tags}, ${tag}` : tag)}>+ {tag}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Categories</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center space-x-2 bg-white/5 p-2 rounded">
              <Checkbox 
                id={`cat-${c.id}`} 
                checked={selectedCategoryIds.has(c.id)} 
                onCheckedChange={() => handleCategoryToggle(c.id)} 
              />
              <Label htmlFor={`cat-${c.id}`} className="cursor-pointer">{c.name}</Label>
            </div>
          ))}
        </div>
      </div>

    </form>
  )
}
