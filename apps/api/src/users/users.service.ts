import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  SearchUserDto,
  sortableFields,
  FilterValuesDto,
} from './dto/search-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if(createUserDto.role === 'admin') {
      throw new ForbiddenException('You cannot create an admin user');
    }
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.email, 10);
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.userRepository.save(user);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('A user with this email already exists');
      }

      throw error;
    }
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: any) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // 0. Viewer can only edit themselves and cannot change role or status
    if (currentUser.role === 'viewer') {
      if (currentUser.sub !== id) {
        throw new ForbiddenException('Viewers can only edit their own profile');
      }
      if (updateUserDto.role || updateUserDto.status) {
        throw new ForbiddenException('Viewers cannot change role or status');
      }
    }

    // 1. Editor cannot edit admin
    if (currentUser.role === 'editor' && user.role === 'admin') {
      throw new ForbiddenException('Editors cannot edit admin users');
    }

    // 2. Editor cannot change roles
    if (currentUser.role === 'editor' && updateUserDto.role && updateUserDto.role !== user.role) {
      throw new ForbiddenException('Editors cannot change roles');
    }

    // 3. User cannot change their own role (demote self)
    if (currentUser.sub === id && updateUserDto.role && updateUserDto.role !== user.role) {
      throw new ForbiddenException('You cannot change your own role');
    }

    // 4. Cannot create additional admins
    if (updateUserDto.role === 'admin' && user.role !== 'admin') {
      throw new ForbiddenException('You cannot assign the admin role');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async delete(id: string, currentUser: any) {
    if (currentUser.sub === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    await this.userRepository.remove(user);
    return { message: `User with id ${id} has been deleted` };
  }

  private applyFilters(
    qb: any,
    filters?: FilterValuesDto[],
    excludeField?: string,
  ) {
    if (!filters) return;

    filters.forEach((filter, index) => {
      if (filter.field === excludeField) return;

      const paramName = `val_${filter.field}_${index}`;

      if (filter.operator) {
        switch (filter.operator) {
          case 'equals':
            qb.andWhere(`LOWER(user.${filter.field}) = LOWER(:${paramName})`, {
              [paramName]: filter.value,
            });
            break;
          case 'notEquals':
            qb.andWhere(
              `LOWER(user.${filter.field}) != LOWER(:${paramName}) OR user.${filter.field} IS NULL`,
              {
                [paramName]: filter.value,
              },
            );
            break;
          case 'contains':
            qb.andWhere(
              `LOWER(user.${filter.field}) LIKE LOWER(:${paramName})`,
              {
                [paramName]: `%${filter.value}%`,
              },
            );
            break;
          case 'notContains':
            qb.andWhere(
              `LOWER(user.${filter.field}) NOT LIKE LOWER(:${paramName}) OR user.${filter.field} IS NULL`,
              {
                [paramName]: `%${filter.value}%`,
              },
            );
            break;
          case 'startsWith':
            qb.andWhere(
              `LOWER(user.${filter.field}) LIKE LOWER(:${paramName})`,
              {
                [paramName]: `${filter.value}%`,
              },
            );
            break;
          case 'endsWith':
            qb.andWhere(
              `LOWER(user.${filter.field}) LIKE LOWER(:${paramName})`,
              {
                [paramName]: `%${filter.value}`,
              },
            );
            break;
          case 'gte':
            qb.andWhere(`user.${filter.field} >= :${paramName}`, {
              [paramName]: new Date(filter.value || ''),
            });
            break;
          case 'lte':
            const lteDate = new Date(filter.value || '');
            lteDate.setHours(23, 59, 59, 999);
            qb.andWhere(`user.${filter.field} <= :${paramName}`, {
              [paramName]: lteDate,
            });
            break;
        }
      } else if (filter.values && filter.values.length > 0) {
        if (filter.field === 'createdAt') {
          qb.andWhere(
            `TO_CHAR(user.createdAt, 'YYYY-MM-DD') IN (:...values_${filter.field})`,
            {
              [`values_${filter.field}`]: filter.values,
            },
          );
        } else {
          qb.andWhere(`user.${filter.field} IN (:...values_${filter.field})`, {
            [`values_${filter.field}`]: filter.values,
          });
        }
      }
    });
  }

  private async getFilterOptions(filters?: FilterValuesDto[]) {
    const filterableFields = [
      'firstName',
      'lastName',
      'email',
      'role',
      'status',
      'department',
      'phone',
      'createdAt',
    ];

    const result: Record<string, string[]> = {};

    const promises = filterableFields.map(async (field) => {
      const qb = this.userRepository.createQueryBuilder('user');
      const selectExpr =
        field === 'createdAt'
          ? `DISTINCT TO_CHAR(user.createdAt, 'YYYY-MM-DD')`
          : `DISTINCT user.${field}`;

      qb.select(selectExpr, 'value').where(`user.${field} IS NOT NULL`);

      this.applyFilters(qb, filters, field);

      const rows = await qb
        .orderBy('value', 'ASC')
        .getRawMany<{ value: any }>();

      result[field] = rows
        .map((row) =>
          row.value !== null && row.value !== undefined
            ? String(row.value)
            : '',
        )
        .filter(Boolean);
    });

    await Promise.all(promises);
    return result;
  }

  async search(dto: SearchUserDto) {
    const qb = this.userRepository.createQueryBuilder('user');

    this.applyFilters(qb, dto.filters);

    qb.skip((dto.page - 1) * dto.pageSize);
    qb.take(dto.pageSize);

    if (dto.sort && sortableFields.includes(dto.sort.field)) {
      qb.orderBy(`user.${dto.sort.field}`, dto.sort.order);
    }

    const [rows, total] = await qb.getManyAndCount();
    const filterOptions = await this.getFilterOptions(dto.filters);

    return {
      rows,
      total,
      page: dto.page,
      pageSize: dto.pageSize,
      filters: dto.filters,
      filterOptions,
    };
  }
}
