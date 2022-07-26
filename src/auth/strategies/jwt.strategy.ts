import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY as string,
    });
  }

  async validate(payload: any): Promise<any> {
    try {
      const token = await this.prismaService.token.findUnique({
        where: {
          jti: payload.sub,
        },
        select: {
          user: {
            select: {
              uuid: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      return {
        uuid: token?.user.uuid,
        role: token?.user.role.name,
      };
    } catch (error) {
      throw new UnauthorizedException('token is invalid');
    }
  }
}
