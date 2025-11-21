// /api/chat/route.js
import { NextRequest, NextResponse } from 'next/server';
// import { Ollama } from 'ollama';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { messages } = await req.json();

        // Make request to Ollama API
        const response: any = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3.2', // or your preferred model
                messages: messages,
                stream: true,
            }),
        });

        // const ollama = new Ollama({ host: 'http://localhost:11434' });
        // const response: any = await ollama.chat({
        //     model: 'llama3.2', // or your preferred model
        //     messages: messages,
        //     stream: true,
        // });

        console.log(response);
        
        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body.getReader();

                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n').filter(line => line.trim());

                        for (const line of lines) {
                            try {
                                const data = JSON.parse(line);
                                if (data.message?.content) {
                                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                                        content: data.message.content,
                                        done: data.done || false
                                    })}\n\n`));
                                }
                            } catch (e) {
                                // Skip invalid JSON lines
                            }
                        }
                    }
                } catch (error) {
                    controller.error(error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);

        // return NextResponse.json(
        //     { error: 'Failed to connect to Ollama' },
        //     { status: 500 }
        // );
    }
}