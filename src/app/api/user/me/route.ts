import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';
import { put } from '@vercel/blob';
import path from 'path';
import bcrypt from 'bcrypt';

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

  let email, name, surname, password, image;
  let contentType = request.headers.get('content-type');

  if (contentType?.includes('multipart/form-data')) {
    const formData = await request.formData();
    email = formData.get('email') as string;
    name = formData.get('name') as string;
    surname = formData.get('surname') as string;
    password = formData.get('password') as string;
    image = formData.get('image') as File | null;
  } else {
    const jsonData = await request.json();
    email = jsonData.email;
    name = jsonData.name;
    surname = jsonData.surname;
    password = jsonData.password;
    image = null;
  }

  let imageUrl;
  if (image) {
    const filePath = `profile/${userId}${path.extname(image.name)}`;
    const buffer = Buffer.from(await image.arrayBuffer());
    const { url } = await put(filePath, buffer, {
      access: 'public',
    });
    imageUrl = url;
  }

  let passwordHash;
  if (password) {
    // Fixed the condition from !password to password
    passwordHash = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(surname && { surname }),
        ...(passwordHash && { password: passwordHash }),
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
