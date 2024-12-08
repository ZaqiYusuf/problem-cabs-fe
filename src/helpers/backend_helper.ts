import { idText } from "typescript";
import { APIClient } from "./api_helper";

const api = new APIClient();



export const postLoginAPI = (data: any) => {
  return api.create("auth/login", data);
};

// Tenant
export const getTenantAPI = () => {
    return api.get("tenants");
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
    return api.get("locations");
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
  return api.get("packages");
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
  return api.get("users");
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
  return api.get("settings");
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

//  CUSTOMERS

export const postCustomer = (data: any) => {
  return api.createForm("customers", data);
}

export const getCustomerApi = () => {
  return api.get("customers");
}

export const getCustomerAllApi = () => {
  return api.get("customers/all/data");
}





// ENTRY PERMISSIONS

export const getEntryPermits = () => {
  return api.get("process-imks");
}

export const postEntryPermits = (data: any) => {
  return api.createForm("process-imks", data);
}

export const updateEntryPermits = (data: any) => {
  return api.createForm("process-imks/"+data.id, data);
}
export const deleteEntryPermits = (id: any) => {
  return api.delete("process-imks/"+id, null);
}



// Pyments (ADMIN)
export const getPayments = () => {
  return api.get("imk/all/data");
}

export const updatePayments = (data: any) => {
  return api.createForm("approve/"+data.id, data);
}

export const postPayment = (data: any) => {
  return api.createForm("imk/"+data.user_id, data);
}



// Payment (user)
export const getPaymentsUser = () => {
  return api.get("/user/imk");
}