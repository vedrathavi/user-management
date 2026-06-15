import type { UserRoles, UserStatus } from '@repo/types';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MaxLength(50)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsEnum(['admin', 'editor', 'viewer'])
  role!: UserRoles;

  @IsEnum(['active', 'inactive'])
  status!: UserStatus;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  department?: string;
}
