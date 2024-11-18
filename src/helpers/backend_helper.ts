import { idText } from "typescript";
import { APIClient } from "./api_helper";

const api = new APIClient();

export const postLoginAPI = (data: any) => {
  return api.create("auth/login", data);
};

// Tenant
export const getTenantAPI = () => {
    return api.get("tenants", null);
}
export const postTenantAPI = (data: any) => {
  return api.create("tenants", data);
}
export const updateTenantAPI = (data: any) => {
  return api.put("tenants/"+data.id, data);
}
export const deleteTenantAPI = (id: any) => {
  return api.delete("tenants/"+id, null);
}

//location
export const getLocationAPI = () => {
    return api.get("locations", null);
}
export const postLocationAPI = (data: any) => {
  return api.create("locations", data);
}
export const updateLocationAPI = (data: any) => {
  return api.put("locations/"+data.id, data);
}
export const deleteLocationAPI = (id: any) => {
  return api.delete("locations/"+id, null);
}

//package
export const getPackageAPI = () => {
  return api.get("packages", null);
}
export const postPackageAPI = (data: any) => {
  return api.create("packages", data);
}
export const updatePackageAPI = (data: any) => {
  return api.put("packages/"+data.id, data);
}
export const deletePackageAPI = (id: any) => {
  return api.delete("packages/"+id, null);
}


//users
export const getUserAPI = () => {
  return api.get("users", null);
}
export const postUserAPI = (data: any) => {
  return api.create("users", data);
}
export const updateUserAPI = (data: any) => {
  return api.put("users/"+data.id, data);
}
export const deleteUserAPI = (id: any) => {
  return api.delete("users/"+id, null);
}

//setting
export const getSettingAPI = () => {
  return api.get("settings", null);
}
export const postSettingAPI = (data: any) => {
  return api.create("settings", data);
}
export const updateSettingAPI = (data: any) => {
  return api.put("settings/"+data.id, data);
}
export const deleteSettingAPI = (id: any) => {
  return api.delete("settings/"+id, null);
}

