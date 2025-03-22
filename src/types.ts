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

// export type Category = {
//   name: string;
//   _id: string;
// };

export type FieldData = {
  name: string[];
  value?: string;
};

//: Type of Category Object
export interface IPriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: string[];
  };
}

export interface IAttribute {
  name: string;
  widgetType: "switch" | "radio";
  defaultValue: string;
  availableOptions: string[];
}

export interface ICategory {
  _id: string;
  name: string;
  priceConfiguration: IPriceConfiguration;
  attributes: IAttribute[];
}

export type Product = {
  _id: string;
  name: string;
  image: string;
  isPublish: boolean;
  description: string;
  category: ICategory;
  createdAt: string;
};

export type ImageField = { file: File };
export type CreateProductData = Product & { image: ImageField };
