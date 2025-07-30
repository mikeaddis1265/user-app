import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const withAuth = function (handler) {
  return async function (req, ctx) {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = decoded;

      
      return await handler(req, ctx);
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  };
};



// export const config = {
//   matcher: ['/about/:path*', '/dashboard/:path*'],
// }