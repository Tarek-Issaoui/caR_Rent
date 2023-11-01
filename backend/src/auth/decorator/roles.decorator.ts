import { SetMetadata } from '@nestjs/common';

export const RolePath = (roles: string[]) => SetMetadata('role-path', roles);