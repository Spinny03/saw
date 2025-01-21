import { getUserId } from '@/libs/userClient';
import { prisma } from '@/prisma';
import bcrypt from 'bcrypt';

import { User } from '@prisma/client';

export async function GET() {
  const user: User[] = await prisma.user.findMany({});

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/*create a new user i dati sono nel body della post*/
export async function POST(request: Request) {
  const body = await request.json();
  /*genera un imagine con avatar lettera e salvala nel blob storage*/
  const randomColorForAvatar = Math.floor(Math.random() * 16777215).toString(
    16
  );
  const imageUrl = `https://ui-avatars.com/api/?name=${body.name}+${body.surname}&background=random&color=${randomColorForAvatar}`;
  console.log(imageUrl);
  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      surname: body.surname,
      password: await bcrypt.hash(body.password, 10),
      image: imageUrl,
    },
  });

  return new Response(JSON.stringify(user), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
