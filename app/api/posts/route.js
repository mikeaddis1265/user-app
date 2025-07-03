import prisma from '../../../lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.posts.findMany({
      include: { users: true },
    });
    return Response.json(posts);
  } catch (error) {
    console.error('GET /posts error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, content, userId } = body;

    if (!title || !userId) {
      return new Response(JSON.stringify({ error: 'Missing title or userId' }), { status: 400 });
    }

    const newPost = await prisma.posts.create({
      data: {
        title,
        content,
        users: {
          connect: {id: Number(userId)}
        }
      },
    });

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (error) {
    console.error('POST /posts error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}