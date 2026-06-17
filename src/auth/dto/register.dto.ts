// src/auth/dto/register.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional, IsIn,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'juan@unicauca.edu.co' })
  @IsEmail({}, { message: 'Correo electrónico inválido' })
  email: string;

  @ApiPropertyOptional({ example: 'STUDENT', enum: ['STUDENT', 'TEACHER'] })
  @IsOptional()
  @IsIn(['STUDENT', 'TEACHER'])
  userType?: string;

  @ApiProperty({ example: 'Secure@1234' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'La contraseña debe tener mayúscula, minúscula, número y carácter especial',
  })
  password: string;
}