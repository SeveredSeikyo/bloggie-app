'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ message: 'Webhook URL is not configured.' }, { status: 500 });
  }

  try {
    // We are making a GET request to the webhook as requested
    const webhookResponse = await fetch(webhookUrl, {
      method: 'GET',
    });

    if (!webhookResponse.ok) {
      const errorBody = await webhookResponse.text();
      console.error('Webhook failed:', webhookResponse.status, errorBody);
      return NextResponse.json({ message: 'Webhook call failed.' }, { status: webhookResponse.status });
    }
    
    return NextResponse.json({ message: 'Webhook triggered successfully.' });

  } catch (error) {
    console.error('Error triggering webhook:', error);
    return NextResponse.json({ message: 'Failed to trigger webhook.' }, { status: 500 });
  }
}
