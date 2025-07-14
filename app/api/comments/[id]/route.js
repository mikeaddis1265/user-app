import prisma from '../../../../../lib/prisma';
import { withAuth } from '../../../../../middlewares/authMiddleware';
import { NextResponse } from 'next/server';
import { commentSchema, validate } from '../../../../../utils/validation';
import { sendErrorResponse } from '../../../../../utils/sendErrorResponse';

// UPDATE a comment (PATCH)
export const PATCH = withAuth(async (req, { params }) => {
  try {
    const { userId } = req.user;
    const { id: commentId } = params; // Extract comment ID from URL
    const body = await req.json();

    // Validate input (only `content` is updatable)
    const { content } = validate(commentSchema.pick({ content: true }), body);

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.comments.findFirst({
      where: { 
        id: Number(commentId), 
        userid: userId, // Ensure the comment belongs to the requesting user
      },
    });

    if (!existingComment) {
      return sendErrorResponse("Comment not found or unauthorized", 404);
    }

    // Update the comment
    const updatedComment = await prisma.comments.update({
      where: { id: Number(commentId) },
      data: { content },
      include: {
        users: { select: { id: true, name: true } }, // Return user details
        posts: { select: { id: true, title: true } }, // Return post details
      },
    });

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error('PATCH /comments/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to update comment', 400);
  }
});

// DELETE a comment
export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { userId } = req.user;
    const { id: commentId } = params;

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.comments.findFirst({
      where: { 
        id: Number(commentId), 
        userid: userId, // Ensure the comment belongs to the requesting user
      },
    });

    if (!existingComment) {
      return sendErrorResponse("Comment not found or unauthorized", 404);
    }

    // Delete the comment
    await prisma.comments.delete({
      where: { id: Number(commentId) },
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /comments/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to delete comment', 400);
  }
});