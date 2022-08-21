import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { UserWithTokenDto } from './dto/response/user-with-token.dto';
import { TokenDto } from './dto/response/token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/role.decorator';
import { Role } from 'src/common/enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() input: CreateUserDto): Promise<UserWithTokenDto> {
    return await this.authService.createUser(input);
  }

  //@UseGuards(AuthGuard('local'))
  //@UseGuards(LocalAuthGuard)
  @Post('/login')
  async logIn(@Body() input: LoginDto): Promise<TokenDto> {
    return await this.authService.login(input);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.client)
  @Get('/profile')
  async gettProfile(): Promise<string> {
    return 'GET PROFILE';
  }
}
