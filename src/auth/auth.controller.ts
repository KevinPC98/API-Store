import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { UserWithTokenDto } from './dto/response/user-with-token.dto';
import { TokenDto } from './dto/response/token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() input: CreateUserDto): Promise<UserWithTokenDto> {
    return await this.authService.createUser(input);
  }

  @Post('/login')
  async logIn(@Body() input: LoginDto): Promise<TokenDto> {
    return await this.authService.login(input);
  }

  @Get('/logout')
  async logOut(@Query('token') token: string): Promise<boolean> {
    console.log(token);
    return await this.authService.logout(token);
  }
}
