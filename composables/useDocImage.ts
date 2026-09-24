const BACK_URL = "https://back.casaalmare.com"

export const docImageUrl = (docId: number, value?: string) => {
  if (!value) return ""
  if (/^(https?:)?\/\//.test(value) || value.startsWith("/")) return value
  return `${BACK_URL}/assets/images/${docId}/${value}`
}
