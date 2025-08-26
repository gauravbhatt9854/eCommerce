import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// // const publicRoutes = ['/sign-in', '/sign-up', '/forget-password' , '/ads.txt'];
// const publicRoutes = ['/*'];

// // ✅ Use `Uint8Array` for secret key (Edge Runtime compatible)
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_secret_key');

// export async function middleware(request: NextRequest) {
//   const { nextUrl } = request;
//   const pathname = nextUrl.pathname;

//   // 🔒 Extract token from cookies
//   const token = request.cookies.get('token')?.value || null;


//   // ✅ Allow all API routes
//   if (pathname.startsWith('/api/')) {
//     return NextResponse.next();
//   }

//   // ✅ Allow public routes
//   if (publicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // 🚫 If no token → Redirect to /sign-up
//   if (!token) {
//     console.log('Redirecting to /sign-in (No Token)');
//     return NextResponse.redirect(new URL('/sign-in', request.url), {
//       headers: { 'Cache-Control': 'no-store' }, // ✅ Prevent redirect caching
//     });
//   }

//   try {
//     // ✅ Verify JWT token using `jose`
//     // console.log('Verifying Token...'); // Debug log
//     const { payload } = await jwtVerify(token, JWT_SECRET);

//     // console.log('Decoded Token:', payload); // ✅ Correct variable name
//     return NextResponse.next();

//   } catch (error) {
//     console.error('JWT Verification Error:', error);
//     console.log('Redirecting to /sign-in (Invalid/Expired Token)');
//     return NextResponse.redirect(new URL('/sign-in', request.url), {
//       headers: { 'Cache-Control': 'no-store' },
//     });
//   }
// }

// // ✅ FIXED MATCHER: Allows /sign-up properly
// export const config = {
//   matcher: [
//     '/((?!_next/|static/|favicon.ico|sign-up).*)', // ✅ Now allows /sign-up
//   ],
// };


export async function middleware(request: NextRequest) {

  return 
}
