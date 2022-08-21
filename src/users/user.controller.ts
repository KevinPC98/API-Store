import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserDto } from 'src/users/dto/response/user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/common/enum';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.client)
  @Get('/profile')
  async gettProfile(@GetUser() user: User): Promise<UserDto> {
    return plainToInstance(
      UserDto,
      await this.usersService.findOne({ uuid: user.uuid }),
    );
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @GetUser() user: User,
    @Body() input: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.usersService.updateUser({ uuid: user.uuid }, input);
  }
}
