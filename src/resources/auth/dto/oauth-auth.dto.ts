import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthAuthDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
