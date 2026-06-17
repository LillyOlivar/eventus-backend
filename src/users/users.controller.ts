// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser } from '../common/decorators/get-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getMe(@GetUser() user: any) {
    return user;
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (solo ADMIN)' })
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, createdAt: true,
        _count: { select: { registrations: true } },
      },
    });
  }
}
