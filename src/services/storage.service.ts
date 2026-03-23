import { getStorageProvider } from '@/adapters/storage'

export async function uploadPreviewAsset(
  key: string,
  data: Buffer,
  contentType: string,
): Promise<string> {
  const provider = getStorageProvider()
  return provider.upload(key, data, contentType)
}

export async function getPreviewUrl(key: string): Promise<string> {
  const provider = getStorageProvider()
  return provider.getUrl(key)
}

export async function deletePreviewAsset(key: string): Promise<void> {
  const provider = getStorageProvider()
  return provider.delete(key)
}
