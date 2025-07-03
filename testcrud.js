import prisma from './lib/prisma.js'

async function main(){
//creating user
// const newUser = await prisma.users.create({
//       data: {
//         name: "dfadsf",
//         email: 'dfas@gmail.com',
//         posts: {
//           create: [
//             {title: 'newpost', content: 'd1 do you copy!'},
//             {title: 'recived', content: 'roger that'}
//           ],
//         },
//       },

// });
// console.log('created user:', newUser)

//read users
// const allUsers = await prisma.users.findMany({
//     include: {posts: true},
// });
// console.log('All users with posts:', JSON.stringify(allUsers,null,2))


//update name
// const updatedUser = await prisma.users.update({
//   where: { email: 'alice@example.com' },
//   data: { name: 'Alice Johnson' },
// });
// console.log('Updated user:', updatedUser);


//update posts
const updatedUser = await prisma.users.update({
  where: { email: 'dummy1@example.com' }, // Replace with a valid email
  data: {
    posts: {
      create: [
        { title: 'NEW TITLE', content: 'UPDATED POST' },
      ],
    },
  },
  include: { posts: true }, // Optional: Include posts in the returned user
});
console.log('Updated user:', updatedUser);


//   DELETE the first post
//   const deletedPost = await prisma.posts.delete({
//     where: { id: 1 },
//   });
//   console.log('Deleted post:', deletedPost);
}

main()
  .catch(e => {
    console.error(e);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
