// ✅ Role types
export type AdminRole = "admin";
export type UserRole = "user"; // ✅ Users can only be "user"

// ✅ Status types
export type UserStatus = "active" | "inactive";
export type ModuleStatus = "active" | "inactive";

// ✅ Admin type (Admin Only)
export interface Admin {
  _id: string;
  email: string;
  username: string;
  password: string;
  role: AdminRole; // ✅ Only "admin"
}

// ✅ User type (Only "user" role allowed)
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole; // ✅ Users can only be "user"
  status: UserStatus; // ✅ Only "active" | "inactive"
  modules: number[]; // ✅ List of module IDs assigned to user
}

// ✅ Module type
export interface Module {
  id: number;
  name: string;
  status: ModuleStatus; // ✅ Only "active" | "inactive"
  users: number[]; // ✅ List of user IDs assigned to the module
}
