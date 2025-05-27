import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from 'generated/prisma';

interface signupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { }
  async signup({ name, phone, email, password }: signupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email: email
      }
    });
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new ConflictException('Error hashing password');
    }
    console.log('hashedPassword', hashedPassword);
    const user = await this.prismaService.user.create({
      data: {
        email: email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      }
    });
    return user;
  }
}
