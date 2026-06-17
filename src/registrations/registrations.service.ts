// src/registrations/registrations.service.ts
import {
  Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async register(userId: number, eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) throw new NotFoundException(`Evento #${eventId} no encontrado`);
    if (event.status === 'CANCELLED') throw new BadRequestException('Este evento ha sido cancelado');
    if (event.status === 'FINISHED') throw new BadRequestException('Este evento ya ha finalizado');
    if (event._count.registrations >= event.capacity) {
      throw new BadRequestException('No hay cupos disponibles para este evento');
    }

    const existing = await this.prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) throw new ConflictException('Ya estás inscrito en este evento');

    return this.prisma.registration.create({
      data: { userId, eventId },
      include: { event: true },
    });
  }

  async cancel(userId: number, eventId: number) {
    const reg = await this.prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!reg) throw new NotFoundException('No tienes inscripción en este evento');

    return this.prisma.registration.delete({
      where: { userId_eventId: { userId, eventId } },
    });
  }

  async getUserRegistrations(userId: number) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: {
        event: { include: { _count: { select: { registrations: true } } } },
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async markAttendance(userId: number, eventId: number, attended: boolean) {
    const reg = await this.prisma.registration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!reg) throw new NotFoundException('Inscripción no encontrada');

    return this.prisma.registration.update({
      where: { userId_eventId: { userId, eventId } },
      data: { attended },
    });
  }
}
