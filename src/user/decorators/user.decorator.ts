import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface UserDetails {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const user = context.switchToHttp().getRequest().user;
  if (!user) {
    throw new Error("User not found in request");
  }
  return user;
});