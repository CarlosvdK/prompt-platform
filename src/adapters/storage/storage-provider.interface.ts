export interface StorageProvider {
  readonly name: string
  upload(key: string, data: Buffer, contentType: string): Promise<string>
  getUrl(key: string): Promise<string>
  delete(key: string): Promise<void>
}
