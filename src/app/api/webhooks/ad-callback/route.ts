import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/app/api/_helpers/error-handler'
import { ApiError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    // Validate webhook signature
    const webhookSecret = process.env.AD_WEBHOOK_SECRET
    const signature = request.headers.get('X-Webhook-Secret')

    if (!webhookSecret || signature !== webhookSecret) {
      throw new ApiError(401, 'Invalid webhook signature', 'WEBHOOK_AUTH_FAILED')
    }

    const payload = await request.json()

    // Log the ad event
    console.log('Ad callback received:', {
      type: payload.type,
      impressionId: payload.impressionId,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
