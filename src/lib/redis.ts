import Redis from "ioredis"

let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis

  const url = process.env.REDIS_API

  if (!url) {
    console.warn("Redis credentials not found. Caching disabled.")
    return null
  }

  redis = new Redis(url)
  return redis
}

export async function cachedQuery<T>(
  key: string,
  ttlSeconds: number,
  queryFn: () => Promise<T>,
): Promise<T> {
  const client = getRedis()

  if (!client) {
    return queryFn()
  }

  try {
    const cached = await client.get(key)
    if (cached !== null && cached !== undefined) {
      return JSON.parse(cached) as T
    }
  } catch (e) {
    console.error("Redis GET error:", e)
  }

  const result = await queryFn()

  try {
    await client.set(key, JSON.stringify(result), "EX", ttlSeconds)
  } catch (e) {
    console.error("Redis SET error:", e)
  }

  return result
}

export async function invalidateCache(key: string): Promise<void> {
  const client = getRedis()
  if (!client) return

  try {
    await client.del(key)
  } catch (e) {
    console.error("Redis DEL error:", e)
  }
}

export async function invalidateCachePattern(pattern: string): Promise<void> {
  const client = getRedis()
  if (!client) return

  try {
    let cursor = 0
    do {
      const result = await client.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      )
      cursor = parseInt(result[0], 10)
      const keys = result[1]
      if (keys.length > 0) {
        await Promise.all(keys.map((k: string) => client.del(k)))
      }
    } while (cursor !== 0)
  } catch (e) {
    console.error("Redis SCAN/DEL error:", e)
  }
}
