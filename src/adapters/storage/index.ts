import { StorageProvider } from './storage-provider.interface'
import { LocalStorageAdapter } from './local-storage.adapter'

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? 'local'

  switch (provider) {
    case 'local':
      return new LocalStorageAdapter()
    default:
      throw new Error(`Unknown storage provider: ${provider}`)
  }
}

export type { StorageProvider } from './storage-provider.interface'
