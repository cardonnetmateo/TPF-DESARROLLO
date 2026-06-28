export type ExternalUser = {
  id: number | string;
  email: string;
  role: string;
  createdAt: Date;
};

export enum UserRole {
USER = 'user',
ADMIN = 'admin',
};
