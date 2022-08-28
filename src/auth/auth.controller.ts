import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/request/create-user.dto';
import { LoginDto } from './dto/request/login.dto';
import { UserWithTokenDto } from './dto/response/user-with-token.dto';
import { TokenDto } from './dto/response/token.dto';
import {
  ApiBadRequestResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'User account successfully created',
    type: UserWithTokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('/signup')
  async signUp(@Body() input: CreateUserDto): Promise<UserWithTokenDto> {
    return await this.authService.createUser(input);
  }

  @ApiResponse({
    status: 201,
    description: 'User was logged succesfully',
    type: TokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('/login')
  async logIn(@Body() input: LoginDto): Promise<TokenDto> {
    return await this.authService.login(input);
  }

  @ApiResponse({
    status: 204,
    description: 'User finished his session succesfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Token is invalid' })
  @Get('/logout')
  async logOut(@Query('token') token: string): Promise<boolean> {
    return await this.authService.logout(token);
  }
}
