import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async validate(payload: any): Promise<any> {
    console.log('ENTRO');
    console.log(payload);
    try {
      const token = await this.prismaService.token.findUnique({
        where: {
          jti: payload.sub,
        },
        select: {
          user: {
            select: {
              uuid: true,
            },
          },
        },
      });

      console.log(token);
      return token;
      /*       return {
        uuid: user.uuid,
        role: user.role,
      }; 
      return true;
      */
    } catch (error) {
      throw new UnauthorizedException('token is invalid');
    }
  }
}
