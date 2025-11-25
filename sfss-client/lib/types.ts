export type FileData = {
  id: string
  fileName: string
  fileType: string
  s3Key: string
  fileUrl: string
  status: string
  accessCode: number
  targetUserEmails: string[]
  expiryDurationMinutes: number
  firstAccessedAt: string
  expiresAt: string
  createdAt: string
}
