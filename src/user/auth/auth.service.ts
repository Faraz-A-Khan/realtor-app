import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from 'generated/prisma';
import * as jwt from 'jsonwebtoken';
interface signupParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}
interface signinParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(
    { name, phone, email, password }: signupParams,
    userType: UserType,
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      throw new ConflictException('Error hashing password');
    }
    const user = await this.prismaService.user.create({
      data: {
        email: email,
        name,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });

    return this.generateJWT(user.name, user.id);
  }

  async signin({ email, password }: signinParams) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new HttpException('User with this email does not exist', 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 400);
    }

    return this.generateJWT(user.name, user.id);
  }

  private generateJWT(name: string, id: number): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    return jwt.sign({ name: name, id: id }, secret, { expiresIn: 3600000 });
  }
  generateProductKey(email: string, UserType: UserType) {
    const prodKey = process.env.PRODUCT_KEY_SECRET;
    const string = `${email}-${UserType}-${prodKey}`;
    return bcrypt.hash(string, 10);
  }
}
