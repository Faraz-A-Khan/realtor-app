import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  isPhoneNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserType } from 'generated/prisma';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid international format',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  @IsString()
  userType: UserType;
}
