const BASE_URL = import.meta.env.VITE_API_URL

export async function uploadImage(file: File): Promise<string> {
  const token = localStorage.getItem('clinix_token')
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${BASE_URL}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? 'No se pudo subir la imagen')
  }

  const data = await response.json()
  return `${BASE_URL.replace(/\/api$/, '')}${data.url}`
}
