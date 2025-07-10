import prisma from '../../../lib/prisma';
import { withAuth } from '../../../lib/authMiddleware';
import { NextResponse } from 'next/server';


export const POST = withAuth(async (req) => {
  try {
    const { userId } = req.user;
    const { postId, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: 'Missing postId or content' }, { status: 400 });
    }

    const newComment = await prisma.comments.create({
      data: {
        content,
        users: { connect: { id: Number(userId) } },
        posts: { connect: { id: Number(postId) } },
      },
      include: {
        users: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('POST /comments error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});


export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = req.nextUrl;
    const postId = searchParams.get('postId');

    const where = postId ? { postsId: Number(postId) } : {};

    const comments = await prisma.comments.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        users: { select: { id: true, name: true } },
        posts: { select: { id: true, title: true } }
      }
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('GET /comments error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
