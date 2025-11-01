import getServerSession from "next-auth";
import authConfig from "@/auth.config";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getServerSession(authConfig);
    console.log(session);

    return Response.json({
        message: 'Test'
    });
}