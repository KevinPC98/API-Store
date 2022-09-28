import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { UserDto } from '../users/dto/response/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../common/enum';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'Return an authenticaded user profile',
    type: UserDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.client)
  @Get('/profile')
  async gettProfile(@GetUser() user: User): Promise<UserDto> {
    return plainToInstance(
      UserDto,
      await this.usersService.findOne({ uuid: user.uuid }),
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Update a user',
    type: UserDto,
  })
  @ApiBearerAuth()
  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @GetUser() user: User,
    @Body() input: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.usersService.updateUser({ uuid: user.uuid }, input);
  }
}
