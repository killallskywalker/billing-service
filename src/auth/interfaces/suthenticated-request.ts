import { Request } from 'express';
import { Role } from './role.enum';

export interface User {
  id: number;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}
