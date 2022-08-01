import { Exclude } from 'class-transformer';

@Exclude()
export class TokenDto {
  accessToken: string;
  expirationToken: number;
}
