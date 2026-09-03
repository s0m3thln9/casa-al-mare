export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const data = (error as { data?: { error?: unknown } }).data
    if (data && typeof data.error === "string" && data.error) return data.error
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
