export function getDeviceId(request: Request): string {
  const cookie = request.headers.get('Cookie')
  if (cookie) {
    const match = cookie.match(/device_id=([^;]+)/)
    if (match) return match[1]
  }
  return 'anonymous'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
