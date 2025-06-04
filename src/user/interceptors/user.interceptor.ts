import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, handler: CallHandler) {
    // Here you can manipulate the request or response
    // For example, you can log the user information
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split("Bearer ")[1];
    const user = await jwt.decode(token);

    if (user) {
      request.user = user;
    }
    return handler.handle();
  }
}