import { Credentials } from "../types";
import { api } from "./client";

export const login = (credentials: Credentials) =>
  api.post("/auth/login", credentials);

export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUser = () => api.get("/users");
export const getRestaurants = () => api.get("/tenants");
