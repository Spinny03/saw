import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  async function main() {
    // Crea un nuovo utente
    const user = await prisma.user.findUnique({
      where: {
        id: "12",
      },
    });
    console.log("Utente creato:", user);

    // Recupera tutti gli utenti
    const users = await prisma.user.findMany();
    console.log("Tutti gli utenti:", users);
  }

  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  return new Response("Utente creato", { status: 200 });
}
