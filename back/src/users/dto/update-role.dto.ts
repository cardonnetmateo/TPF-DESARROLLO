import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../user.types';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}
