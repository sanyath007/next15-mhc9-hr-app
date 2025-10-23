const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
];

export async function GET() {
    return new Response(JSON.stringify(users), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(request: Request) {
    const newUser = await request.json();
    users.push(newUser);
    return new Response(JSON.stringify(newUser), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}