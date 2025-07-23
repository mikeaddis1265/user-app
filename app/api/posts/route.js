import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { withAuth } from '../../../middleware/authMiddleware';
import { postSchema, validate } from '../../../utils/validation';
import { sendErrorResponse } from '../../../utils/apiResponse';




//GET – to fetch posts with search, sorting, pagination and filtering by category
// export const get = withAuth (async (req) => {..});
// /api/posts?page=2&pageSize=5&sortBy=title&sortOrder=asc&search=hello

export const GET = async (req) => {
  try {

    const params = Object.fromEntries(req.nextUrl.searchParams);
    const {
      page = 1,
      pageSize = 5,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      category = '',
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
    console.error('GET /posts error:', error.message);
    return sendErrorResponse('Failed to fetch posts', 500);
  }
};


// export const GET = async () => {
//   try {
//     const posts = await prisma.posts.findMany({
//       select: {
//         id: true,
//         title: true,
//         createdAt: true,
//         category: true,
//       },
//       orderBy: { createdAt: 'desc' },
//     });

//     return NextResponse.json(posts, { status: 200 });
//   } catch (error) {
//     console.error('GET /posts error:', error.message);
//     return sendErrorResponse('Failed to fetch posts', 500);
//   }
// };


export const POST = withAuth(async (req) => {
  try {
    const { userId } = req.user;
    const body = await req.json();

    //validate input using zod
    const {title, content, category} = validate(postSchema, body);
    // const { title, content } = await req.json();

    // if (!title) {
    //   return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    // }

    const post = await prisma.posts.create({
      data: {
        title,
        content,
        category,
        users: { connect: { id: userId } },
      },
      include: {
        users: { select: { id: true, name: true } },
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return sendErrorResponse(error.message || 'Failed to create post', 400);
  }
});
