import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { employeeName, image, timestamp } = body;

        // TODO: Save to your database
        // Example with Prisma:
        // const checkIn = await prisma.attendance.create({
        //   data: {
        //     employeeName,
        //     imageUrl: image,
        //     checkInTime: new Date(timestamp),
        //   }
        // });

        // For now, just log the check-in
        console.log('Check-in recorded:', {
        employee: employeeName,
        time: timestamp
        });

        return NextResponse.json({
        success: true,
        message: 'Check-in recorded successfully',
        data: {
            employeeName,
            timestamp
        }
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json(
        { success: false, message: 'Failed to record check-in' },
        { status: 500 }
        );
    }
}