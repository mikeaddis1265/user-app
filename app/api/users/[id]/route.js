import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { withAuth } from '../../../../middleware/authMiddleware';
import { sendErrorResponse } from '../../../../utils/apiResponse';

export const PATCH = withAuth(async (req, { params }) => {
  try {
    const { userId: currentUserId } = req.user; // Logged-in user
    const { id: targetUserId } = params; // User to update

    // Only allow users to update their own account
    if (currentUserId !== Number(targetUserId)) {
      return sendErrorResponse("Unauthorized: You can only update your own profile", 403);
    }

    const body = await req.json();
    const { name, email, password } = body;

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: Number(targetUserId) },
      data: { name, email, password },
      select: { id: true, name: true, email: true }, // Don't return password
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('PATCH /users/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to update user', 400);
  }
});

// DELETE user
export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { userId: currentUserId } = req.user;
    const { id: targetUserId } = params;

    // Only allow users to delete their own account
    if (currentUserId !== Number(targetUserId)) {
      return sendErrorResponse("Unauthorized: You can only delete your own account", 403);
    }

    // Delete user (Prisma's onDelete: Cascade will handle related posts/comments)
    await prisma.users.delete({
      where: { id: Number(targetUserId) },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /users/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to delete user', 400);
  }
});

export const GET = withAuth(async (req, { params }) => {
  try {
    const { id: targetUserId } = params;

    // Fetch user with related posts
    const user = await prisma.users.findUnique({
      where: { id: Number(targetUserId) },
      select: {
        id: true,
        name: true,
        email: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            // add more post fields here if needed
          },
        },
      },
    });

    if (!user) {
      return sendErrorResponse('User not found', 404);
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('GET /users/[id] error:', error.message);
    return sendErrorResponse(error.message || 'Failed to fetch user', 400);
  }
});