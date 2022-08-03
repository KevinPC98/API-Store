import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() input: CreateUserDto) {
    return this.authService.createUser(input);
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async logIn(@Body() input: LoginDto) {
    return this.authService.login(input);
  }
}
