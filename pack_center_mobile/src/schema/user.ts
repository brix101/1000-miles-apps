export interface UserResource {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  role: string;
  permission: string;
  language?: string;
  createdAt: Date;
  updatedAt: Date;
}
