// src/events/events.service.ts
import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string, status?: string) {
    return this.prisma.event.findMany({
      where: {
        ...(category && { category }),
        ...(status && { status: status as any }),
      },
      include: {
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
        registrations: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
      },
    });
    if (!event) throw new NotFoundException(`Evento #${id} no encontrado`);
    return event;
  }

  async create(dto: CreateEventDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start) throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio');

    return this.prisma.event.create({
      data: {
        ...dto,
        startDate: start,
        endDate: end,
      },
    });
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.event.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.event.delete({ where: { id } });
  }

  async getStats() {
    const [totalEvents, totalUsers, totalRegistrations, eventsByCategory] = await Promise.all([
      this.prisma.event.count(),
      this.prisma.user.count(),
      this.prisma.registration.count(),
      this.prisma.event.groupBy({ by: ['category'], _count: true }),
    ]);

    const upcomingEvents = await this.prisma.event.count({ where: { status: 'UPCOMING' } });

    return {
      totalEvents,
      totalUsers,
      totalRegistrations,
      upcomingEvents,
      eventsByCategory,
    };
  }
}
