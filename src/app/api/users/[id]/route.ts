export async function GET(request: Request, { params }: { params: { id: string } }) {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
    ];
    const user = users.find(u => u.id === parseInt(params.id));
    if (user) {
        return new Response(JSON.stringify(user), {
            headers: { 'Content-Type': 'application/json' },
        });
    }  else {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    // In a real application, you would delete the user from the database.
    // Here, we just simulate a successful deletion.
    return new Response(null, { status: 204 });
}