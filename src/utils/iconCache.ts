type CachedIcon = {
  id: string
  name: string
  data: string
  timestamp: number
  tags?: string[]
}

const CACHE_KEY = 'battletech_icon_cache'

const hasStorage = (): boolean => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

class IconCache {
  private cache: Map<string, CachedIcon> = new Map()

  constructor() {
    this.load()
  }

  private load(): void {
    if (!hasStorage()) {
      return
    }
    try {
      const raw = window.localStorage.getItem(CACHE_KEY)
      if (raw) {
        const parsed: CachedIcon[] = JSON.parse(raw)
        parsed.forEach((icon) => this.cache.set(icon.id, icon))
      }
    } catch {
      this.cache.clear()
    }
  }

  private persist(): void {
    if (!hasStorage()) {
      return
    }
    const items = Array.from(this.cache.values())
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(items))
  }

  addIcon(name: string, data: string, tags?: string[]): string {
    const id = `${name.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`
    const icon: CachedIcon = { id, name, data, tags, timestamp: Date.now() }
    this.cache.set(id, icon)
    this.persist()
    return id
  }

  getAllIcons(): CachedIcon[] {
    return Array.from(this.cache.values())
  }

  removeIcon(id: string): boolean {
    const removed = this.cache.delete(id)
    if (removed) {
      this.persist()
    }
    return removed
  }

  clear(): void {
    this.cache.clear()
    if (hasStorage()) {
      window.localStorage.removeItem(CACHE_KEY)
    }
  }
}

let sharedCache: IconCache | null = null

export const getIconCache = (): IconCache => {
  if (!sharedCache) {
    sharedCache = new IconCache()
  }
  return sharedCache
}

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

export const resizeImage = async (dataUrl: string, maxSize = 256): Promise<string> => {
  if (typeof window === 'undefined') {
    return dataUrl
  }

  const image = new Image()
  image.src = dataUrl

  await new Promise((resolve) => {
    image.onload = resolve
  })

  const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1)
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(image.width * ratio)
  canvas.height = Math.floor(image.height * ratio)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return dataUrl
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL()
}

export const validateImageData = (dataUrl: string): boolean => dataUrl.startsWith('data:image/')

type Taggable = string | { chassis?: string; model?: string; name?: string }

export const getSuggestedTags = (target: Taggable): string[] => {
  const name =
    typeof target === 'string'
      ? target
      : `${target.chassis ?? ''} ${target.model ?? ''} ${target.name ?? ''}`
  const lower = name.toLowerCase()
  const tags: string[] = []
  if (lower.includes('clan')) tags.push('Clan')
  if (lower.includes('is') || lower.includes('inner')) tags.push('Inner Sphere')
  if (lower.includes('mech')) tags.push('Mech')
  return tags.length > 0 ? tags : ['Custom']
}

