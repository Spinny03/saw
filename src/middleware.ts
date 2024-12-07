import { auth } from '@/auth';
export default auth((req) => {
  //capire req.auth
  if (req.auth && !req.nextUrl.pathname.startsWith('/api/auth/signin')) {
    const newUrl = new URL('/api/auth/signin', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
