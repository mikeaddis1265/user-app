import prisma from '../../../../../lib/prisma';
import { withAuth } from '../../../../../middleware/authMiddleware';
import { NextResponse } from 'next/server';
import { commentSchema, validate } from '../../../../../utils/validation';
import { sendErrorResponse } from '../../../../../utils/apiResponse';

export const GET = async (req, { params }) => {
  try {
    const { id } = params; // Changed from postId to id to match the folder structure [id]

    const comments = await prisma.comments.findMany({
      where: { postid: Number(id) }, // Changed from postId to postid to match Prisma model
      orderBy: { createdAt: 'desc' },
      include: {
        users: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('GET /posts/[id]/comments error:', error.message);
    return sendErrorResponse('Failed to fetch comments', 500);
  }
};



export const POST = withAuth(async (req, { params }) => {
  try {
    const { id: postId } = params;
    const { userId } = req.user; 
    const body = await req.json();
    
    // Validate the request body against the comment schema
    const { content } = validate(commentSchema, {
      postId: Number(postId), // Convert postId to number and include in validation
      content: body.content
    });

    // Create the comment in the database
    const newComment = await prisma.comments.create({
      data: {
        content,
        userid: userId,
        postid: Number(postId)
      },
      include: {
        users: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('POST /posts/[id]/comments error:', error.message);
    return sendErrorResponse(error.message || 'Failed to create comment', 500);
  }
});
