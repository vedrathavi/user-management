import {
  IsArray,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsString,
  IsIn,
} from 'class-validator';

import { Type } from 'class-transformer';

export class FilterValuesDto {
  @IsString()
  field: string;

  @IsOptional()
  @IsArray()
  values?: string[];

  @IsOptional()
  @IsString()
  operator?: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class SortDto {
  @IsString()
  field: string;

  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}

export class SearchUserDto {
  @IsNumber()
  page: number = 1;
  @IsNumber()
  pageSize: number = 20;

  @IsOptional()
  @ValidateNested()
  @Type(() => SortDto)
  sort?: SortDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterValuesDto)
  filters?: FilterValuesDto[];
}

export const sortableFields = [
  'firstName',
  'lastName',
  'email',
  'role',
  'status',
  'department',
  'phone',
  'createdAt',
];
