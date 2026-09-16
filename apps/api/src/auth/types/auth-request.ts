import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
  };

  cookies: {
    skymeet_access_token?: string;
  };
}