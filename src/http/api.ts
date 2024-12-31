import { CreateUserData, Credentials, Tenant, UpdateUserData } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
// export const getUser = () => api.get("/users");
export const getUser = (queryString: string) =>
  api.get(`/users?${queryString}`);
// export const getRestaurants = () => api.get("/tenants");
export const getRestaurants = (queryString: string) =>
  api.get(`/tenants?${queryString}`);
export const createUser = (user: CreateUserData) => api.post("/users", user);
export const createTenant = (tenant: Tenant) => api.post("/tenants", tenant);
export const updateUser = (user: UpdateUserData, id: number) =>
  api.patch(`/users/${id}`, user);
