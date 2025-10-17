'use server';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const markPostedSchema = z.object({
    ids: z.array(z.string()),
});

export async function POST(request: NextRequest) {
    const body = await request.json();

    const validated = markPostedSchema.safeParse(body);

    if (!validated.success) {
        return NextResponse.json({
            message: 'Invalid request body',
            errors: validated.error.flatten().fieldErrors
        }, { status: 400 });
    }

    try {
        await db.markPostsAsPosted(validated.data.ids);
        return NextResponse.json({ message: 'Posts marked as posted successfully.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Database error: Failed to update posts.' }, { status: 500 });
    }
}
