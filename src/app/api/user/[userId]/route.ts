import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';

import { User } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // Controlla che l'ID utente sia fornito
  if (!userId) {
    return new Response('User ID is required', { status: 400 });
  }

  const body = await request.json();
  const { email, name, surname } = body;

  const randomColorForAvatar = Math.floor(Math.random() * 16777215).toString(
    16
  );
  const imageUrl =
    name && surname
      ? `https://ui-avatars.com/api/?name=${name}+${surname}&background=random&color=${randomColorForAvatar}`
      : undefined;

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
