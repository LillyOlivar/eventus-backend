// src/events/dto/create-event.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsInt, Min, IsDateString, MinLength, MaxLength,
  IsOptional, IsUrl, IsEnum,
} from 'class-validator';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @ApiProperty({ example: 'Seminario de IA 2025' })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Descripción detallada del evento...' })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ example: 'Auditorio Principal - Unicauca' })
  @IsString()
  location: string;

  @ApiProperty({ example: '2025-07-15T09:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-07-15T17:00:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 'Seminario', enum: ['Seminario', 'Taller', 'Conferencia', 'Hackathon', 'Otro'] })
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ enum: EventStatus })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
