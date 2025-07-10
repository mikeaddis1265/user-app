import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { withAuth } from '@/lib/authMiddleware';

// ✅ PUT /api/users/[id]
export const PUT = withAuth(async (req, { params }) => {
  try {
    const { id } = params;
    const { userId } = req.user;
    const { name, email, password } = await req.json();

    if (!name && !email && !password) {
      return new Response(JSON.stringify({ error: 'At least one field (name, email, password) is required' }), { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (Number(id) !== Number(userId)) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Can only update your own profile' }), { status: 403 });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== Number(id)) {
        return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
      }
      updateData.email = email;
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        posts: {
          select: { id: true, title: true, content: true, createdAt: true },
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            posts: { select: { id: true, title: true } },
          },
        },
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });

  } catch (error) {
    console.error('PUT /users/[id] error:', error);
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: 'Update failed' }), { status: 500 });
  }
});

// ✅ DELETE /api/users/[id]
export const DELETE = withAuth(async (req, { params }) => {
  try {
    const { id } = params;
    const { userId } = req.user;

    const user = await prisma.users.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    if (Number(id) !== Number(userId)) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Can only delete your own profile' }), { status: 403 });
    }

    await prisma.users.delete({ where: { id: Number(id) } });

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('DELETE /users/[id] error:', error);
    return new Response(JSON.stringify({ error: 'Delete failed' }), { status: 500 });
  }
});
