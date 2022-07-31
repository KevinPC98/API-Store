import { Body, Controller, Post } from '@nestjs/common';
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
  async logIn(@Body() input: LoginDto) {
    return this.authService.login(input);
  }
}
