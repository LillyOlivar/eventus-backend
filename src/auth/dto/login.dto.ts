// src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@unicauca.edu.co' })
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email: string;

  @ApiProperty({ example: 'Admin@1234' })
  @IsString()
  @MinLength(8)
  password: string;
}
