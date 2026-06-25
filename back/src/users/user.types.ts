export type ExternalUser = {
  id: number | string;
  name: string;
  username: string;
  email: string;
};

export enum UserRole {
USER = 'user',
ADMIN = 'admin',
};
