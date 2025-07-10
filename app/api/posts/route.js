import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { withAuth } from '../../../lib/authMiddleware';

// export const get = withAuth (async (req) => {..});
// /api/posts?page=2&pageSize=5&sortBy=title&sortOrder=asc&search=hello

export const GET = withAuth(async (req) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const {
      page = 1,
      pageSize = 5,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = ''
    } = params;

    const skip = (page - 1) * pageSize;

    const posts = await prisma.posts.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip: Number(skip),
      take: Number(pageSize),
      orderBy: { [sortBy]: sortOrder },
      include: {
        users: { select: { id: true, name: true } },
        comments: {
          include: {
            users: { select: { id: true, name: true } }
          }
        }
      }
    });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
});

/// POST: Create a post
export const POST = withAuth(async (req) => {
  try {
    const { userId } = req.user;
    const { title, content } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const post = await prisma.posts.create({
      data: {
        title,
        content,
        users: { connect: { id: userId } },
      },
      include: {
        users: { select: { id: true, name: true } },
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
});
