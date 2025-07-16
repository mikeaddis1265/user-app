import prisma from '../../../lib/prisma'
import { sendErrorResponse } from '../../../utils/apiResponse';

export async function GET(){
  try{
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    return Response.json(users);
  }catch(error){
    console.log('GET error', error);
    return sendErrorResponse('Failed to fetch users', 500);
  }
}  
