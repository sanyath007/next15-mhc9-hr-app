// /api/embed/route.js
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // const { messages } = await req.json();

        // Make request to Ollama API
        const response: any = await fetch('http://localhost:11434/api/embed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'mxbai-embed-large', // or your preferred model
                input: "Llamas are members of the camelid family",
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Chat API error:', error);

        return NextResponse.json(
            { error: 'Failed to connect to Ollama' },
            { status: 500 }
        );
    }
}