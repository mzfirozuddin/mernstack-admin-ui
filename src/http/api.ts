import { CreateUserData, Credentials, Tenant, UpdateUserData } from "../types";
import { api } from "./client";

export const AUTH_SERVICE = "/api/auth";
// const CATALOG_SERVICE = "/api/catalog";

export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE}/auth/login`, credentials);

export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);

// export const getUser = () => api.get("/users");
export const getUser = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/users?${queryString}`);

// export const getRestaurants = () => api.get("/tenants");
export const getRestaurants = (queryString: string) =>
  api.get(`${AUTH_SERVICE}/tenants?${queryString}`);

export const createUser = (user: CreateUserData) =>
  api.post(`${AUTH_SERVICE}/users`, user);

export const createTenant = (tenant: Tenant) =>
  api.post(`${AUTH_SERVICE}/tenants`, tenant);

export const updateUser = (user: UpdateUserData, id: number) =>
  api.patch(`${AUTH_SERVICE}/users/${id}`, user);

export const updateTenant = (tenant: Tenant, id: number) =>
  api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);

/* 
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
export const updateTenant = (tenant: Tenant, id: number) =>
  api.patch(`/tenants/${id}`, tenant);
 */
