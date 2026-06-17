// src/auth/auth.service.ts
import {
  Injectable, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El correo ya está registrado');

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        userType: dto.userType || 'STUDENT',
      },
      select: {
        id: true, email: true, firstName: true,
        lastName: true, role: true, userType: true, createdAt: true,
      },
    });

    const token = this.signToken(user.id, user.email, user.role);
    return { user, access_token: token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    const { password, ...safeUser } = user;
    const token = this.signToken(user.id, user.email, user.role);
    return { user: safeUser, access_token: token };
  }

  private signToken(userId: number, email: string, role: string): string {
    return this.jwt.sign(
      { sub: userId, email, role },
      { secret: this.config.get('JWT_SECRET'), expiresIn: '24h' },
    );
  }
}