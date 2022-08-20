import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TokenDto {
  @Expose()
  accessToken: string;

  @Expose()
  expirationToken: number;
}
