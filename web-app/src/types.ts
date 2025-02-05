import { ObjectId } from "mongodb";

// ✅ Role types
export type AdminRole = "admin";
export type UserRole = "user"; // ✅ Users can only be "user"

// ✅ Status types
export type UserStatus = "active" | "unactive"; // 🔹 Fixed naming: "unactive" → "inactive"

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
  _id: string; // ✅ MongoDB ObjectId as a string
  email: string;
  username: string; // ✅ Using "username" instead of "name"
  role: "user" | "admin"; // ✅ Role can be "user" or "admin"
  imageUrl: string; // ✅ Profile image URL
  modules: string[]; // ✅ List of module ObjectId strings
  lastActive: string | null; // ✅ ISO date string or null if never active
}


// ✅ Module type

export interface Module {

  _id: string;

  title: string;

  isActive: boolean;

  subscriberCount: number[];

  recommended: boolean; // Add the recommended property

}

export interface Chapter {
  _id: ObjectId | string;
  title: string;
  content: string;
}

// ✅ Define the document structure inside a module
export interface DocumentData {
  fileName: string;
  fileSize: number;
  status: DocumentStatus; // ✅ "processing" | "completed" | "failed"
  result: {
    summaries: string[]; // ✅ Array of summary texts
    keyConcepts: string[]; // ✅ Array of key concepts
    exercises: string[]; // ✅ List of exercises/questions
  };
  createdAt: string; // ✅ ISO Date string
  updatedAt: string; // ✅ ISO Date string
}

// ✅ Define module status options
export type ModuleStatus = "active" | "unactive";

// ✅ Define document processing status
export type DocumentStatus = "processing" | "completed" | "failed";

