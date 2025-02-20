export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenant: Tenant | null;
  createdAt: string;
};

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};

export type UpdateUserData = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: number;
};

export type Tenant = {
  id: number;
  name: string;
  address: string;
};

export type Category = {
  name: string;
  _id: string;
};

export type FieldData = {
  name: string[];
  value?: string;
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  isPublish: boolean;
  description: string;
  category: Category;
  createdAt: string;
};
