import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';
import { put } from '@vercel/blob';
import path from 'path';

import { User } from '@prisma/client';

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user: User | null = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  const formData = await request.formData();
  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const surname = formData.get('surname') as string;
  const password = formData.get('password') as string;
  const image = formData.get('image') as File | null;

  let imageUrl;
  if (image) {
    const filePath = `profile/${userId}${path.extname(image.name)}`;
    const buffer = Buffer.from(await image.arrayBuffer());
    const { url } = await put(filePath, buffer, {
      access: 'public',
    });
    imageUrl = url;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        surname,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response('Error updating user', { status: 500 });
  }
}
