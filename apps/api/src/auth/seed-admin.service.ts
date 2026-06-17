import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedAdminService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword!, 10);

    await this.userRepository.save(
      this.userRepository.create({
        firstName: 'System',
        lastName: 'Admin',
        email: adminEmail!,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      }),
    );

    console.log('Admin user created successfully');
  }
}
