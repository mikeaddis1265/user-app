// test/prisma-test.js
import prisma from './lib/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  try {
    // Create user with posts and comments
    const hashedPassword = await bcrypt.hash('mike1234', 10);
    const newUser = await prisma.users.create({
      data: {
        name: 'Mike',
        email: 'mike@gmail.com',
        password: hashedPassword,
        posts: {
          create: [
            {
              title: 'Mike Post',
              content: 'This is my first post!',
              comments: {
                create: [{ content: 'Great post, Mike!' }],
              },
            },
            {
              title: 'Another Post',
              content: 'Roger that',
            },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            comments: { select: { id: true, content: true, createdAt: true } },
          },
        },
      },
    });
    console.log('Created user:', JSON.stringify(newUser, null, 2));

    // Read users with posts and comments (with filtering, pagination, sorting)
    const allUsers = await prisma.users.findMany({
      where: { email: { contains: 'mike' } }, // Example filter
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            comments: { select: { id: true, content: true, createdAt: true } },
          },
        },
        comments: { select: { id: true, content: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' }, // Sorting
      take: 5, // Pagination
      skip: 0,
    });
    console.log('All users with posts and comments:', JSON.stringify(allUsers, null, 2));

    // Update user name
    const updatedUser = await prisma.users.update({
      where: { email: 'mike@gmail.com' },
      data: { name: 'Alice Johnson' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        posts: { select: { id: true, title: true, content: true } },
        comments: { select: { id: true, content: true } },
      },
    });
    console.log('Updated user:', JSON.stringify(updatedUser, null, 2));

    // Update posts (add a new post)
    const updatedUserWithPost = await prisma.users.update({
      where: { email: 'mike@gmail.com' },
      data: {
        posts: {
          create: [{ title: 'New Title', content: 'Updated post content' }],
        },
      },
      include: {
        posts: { select: { id: true, title: true, content: true, createdAt: true } },
        comments: { select: { id: true, content: true, createdAt: true } },
      },
    });
    console.log('Updated user with new post:', JSON.stringify(updatedUserWithPost, null, 2));

    // Delete a post (example: first post of the user)
    const user = await prisma.users.findUnique({ where: { email: 'mike@gmail.com' }, include: { posts: true } });
    if (user && user.posts.length > 0) {
      const deletedPost = await prisma.posts.delete({
        where: { id: user.posts[0].id },
      });
      console.log('Deleted post:', JSON.stringify(deletedPost, null, 2));
    } else {
      console.log('No posts found to delete');
    }

    // Create a comment (example)
    const newComment = await prisma.comments.create({
      data: {
        content: 'Another comment!',
        users: { connect: { id: user.id } },
        posts: { connect: { id: user.posts[0]?.id || 1 } }, // Use first post or fallback
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        users: { select: { id: true, name: true } },
        posts: { select: { id: true, title: true } },
      },
    });
    console.log('Created comment:', JSON.stringify(newComment, null, 2));
  } catch (error) {
    console.error('Test error:', error);
    if (error.code === 'P2002') {
      console.error('Unique constraint violation (e.g., duplicate email)');
    } else if (error.code === 'P2025') {
      console.error('Record not found (e.g., user or post not found)');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();




















// import prisma from './lib/prisma.js'

// async function main(){
// //creating user
// // const newUser = await prisma.users.create({
// //       data: {
// //         name: "mike",
// //         email: 'mike@gmail.com',
// //         password: 'mike1234',
// //         posts: {
// //           create: [
// //             {title: 'mike post', content: 'sdfasfd !'},
// //             {title: 'dsaf ', content: 'roger that'}
// //           ],
// //         },
// //       },

// // });
// // console.log('created user:', newUser)

// //read users
// // const allUsers = await prisma.users.findMany({
// //     include: {posts: true},
// // });
// // console.log('All users with posts:', JSON.stringify(allUsers,null,2))


// //update name
// const updatedUser = await prisma.users.update({
//   where: { email: 'mike@gmail.com' },
//   data: { name: 'Alice Johnson' },
// });
// console.log('Updated user:', updatedUser);


// //update posts
// // const updatedUser = await prisma.users.update({
// //   where: { email: 'dummy1@example.com' }, // Replace with a valid email
// //   data: {
// //     posts: {
// //       create: [
// //         { title: 'NEW TITLE', content: 'UPDATED POST' },
// //       ],
// //     },
// //   },
// //   include: { posts: true }, // Optional: Include posts in the returned user
// // });
// // console.log('Updated user:', updatedUser);


// //   DELETE the first post
// //   const deletedPost = await prisma.posts.delete({
// //     where: { id: 1 },
// //   });
// //   console.log('Deleted post:', deletedPost);
// }

// main()
//   .catch(e => {
//     console.error(e);
//   })

//   .finally(async () => {
//     await prisma.$disconnect();
//   });


