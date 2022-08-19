import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() input: CreateUserDto) {
    return this.authService.createUser(input);
  }

  //@UseGuards(AuthGuard('local'))
  //@UseGuards(LocalAuthGuard)
  @Post('/login')
  async logIn(@Body() input: LoginDto) {
    console.log('ENTRO');
    return this.authService.login(input);
  }

  //@UseGuards(JwtAuthGuard)
}
