import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body);

        const { firstName, lastName, email, faceDescriptor, avatarImage } = body;

        /** TODO: Save employee face descriptor to database */
        const employee = await prisma.employee.create({
            data: {
                name: `${firstName} ${lastName}`,
                email,
                faceDescriptor,
                profileImage: avatarImage
            }
        });

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