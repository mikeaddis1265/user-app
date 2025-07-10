import prisma from '../../../lib/prisma'



export async function GET(){
  try{
    const users = await prisma.users.findMany();
    return Response.json(users);
  }catch(error){
    console.log('GET error', error);
    return new Response(JSON.stringify({error: 'internal server error'}), {status: 500})
  }
}  

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Missing name or email' }), {
        status: 400,
      });
    }

    const newUser = await prisma.users.create({
      data: { name, email, password },
    });

    console.log('new user has been added');
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Post error', error);
    return new Response(JSON.stringify({ error: 'internal server errror' }), {
      status: 500,
    });
  }
}




