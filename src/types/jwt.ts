import { Role } from './role';

export interface OauthIdTokenPayload {
  iss: 'https://accounts.google.com';
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: Role;
  rememberMe?: boolean;
  iat?: number;
  exp?: number;
}
