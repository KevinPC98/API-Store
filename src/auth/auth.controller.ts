import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { UserWithTokenDto } from './dto/response/user-with-token.dto';
import { TokenDto } from './dto/response/token.dto';

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
}
