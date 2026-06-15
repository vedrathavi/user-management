import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import type { UserRoles, UserStatus } from '@repo/types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer',
  })
  role!: UserRoles;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status!: UserStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({
    nullable: true,
  })
  phone!: string;

  @Column({
    nullable: true,
  })
  department!: string;
}
