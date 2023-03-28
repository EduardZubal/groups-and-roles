export interface RolesI {
  id: number;
  value: string;
}

export interface RoleItemI {
  id: string;
  name: string;
  active: boolean;
  groupId: string;
  roleName: string;
}

export enum ROLE_NAME {
  Admin = 'Admin',
  Moderator = 'Moderator',
  Owner = 'Owner',
  Guest = 'Guest',
}