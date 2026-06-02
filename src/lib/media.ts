const blockedThumbnailHosts = new Set(["via.placeholder.com"])

export const getSafeImageUrl = (url?: string | null) => {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    if (blockedThumbnailHosts.has(parsedUrl.hostname)) return null
  } catch {
    return url
  }

  return url
}
