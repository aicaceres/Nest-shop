import { IncomingHttpHeaders } from 'http';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { GetUser, GetRawHeaders } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Private rout to get user and headers from request
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    // get User custom decorator
    @GetUser('email') user: User,
    // get headers using custom decorators
    @GetRawHeaders() rawHeaders: string[],
    // get headers with http headers.
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return headers;
  }

  // Private route to check if user get role
  @Get('privatebyrole')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRouteByRole(
    // get User custom decorator
    @GetUser('email') user: User,
  ) {
    return user;
  }
}
