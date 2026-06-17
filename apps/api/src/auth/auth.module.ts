import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
// import { SeedAdminService } from './seed-admin.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { SeedAdminService } from './seed-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (() => {
            const expires = configService.get<string | number>('JWT_EXPIRES_IN');
            if (expires === undefined || expires === null) return 86400;
            const parsed = Number(expires);
            return isNaN(parsed) ? expires : parsed;
          })() as any,
        },
      }),
    }),
  ],

  providers: [AuthService, JwtAuthGuard, RolesGuard, SeedAdminService],
  controllers: [AuthController],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
