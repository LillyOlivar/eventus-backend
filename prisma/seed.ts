// prisma/seed.ts
import { PrismaClient, Role, EventStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@unicauca.edu.co' },
    update: {},
    create: {
      email: 'admin@unicauca.edu.co',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Eventus',
      role: Role.ADMIN,
    },
  });

  // Create participant user
  const userPassword = await bcrypt.hash('User@1234', 10);
  const participant = await prisma.user.upsert({
    where: { email: 'estudiante@unicauca.edu.co' },
    update: {},
    create: {
      email: 'estudiante@unicauca.edu.co',
      password: userPassword,
      firstName: 'Juan',
      lastName: 'Pérez',
      role: Role.PARTICIPANT,
    },
  });

  // Create sample events
  const events = [
    {
      title: 'Seminario de Inteligencia Artificial 2025',
      description:
        'Exploración de las últimas tendencias en IA, Machine Learning y sus aplicaciones en el contexto académico y empresarial colombiano.',
      location: 'Auditorio Principal - Unicauca',
      startDate: new Date('2025-07-15T09:00:00'),
      endDate: new Date('2025-07-15T17:00:00'),
      capacity: 150,
      status: EventStatus.UPCOMING,
      category: 'Seminario',
    },
    {
      title: 'Taller: Desarrollo Web con Angular 17',
      description:
        'Taller práctico de 8 horas sobre las nuevas características de Angular 17: Signals, Deferrable Views y la nueva sintaxis de control de flujo.',
      location: 'Lab. Sistemas - Bloque B',
      startDate: new Date('2025-07-22T08:00:00'),
      endDate: new Date('2025-07-22T16:00:00'),
      capacity: 30,
      status: EventStatus.UPCOMING,
      category: 'Taller',
    },
    {
      title: 'Conferencia: Ciberseguridad y Protección de Datos',
      description:
        'Conferencia sobre protección de datos personales en Colombia, ley 1581 y mejores prácticas de ciberseguridad para organizaciones.',
      location: 'Sala de Conferencias - Edificio Admin',
      startDate: new Date('2025-08-05T10:00:00'),
      endDate: new Date('2025-08-05T12:00:00'),
      capacity: 80,
      status: EventStatus.UPCOMING,
      category: 'Conferencia',
    },
    {
      title: 'Hackathon Unicauca 2025',
      description:
        'Hackathon de 24 horas para desarrollar soluciones tecnológicas a problemas sociales del departamento del Cauca.',
      location: 'Campus Universitario - Unicauca',
      startDate: new Date('2025-08-20T08:00:00'),
      endDate: new Date('2025-08-21T08:00:00'),
      capacity: 100,
      status: EventStatus.UPCOMING,
      category: 'Hackathon',
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log('✅ Seed completado!');
  console.log('👤 Admin:', admin.email, '| Password: Admin@1234');
  console.log('👤 Participant:', participant.email, '| Password: User@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
