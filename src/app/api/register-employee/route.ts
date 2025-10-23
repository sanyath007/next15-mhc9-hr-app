import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, faceDescriptor, image } = body;

        // TODO: Save employee face descriptor to database
        // const employee = await prisma.employee.create({
        //   data: {
        //     name,
        //     faceDescriptor,
        //     profileImage: image
        //   }
        // });

        return NextResponse.json({
        success: true,
        message: 'Employee registered successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
        { success: false, message: 'Registration failed' },
        { status: 500 }
        );
    }
}