import fs from 'fs/promises'
import path from 'path'
import { StorageProvider } from './storage-provider.interface'

export class LocalStorageAdapter implements StorageProvider {
  readonly name = 'local'
  private readonly uploadDir: string

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads')
    this.ensureDir()
  }

  private async ensureDir(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true })
    } catch {
      // Directory already exists
    }
  }

  async upload(key: string, data: Buffer, _contentType: string): Promise<string> {
    await this.ensureDir()
    const filePath = path.join(this.uploadDir, key)
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, data)
    return `/uploads/${key}`
  }

  async getUrl(key: string): Promise<string> {
    return `/uploads/${key}`
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key)
    try {
      await fs.unlink(filePath)
    } catch {
      // File may not exist, ignore
    }
  }
}
