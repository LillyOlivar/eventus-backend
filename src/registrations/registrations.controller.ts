// src/registrations/registrations.controller.ts
import {
  Controller, Post, Delete, Get, Param, ParseIntPipe,
  UseGuards, Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { RegistrationsService } from './registrations.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('registrations')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post('events/:eventId')
  @ApiOperation({ summary: 'Inscribirse a un evento' })
  register(
    @GetUser('id') userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.registrationsService.register(userId, eventId);
  }

  @Delete('events/:eventId')
  @ApiOperation({ summary: 'Cancelar inscripción a un evento' })
  cancel(
    @GetUser('id') userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.registrationsService.cancel(userId, eventId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Ver mis inscripciones' })
  myRegistrations(@GetUser('id') userId: number) {
    return this.registrationsService.getUserRegistrations(userId);
  }

  @Post('events/:eventId/users/:userId/attendance')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Registrar asistencia (solo ADMIN)' })
  markAttendance(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body('attended') attended: boolean,
  ) {
    return this.registrationsService.markAttendance(userId, eventId, attended);
  }
}
