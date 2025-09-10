import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.delete(ACCESS_TOKEN);
  response.cookies.delete(REFRESH_TOKEN);

  return response;
}
