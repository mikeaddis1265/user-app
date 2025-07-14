import prisma from '../../../lib/prisma';
import { withAuth } from '../../../middlewares/authMiddleware';
import { NextResponse } from 'next/server';
import { commentSchema, validate } from '../../../utils/validation';
import { sendErrorResponse } from '../../../utils/sendErrorResponse';


export const POST = withAuth(async (req) => {
  try {
    const { userId } = req.user;
    const body = await req.json();

    //validate using zod
    const { postId, content } = validate(commentSchema, body);

    // const { postId, content } = await req.json();
    // if (!postId || !content) {
    //   return NextResponse.json({ error: 'Missing postId or content' }, { status: 400 });
    // }

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
    return sendErrorResponse(error.message || 'Failed to create comment', 400);
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
    return sendErrorResponse('Failed to fetch comments', 500);
  }
});
