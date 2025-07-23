import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { withAuth } from '../../../../middleware/authMiddleware';
import { postSchema, validate } from '../../../../utils/validation';
import { sendErrorResponse } from '../../../../utils/apiResponse';


export const PATCH = withAuth(async (req, { params }) => {
  try {
    const { userId } = req.user;
    const { id: postId } = params;
    const body = await req.json();

    
    const { title, content, category } = validate(postSchema.partial(), body);

    // Check if post exists and belongs to the user
    const existingPost = await prisma.posts.findFirst({
      where: { id: Number(postId), userid: userId },
    });

    if (!existingPost) {
      return sendErrorResponse("Post not found or unauthorized", 404);
    }

    // Update post
    const updatedPost = await prisma.posts.update({
      where: { id: Number(postId) },
      data: { title, content, category},
      include: {
        users: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error('PATCH /posts/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to update post', 400);
  }
});

// DELETE post
export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { userId } = req.user;
    const postId = Number(params.id);

    // Check if post exists and belongs to the user
    const existingPost = await prisma.posts.findFirst({
      where: { id: Number(postId), userid: userId },
    });

    if (!existingPost) {
      return sendErrorResponse("Post not found or unauthorized", 404);
    }

    // Delete post (Prisma's onDelete: Cascade will handle related comments)
    await prisma.posts.delete({
      where: { id: Number(postId) },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /posts/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to delete post', 400);
  }
});



export async function GET(req, { params }) {
  try {
    const postId = Number(params.id);

    if (isNaN(postId)) {
      return sendErrorResponse('Invalid post ID', 400);
    }

    const post = await prisma.posts.findUnique({
      where: { id: postId },
      include: {
        users: { select: { id: true, name: true } },
        comments: {
          include: {
            users: { select: { id: true, name: true } }
          }
        }
      }
    });

    if (!post) {
      return sendErrorResponse('Post not found', 404);
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error('GET /posts/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to fetch post', 500);
  }
}
