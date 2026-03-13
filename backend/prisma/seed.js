import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Trabalho', color: '#3b82f6' }, // Blue
  { name: 'Pessoal', color: '#ec4899' },  // Pink/Pink text
  { name: 'Estudos', color: '#f59e0b' },  // Amber
  { name: 'Casa', color: '#10b981' }      // Emerald
];

async function main() {
  console.log('Starting DB Seed...');

  for (const cat of defaultCategories) {
    const existingCat = await prisma.category.findUnique({
      where: { name: cat.name }
    });

    if (!existingCat) {
      await prisma.category.create({
        data: cat
      });
      console.log(`Created category: ${cat.name}`);
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
  }

  console.log('Seeding Database completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
